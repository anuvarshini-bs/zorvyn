const { getDbConnection } = require('../config/db');

exports.listRecords = async (req, res) => {
  const { type, category, startDate, endDate } = req.query;
  let query = `SELECT * FROM records WHERE 1=1`;
  const params = [];

  if (type) {
    query += ` AND type = ?`;
    params.push(type);
  }
  if (category) {
    query += ` AND category = ?`;
    params.push(category);
  }
  if (startDate) {
    query += ` AND date >= ?`;
    params.push(startDate);
  }
  if (endDate) {
    query += ` AND date <= ?`;
    params.push(endDate);
  }

  query += ` ORDER BY date DESC`;

  try {
    const db = await getDbConnection();
    const records = await db.all(query, params);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createRecord = async (req, res) => {
  const { amount, type, category, date, notes } = req.body;
  
  try {
    const db = await getDbConnection();
    const result = await db.run(
      `INSERT INTO records (amount, type, category, date, notes, user_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [amount, type, category, date, notes, req.user.id]
    );

    res.status(201).json({
      message: 'Record created successfully',
      recordId: result.lastID
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateRecord = async (req, res) => {
  const { id } = req.params;
  const { amount, type, category, date, notes } = req.body;

  try {
    const db = await getDbConnection();
    
    // Explicitly update only provided fields or all standard fields.
    // Assuming PUT requests full overwrite here, per REST conventions.
    const result = await db.run(
      `UPDATE records SET amount = ?, type = ?, category = ?, date = ?, notes = ? WHERE id = ?`,
      [amount, type, category, date, notes, id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ message: 'Record updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteRecord = async (req, res) => {
  const { id } = req.params;

  try {
    const db = await getDbConnection();
    const result = await db.run(`DELETE FROM records WHERE id = ?`, [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
