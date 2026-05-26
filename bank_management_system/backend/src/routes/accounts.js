const express  = require('express');
const router   = express.Router();
const validateId = require('../middleware/validateID');
const {
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount
} = require('../controllers/accounts.controller');

router.get('/',      getAllAccounts);
router.get('/:id',   validateId, getAccountById);
router.post('/',     createAccount);
router.put('/:id',   validateId, updateAccount);
router.delete('/:id',validateId, deleteAccount);

module.exports = router;