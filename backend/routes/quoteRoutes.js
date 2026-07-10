const express = require('express');
const router = express.Router();
const {
  generateQuote,
  getQuotes,
  toggleFavorite,
  deleteQuote,
} = require('../controllers/quoteController');
const { protect } = require('../middleware/authMiddleware');
const { validateQuote } = require('../middleware/validationMiddleware');

router.use(protect);

router.post('/generate', validateQuote, generateQuote);
router.get('/', getQuotes);
router.patch('/:id/favorite', toggleFavorite);
router.delete('/:id', deleteQuote);

module.exports = router;
