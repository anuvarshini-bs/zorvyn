const { getDbConnection } = require('../config/db');
const bcrypt = require('bcrypt');

async function initializeDb() {
  const db = await getDbConnection();
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('Viewer', 'Analyst', 'Admin')),
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive'))
    );
    
    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      notes TEXT,
      user_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  
  // Create an admin user if not exists
  const adminExists = await db.get(`SELECT id FROM users WHERE username = 'admin'`);
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.run(
      `INSERT INTO users (username, password, role, status) VALUES (?, ?, 'Admin', 'active')`,
      ['admin', hashedPassword]
    );
    console.log('Default Admin user created. username: admin, password: admin123');
  }

  // Create viewer and analyst for testing convenience
  const viewerExists = await db.get(`SELECT id FROM users WHERE username = 'viewer'`);
  if (!viewerExists) {
    const hashedPassword = await bcrypt.hash('viewer123', 10);
    await db.run(
      `INSERT INTO users (username, password, role, status) VALUES (?, ?, 'Viewer', 'active')`,
      ['viewer', hashedPassword]
    );
  }

  const analystExists = await db.get(`SELECT id FROM users WHERE username = 'analyst'`);
  if (!analystExists) {
    const hashedPassword = await bcrypt.hash('analyst123', 10);
    await db.run(
      `INSERT INTO users (username, password, role, status) VALUES (?, ?, 'Analyst', 'active')`,
      ['analyst', hashedPassword]
    );
  }
}

module.exports = { initializeDb };
