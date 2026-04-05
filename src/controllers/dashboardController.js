const { getDbConnection } = require('../config/db');

exports.getSummary = async (req, res) => {
  try {
    const db = await getDbConnection();
    
    // Total Income
    const incomeRow = await db.get(`SELECT SUM(amount) as total FROM records WHERE type = 'income'`);
    const totalIncome = incomeRow.total || 0;
    
    // Total Expenses
    const expenseRow = await db.get(`SELECT SUM(amount) as total FROM records WHERE type = 'expense'`);
    const totalExpenses = expenseRow.total || 0;
    
    const netBalance = totalIncome - totalExpenses;

    res.json({
      totalIncome,
      totalExpenses,
      netBalance
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCategoryTotals = async (req, res) => {
  try {
    const db = await getDbConnection();
    
    const rows = await db.all(`
      SELECT category, type, SUM(amount) as total
      FROM records
      GROUP BY category, type
      ORDER BY type DESC, total DESC
    `);
    
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
