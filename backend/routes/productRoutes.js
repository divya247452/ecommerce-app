const express = require('express');
const { protect } = require('../middleware/authMiddleware')
const { getProducts, getProductById, createProductReview, getTopProducts } = require('../controllers/productController');
const router = express.Router()

router.get('/', getProducts);

router.get('/top', getTopProducts);

router.get('/:id', getProductById)

router.route('/:id/reviews').post(protect, createProductReview)


module.exports = router;