const express    = require('express');
const router     = express.Router();
const validateId = require('../middleware/validateID');
const {
  getAllEmployees,
  getEmployeeById,
  getEmployeesByBranch,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employees.controller');

router.get('/',                           getAllEmployees);
router.get('/:id',         validateId,    getEmployeeById);
router.get('/branch/:id',  validateId,    getEmployeesByBranch);
router.post('/',                          createEmployee);
router.put('/:id',         validateId,    updateEmployee);
router.delete('/:id',      validateId,    deleteEmployee);

module.exports = router;