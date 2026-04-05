const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-finance-dashboard';

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, username, role, status }
    if (req.user.status !== 'active') {
      return res.status(403).json({ error: 'Forbidden: User is inactive' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role, status: user.status },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

module.exports = { authenticate, generateToken };
