const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/kaojob';

const pool = new Pool({ connectionString });

module.exports = { pool };
