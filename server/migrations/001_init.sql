-- users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone TEXT,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  work_type TEXT,
  salary TEXT,
  contact_info TEXT,
  employer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'Active',
  date_posted TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
