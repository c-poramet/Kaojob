const fs = require('fs');
const path = require('path');
const { pool } = require('./utils/db');
const { seed } = require('./seed');

async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, 'migrations', '001_init.sql'), 'utf8');
  await pool.query(sql);
  // run seed data
  await seed();
  console.log('Migrations applied');
}

if (require.main === module) {
  migrate().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
}

module.exports = { migrate };
