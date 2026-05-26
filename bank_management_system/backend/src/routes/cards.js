const express    = require('express');
const router     = express.Router();
const validateId = require('../middleware/validateID');
const {
  getAllCards,
  getCardById,
  getCardsByCustomer,
  createCard,
  updateCardStatus,
  deleteCard
} = require('../controllers/cards.controller');

router.get('/',                          getAllCards);
router.get('/:id',        validateId,    getCardById);
router.get('/customer/:id', validateId,  getCardsByCustomer);
router.post('/',                         createCard);
router.patch('/:id/status', validateId,  updateCardStatus);
router.delete('/:id',     validateId,    deleteCard);

module.exports = router;