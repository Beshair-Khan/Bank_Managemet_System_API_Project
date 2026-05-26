const express    = require('express');
const router     = express.Router();
const validateId = require('../middleware/validateID');
const {
  getAllLoans,
  getLoanById,
  getActiveLoans,
  getLoanPayments,
  createLoan,
  updateLoanStatus,
  deleteLoan
} = require('../controllers/loans.controller');

router.get('/',                         getAllLoans);
router.get('/active',                   getActiveLoans);
router.get('/:id',       validateId,    getLoanById);
router.get('/:id/payments', validateId, getLoanPayments);
router.post('/',                        createLoan);
router.put('/:id/status', validateId,   updateLoanStatus);
router.delete('/:id',    validateId,    deleteLoan);

module.exports = router;