const express    = require('express');
const router     = express.Router();
const validateId = require('../middleware/validateID');
const {
  getAllNotifications,
  getNotificationById,
  getNotificationsByCustomer,
  getUnreadNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notifications.controller');

router.get('/',                              getAllNotifications);
router.get('/:id',          validateId,      getNotificationById);
router.get('/customer/:id', validateId,      getNotificationsByCustomer);
router.get('/customer/:id/unread', validateId, getUnreadNotifications);
router.post('/',                             createNotification);
router.patch('/:id/read',   validateId,      markAsRead);
router.patch('/customer/:id/readall', validateId, markAllAsRead);
router.delete('/:id',       validateId,      deleteNotification);

module.exports = router;