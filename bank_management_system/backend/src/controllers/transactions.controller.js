const pool = require('../config/db');

// GET all transactions
const getAllTransactions = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT t.*, tt.type_name, a.account_number
       FROM transactions t
       JOIN transaction_types tt ON t.type_id = tt.type_id
       JOIN accounts a ON t.account_id = a.account_id
       ORDER BY t.txn_date DESC`
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    next(err);
  }
};

// GET single transaction
const getTransactionById = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT t.*, tt.type_name, a.account_number
       FROM transactions t
       JOIN transaction_types tt ON t.type_id = tt.type_id
       JOIN accounts a ON t.account_id = a.account_id
       WHERE t.txn_id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// GET all transactions for a specific account
const getTransactionsByAccount = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT t.*, tt.type_name
       FROM transactions t
       JOIN transaction_types tt ON t.type_id = tt.type_id
       WHERE t.account_id = $1
       ORDER BY t.txn_date DESC`,
      [req.params.id]
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    next(err);
  }
};

// POST create new transaction
const createTransaction = async (req, res, next) => {
  try {
    const { account_id, type_id, amount, description, reference_no, balance_after } = req.body;
    const result = await pool.query(
      `INSERT INTO transactions (account_id, type_id, amount, description, reference_no, balance_after)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [account_id, type_id, amount, description, reference_no, balance_after]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE transaction
const deleteTransaction = async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM transactions WHERE txn_id=$1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  getTransactionsByAccount,
  createTransaction,
  deleteTransaction
};