const pool = require('../config/db');

const getAllLoans = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT l.*, 
              c.first_name, c.last_name,
              lt.type_name, lt.interest_rate,
              e.first_name AS officer_first_name, e.last_name AS officer_last_name
       FROM loans l
       JOIN customers c   ON l.customer_id  = c.customer_id
       JOIN loan_types lt ON l.loan_type_id = lt.loan_type_id
       JOIN employees e   ON l.employee_id  = e.employee_id
       ORDER BY l.loan_id`
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    next(err);
  }
};

const getLoanById = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT l.*, 
              c.first_name, c.last_name,
              lt.type_name, lt.interest_rate,
              e.first_name AS officer_first_name, e.last_name AS officer_last_name
       FROM loans l
       JOIN customers c   ON l.customer_id  = c.customer_id
       JOIN loan_types lt ON l.loan_type_id = lt.loan_type_id
       JOIN employees e   ON l.employee_id  = e.employee_id
       WHERE l.loan_id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const getActiveLoans = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT l.*, c.first_name, c.last_name, lt.type_name
       FROM loans l
       JOIN customers c   ON l.customer_id  = c.customer_id
       JOIN loan_types lt ON l.loan_type_id = lt.loan_type_id
       WHERE l.status = 'Active'
       ORDER BY l.loan_id`
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    next(err);
  }
};

const getLoanPayments = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM loan_payments 
       WHERE loan_id = $1 
       ORDER BY payment_date DESC`,
      [req.params.id]
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    next(err);
  }
};

const createLoan = async (req, res, next) => {
  try {
    const { customer_id, account_id, employee_id, loan_type_id, principal, interest_rate, term_months, start_date, end_date } = req.body;
    const result = await pool.query(
      `INSERT INTO loans (customer_id, account_id, employee_id, loan_type_id, principal, interest_rate, term_months, start_date, end_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Pending') RETURNING *`,
      [customer_id, account_id, employee_id, loan_type_id, principal, interest_rate, term_months, start_date, end_date]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const updateLoanStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      `UPDATE loans SET status=$1 
       WHERE loan_id=$2 RETURNING *`,
      [status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const deleteLoan = async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM loans WHERE loan_id=$1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }
    res.json({ success: true, message: 'Loan deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllLoans,
  getLoanById,
  getActiveLoans,
  getLoanPayments,
  createLoan,
  updateLoanStatus,
  deleteLoan
};