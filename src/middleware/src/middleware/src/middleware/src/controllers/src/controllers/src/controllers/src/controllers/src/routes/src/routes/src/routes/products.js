const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateInventory,
  getFeaturedProducts
} = require('../controllers/products');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, getProducts);
router.get('/featured', optionalAuth, getFeaturedProducts);
router.get('/:id', optionalAuth, getProduct);

// Admin routes
router.use(protect, authorize('admin'));
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.put('/:id/inventory', updateInventory);

module.exports = router;