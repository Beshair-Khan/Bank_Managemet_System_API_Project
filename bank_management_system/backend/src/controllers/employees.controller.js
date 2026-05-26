const pool = require('../config/db');

// GET all employees
const getAllEmployees = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT e.*, 
              b.branch_name, b.city,
              d.dept_name
       FROM employees e
       JOIN branches b    ON e.branch_id = b.branch_id
       JOIN departments d ON e.dept_id   = d.dept_id
       ORDER BY e.employee_id`
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    next(err);
  }
};

// GET single employee
const getEmployeeById = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT e.*, 
              b.branch_name, b.city,
              d.dept_name
       FROM employees e
       JOIN branches b    ON e.branch_id = b.branch_id
       JOIN departments d ON e.dept_id   = d.dept_id
       WHERE e.employee_id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// GET employees by branch
const getEmployeesByBranch = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT e.*, d.dept_name
       FROM employees e
       JOIN departments d ON e.dept_id = d.dept_id
       WHERE e.branch_id = $1
       ORDER BY e.employee_id`,
      [req.params.id]
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    next(err);
  }
};

// POST create new employee
const createEmployee = async (req, res, next) => {
  try {
    const { branch_id, dept_id, first_name, last_name, email, phone, hire_date, salary, position } = req.body;
    const result = await pool.query(
      `INSERT INTO employees (branch_id, dept_id, first_name, last_name, email, phone, hire_date, salary, position)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [branch_id, dept_id, first_name, last_name, email, phone, hire_date, salary, position]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT update employee
const updateEmployee = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone, salary, position } = req.body;
    const result = await pool.query(
      `UPDATE employees 
       SET first_name=$1, last_name=$2, email=$3, phone=$4, salary=$5, position=$6
       WHERE employee_id=$7 RETURNING *`,
      [first_name, last_name, email, phone, salary, position, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE employee
const deleteEmployee = async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM employees WHERE employee_id=$1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  getEmployeesByBranch,
  createEmployee,
  updateEmployee,
  deleteEmployee
};