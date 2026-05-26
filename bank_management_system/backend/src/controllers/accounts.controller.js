const pool = require('../config/db');

// GET all accounts
const getAllAccounts = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT a.*, c.first_name, c.last_name, c.email 
       FROM accounts a 
       JOIN customers c ON a.customer_id = c.customer_id 
       ORDER BY a.account_id`
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    next(err);
  }
};

// GET single account
const getAccountById = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT a.*, c.first_name, c.last_name, c.email 
       FROM accounts a 
       JOIN customers c ON a.customer_id = c.customer_id 
       WHERE a.account_id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// POST create new account
const createAccount = async (req, res, next) => {
  try {
    const { customer_id, branch_id, account_number, account_type, balance } = req.body;
    const result = await pool.query(
      `INSERT INTO accounts (customer_id, branch_id, account_number, account_type, balance, open_date)
       VALUES ($1, $2, $3, $4, $5, CURRENT_DATE) RETURNING *`,
      [customer_id, branch_id, account_number, account_type, balance || 0]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT update account
const updateAccount = async (req, res, next) => {
  try {
    const { balance, status } = req.body;
    const result = await pool.query(
      `UPDATE accounts SET balance=$1, status=$2 
       WHERE account_id=$3 RETURNING *`,
      [balance, status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE account
const deleteAccount = async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM accounts WHERE account_id=$1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount
};