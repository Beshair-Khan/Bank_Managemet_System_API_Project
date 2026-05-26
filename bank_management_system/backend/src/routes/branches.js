const express    = require('express');
const router     = express.Router();
const validateId = require('../middleware/validateID');
const {
  getAllBranches,
  getBranchById,
  getBranchWithEmployees,
  createBranch,
  updateBranch,
  deleteBranch
} = require('../controllers/branches.controller');

router.get('/',                          getAllBranches);
router.get('/:id',        validateId,    getBranchById);
router.get('/:id/employees', validateId, getBranchWithEmployees);
router.post('/',                         createBranch);
router.put('/:id',        validateId,    updateBranch);
router.delete('/:id',     validateId,    deleteBranch);

module.exports = router;