const express = require('express');
const router  = express.Router();
const validateId = require('../middleware/validateID');
const {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customers.controller');

router.get('/',     getAllCustomers);
router.get('/:id',  validateId, getCustomerById);
router.post('/',    createCustomer);
router.put('/:id',  validateId, updateCustomer);
router.delete('/:id', validateId, deleteCustomer);

module.exports = router;