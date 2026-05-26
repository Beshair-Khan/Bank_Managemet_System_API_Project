const pool = require('../config/db');

// GET all customers
const getAllCustomers = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM customers'
    );
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
};

// GET single customer by ID
const getCustomerById = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM customers WHERE customer_id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// POST create new customer
const createCustomer = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone, cnic, date_of_birth, address, city } = req.body;
    const result = await pool.query(
      `INSERT INTO customers (first_name, last_name, email, phone, cnic, date_of_birth, address, city)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [first_name, last_name, email, phone, cnic, date_of_birth, address, city]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT update customer
const updateCustomer = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone, address, city, status } = req.body;
    const result = await pool.query(
      `UPDATE customers 
       SET first_name=$1, last_name=$2, email=$3, phone=$4, address=$5, city=$6, status=$7
       WHERE customer_id=$8 RETURNING *`,
      [first_name, last_name, email, phone, address, city, status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE customer
const deleteCustomer = async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM customers WHERE customer_id = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};