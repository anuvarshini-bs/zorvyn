const { getDbConnection } = require('../config/db');
const bcrypt = require('bcrypt');
const { generateToken } = require('../middleware/auth');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const db = await getDbConnection();
    const user = await db.get(`SELECT * FROM users WHERE username = ?`, [username]);

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'User is inactive' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = generateToken(user);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
