const pool = require('../config/db');

// GET all cards
const getAllCards = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT c.*, 
              cu.first_name, cu.last_name,
              a.account_number
       FROM cards c
       JOIN customers cu ON c.customer_id = cu.customer_id
       JOIN accounts a   ON c.account_id  = a.account_id
       ORDER BY c.card_id`
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    next(err);
  }
};

// GET single card
const getCardById = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT c.*, 
              cu.first_name, cu.last_name,
              a.account_number
       FROM cards c
       JOIN customers cu ON c.customer_id = cu.customer_id
       JOIN accounts a   ON c.account_id  = a.account_id
       WHERE c.card_id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Card not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// GET all cards for a specific customer
const getCardsByCustomer = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT c.*, a.account_number
       FROM cards c
       JOIN accounts a ON c.account_id = a.account_id
       WHERE c.customer_id = $1
       ORDER BY c.card_id`,
      [req.params.id]
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    next(err);
  }
};

// POST create new card
const createCard = async (req, res, next) => {
  try {
    const { account_id, customer_id, card_number, card_type, card_network, issue_date, expiry_date, credit_limit } = req.body;
    const result = await pool.query(
      `INSERT INTO cards (account_id, customer_id, card_number, card_type, card_network, issue_date, expiry_date, credit_limit)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [account_id, customer_id, card_number, card_type, card_network, issue_date, expiry_date, credit_limit || null]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// PATCH block or unblock a card
const updateCardStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      `UPDATE cards SET status=$1 
       WHERE card_id=$2 RETURNING *`,
      [status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Card not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE card
const deleteCard = async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM cards WHERE card_id=$1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Card not found' });
    }
    res.json({ success: true, message: 'Card deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllCards,
  getCardById,
  getCardsByCustomer,
  createCard,
  updateCardStatus,
  deleteCard
};