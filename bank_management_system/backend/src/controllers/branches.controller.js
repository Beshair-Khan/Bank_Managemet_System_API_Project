const pool = require('../config/db');

// GET all branches
const getAllBranches = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM branches ORDER BY branch_id`
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    next(err);
  }
};

// GET single branch
const getBranchById = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM branches WHERE branch_id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// GET branch with all its employees
const getBranchWithEmployees = async (req, res, next) => {
  try {
    const branch = await pool.query(
      `SELECT * FROM branches WHERE branch_id = $1`,
      [req.params.id]
    );
    if (branch.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }
    const employees = await pool.query(
      `SELECT e.*, d.dept_name 
       FROM employees e
       JOIN departments d ON e.dept_id = d.dept_id
       WHERE e.branch_id = $1`,
      [req.params.id]
    );
    res.json({
      success: true,
      data: {
        branch: branch.rows[0],
        employees: employees.rows
      }
    });
  } catch (err) {
    next(err);
  }
};

// POST create new branch
const createBranch = async (req, res, next) => {
  try {
    const { branch_name, address, city, state, phone, established } = req.body;
    const result = await pool.query(
      `INSERT INTO branches (branch_name, address, city, state, phone, established)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [branch_name, address, city, state, phone, established]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT update branch
const updateBranch = async (req, res, next) => {
  try {
    const { branch_name, address, city, state, phone } = req.body;
    const result = await pool.query(
      `UPDATE branches 
       SET branch_name=$1, address=$2, city=$3, state=$4, phone=$5
       WHERE branch_id=$6 RETURNING *`,
      [branch_name, address, city, state, phone, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE branch
const deleteBranch = async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM branches WHERE branch_id=$1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }
    res.json({ success: true, message: 'Branch deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllBranches,
  getBranchById,
  getBranchWithEmployees,
  createBranch,
  updateBranch,
  deleteBranch
};