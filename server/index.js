require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { pool } = require('./utils/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Serve static frontend files
app.use(express.static(path.join(__dirname, '..')));

// Apply migrations at startup (best-effort)
const { migrate } = require('./migrate');
migrate().catch((e) => console.warn('Migration warning:', e.message || e));

// Simple health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Register user
app.post('/api/register', async (req, res) => {
  const { name, email, password, phone, type } = req.body;
  if (!name || !email || !password || !type) return res.status(400).json({ error: 'missing_fields' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, phone, type, created_at) VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING id,name,email,type',
      [name, email, hashed, phone || '', type]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, type: user.type }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    return res.json({ user, token });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'email_exists' });
    console.error('Register error:', err && err.stack ? err.stack : err);
    // In development return the error message to help debugging
    if ((process.env.NODE_ENV || 'development') !== 'production') {
      return res.status(500).json({ error: 'server_error', details: err.message || String(err) });
    }
    return res.status(500).json({ error: 'server_error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'missing_fields' });
  try {
    const result = await pool.query('SELECT id, name, email, password_hash, type FROM users WHERE email=$1', [email]);
    if (result.rowCount === 0) return res.status(401).json({ error: 'invalid_credentials' });
    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'invalid_credentials' });
    const token = jwt.sign({ id: user.id, type: user.type }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    return res.json({ user: { id: user.id, name: user.name, email: user.email, type: user.type }, token });
  } catch (err) {
    console.error('Login error:', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'server_error', details: (err && err.message) || String(err) });
  }
});

// List jobs (public)
app.get('/api/jobs', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT j.*, u.id as employer_id, u.name as employer_name, u.email as employer_email
       FROM jobs j LEFT JOIN users u ON j.employer_id = u.id
       ORDER BY j.date_posted DESC LIMIT 100`
    );
    return res.json({ jobs: result.rows });
  } catch (err) {
    console.error('List jobs error:', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'server_error', details: err.message || String(err) });
  }
});

// Job detail
app.get('/api/jobs/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      `SELECT j.*, u.id as employer_id, u.name as employer_name, u.email as employer_email
       FROM jobs j LEFT JOIN users u ON j.employer_id = u.id WHERE j.id = $1 LIMIT 1`,
      [id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'not_found' });
    return res.json({ job: result.rows[0] });
  } catch (err) {
    console.error('Job detail error:', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'server_error', details: err.message || String(err) });
  }
});

// Current user (requires auth)
app.get('/api/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const result = await pool.query('SELECT id, name, email, phone, type, created_at FROM users WHERE id=$1', [payload.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'not_found' });
    return res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Me error:', err && err.stack ? err.stack : err);
    return res.status(401).json({ error: 'invalid_token', details: err.message || String(err) });
  }
});

// Post job
app.post('/api/jobs', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const { title, description, location, workType, salary, contactInfo } = req.body;
    if (!title || !description) return res.status(400).json({ error: 'missing_fields' });

    const result = await pool.query(
      `INSERT INTO jobs (title, description, location, work_type, salary, contact_info, employer_id, status, date_posted)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'Active',NOW()) RETURNING *`,
      [title, description, location, workType, salary, contactInfo, payload.id]
    );
    return res.json({ job: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'invalid_token' });
  }
});

// Delete job (employer only, must own job)
app.delete('/api/jobs/:id', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const id = req.params.id;
    // Verify ownership
    const jobRes = await pool.query('SELECT employer_id FROM jobs WHERE id=$1', [id]);
    if (jobRes.rowCount === 0) return res.status(404).json({ error: 'not_found' });
    const employerId = jobRes.rows[0].employer_id;
    if (Number(employerId) !== Number(payload.id)) return res.status(403).json({ error: 'forbidden' });
    await pool.query('DELETE FROM jobs WHERE id=$1', [id]);
    return res.json({ ok: true });
  } catch (err) {
    console.error('Delete job error:', err && err.stack ? err.stack : err);
    return res.status(401).json({ error: 'invalid_token', details: err.message || String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
