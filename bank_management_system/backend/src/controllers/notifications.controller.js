const pool = require('../config/db');

// GET all notifications
const getAllNotifications = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT n.*, 
              c.first_name, c.last_name
       FROM notifications n
       JOIN customers c ON n.customer_id = c.customer_id
       ORDER BY n.sent_at DESC`
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    next(err);
  }
};

// GET single notification
const getNotificationById = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT n.*, c.first_name, c.last_name
       FROM notifications n
       JOIN customers c ON n.customer_id = c.customer_id
       WHERE n.notif_id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// GET all notifications for a specific customer
const getNotificationsByCustomer = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM notifications
       WHERE customer_id = $1
       ORDER BY sent_at DESC`,
      [req.params.id]
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    next(err);
  }
};

// GET unread notifications for a specific customer
const getUnreadNotifications = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM notifications
       WHERE customer_id = $1 AND is_read = FALSE
       ORDER BY sent_at DESC`,
      [req.params.id]
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    next(err);
  }
};

// POST create new notification
const createNotification = async (req, res, next) => {
  try {
    const { customer_id, notif_type, subject, message, related_txn_id } = req.body;
    const result = await pool.query(
      `INSERT INTO notifications (customer_id, notif_type, subject, message, related_txn_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [customer_id, notif_type, subject, message, related_txn_id || null]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// PATCH mark notification as read
const markAsRead = async (req, res, next) => {
  try {
    const result = await pool.query(
      `UPDATE notifications SET is_read = TRUE
       WHERE notif_id = $1 RETURNING *`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// PATCH mark all notifications as read for a customer
const markAllAsRead = async (req, res, next) => {
  try {
    await pool.query(
      `UPDATE notifications SET is_read = TRUE
       WHERE customer_id = $1`,
      [req.params.id]
    );
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

// DELETE notification
const deleteNotification = async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM notifications WHERE notif_id=$1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllNotifications,
  getNotificationById,
  getNotificationsByCustomer,
  getUnreadNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification
};