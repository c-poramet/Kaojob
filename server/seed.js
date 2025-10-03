const { pool } = require('./utils/db');
const bcrypt = require('bcryptjs');

async function seed() {
  // Check if demo users exist
  const users = [
    { name: 'Demo Employer', email: 'employer@kaojob.com', password: 'demo123', phone: '', type: 'employer' },
    { name: 'Demo Jobseeker', email: 'jobseeker@kaojob.com', password: 'demo123', phone: '', type: 'job-seeker' }
  ];

  for (const u of users) {
    const existing = await pool.query('SELECT id FROM users WHERE email=$1', [u.email]);
    if (existing.rowCount === 0) {
      const hash = await bcrypt.hash(u.password, 10);
      await pool.query('INSERT INTO users (name,email,password_hash,phone,type,created_at) VALUES ($1,$2,$3,$4,$5,NOW())', [u.name, u.email, hash, u.phone, u.type]);
      console.log('Seeded user', u.email);
    }
  }

  // Insert a couple of jobs for the demo employer
  const emp = await pool.query('SELECT id FROM users WHERE email=$1 LIMIT 1', ['employer@kaojob.com']);
  if (emp.rowCount) {
    const employerId = emp.rows[0].id;
    const jobs = await pool.query('SELECT id FROM jobs LIMIT 1');
    if (jobs.rowCount === 0) {
      await pool.query(
        `INSERT INTO jobs (title,description,location,work_type,salary,contact_info,employer_id,status,date_posted)
         VALUES
         ($1,$2,$3,$4,$5,$6,$7,'Active',NOW()),
         ($8,$9,$10,$11,$12,$13,$14,'Active',NOW())`,
        [
          'Barista', 'Part-time coffee shop position for experienced staff', 'Bangkok', 'Part-time', '฿15,000 - ฿18,000/month', 'contact@greencafe.com', employerId,
          'Office Assistant', 'Full-time administrative support position', 'Bangkok', 'Full-time', '฿20,000/month', 'hr@bangkokoffice.com', employerId
        ]
      );
      console.log('Seeded demo jobs');
    }
  }
}

module.exports = { seed };

if (require.main === module) {
  seed().then(() => { console.log('Seeding completed'); process.exit(0); }).catch((e) => { console.error(e); process.exit(1); });
}
