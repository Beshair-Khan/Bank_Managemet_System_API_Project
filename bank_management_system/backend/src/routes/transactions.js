const express    = require('express');
const router     = express.Router();
const validateId = require('../middleware/validateID');
const {
  getAllTransactions,
  getTransactionById,
  getTransactionsByAccount,
  createTransaction,
  deleteTransaction
} = require('../controllers/transactions.controller');

router.get('/',                        getAllTransactions);
router.get('/:id',      validateId,    getTransactionById);
router.get('/account/:id', validateId, getTransactionsByAccount);
router.post('/',                       createTransaction);
router.delete('/:id',   validateId,    deleteTransaction);

module.exports = router;