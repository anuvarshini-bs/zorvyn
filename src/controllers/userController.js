const { getDbConnection } = require('../config/db');
const bcrypt = require('bcrypt');

exports.listUsers = async (req, res) => {
  try {
    const db = await getDbConnection();
    const users = await db.all(`SELECT id, username, role, status FROM users`);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createUser = async (req, res) => {
  const { username, password, role } = req.body;
  
  try {
    const db = await getDbConnection();
    
    // Check if user exists
    const existing = await db.get(`SELECT id FROM users WHERE username = ?`, [username]);
    if (existing) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run(
      `INSERT INTO users (username, password, role, status) VALUES (?, ?, ?, 'active')`,
      [username, hashedPassword, role]
    );

    res.status(201).json({
      message: 'User created successfully',
      userId: result.lastID
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { role, status } = req.body;

  if (id == req.user.id && status === 'inactive') {
      return res.status(400).json({ error: 'Cannot deactivate yourself' });
  }

  try {
    const db = await getDbConnection();
    
    const user = await db.get(`SELECT * FROM users WHERE id = ?`, [id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newRole = role || user.role;
    const newStatus = status || user.status;

    await db.run(
      `UPDATE users SET role = ?, status = ? WHERE id = ?`,
      [newRole, newStatus, id]
    );

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  
  if (id == req.user.id) {
    return res.status(400).json({ error: 'Cannot delete yourself' });
  }

  try {
    const db = await getDbConnection();
    const result = await db.run(`DELETE FROM users WHERE id = ?`, [id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ error: 'Cannot delete user with associated records.'});
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
