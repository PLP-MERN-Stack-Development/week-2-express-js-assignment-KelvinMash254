const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');
const validateProduct = require('../middleware/validateProduct');
const auth = require('../middleware/auth');

router.get('/', controller.getAllProducts);
router.get('/search', controller.searchProducts);
router.get('/stats', controller.getProductStats);
router.get('/:id', controller.getProductById);
router.post('/', auth, validateProduct, controller.createProduct);
router.put('/:id', auth, validateProduct, controller.updateProduct);
router.delete('/:id', auth, controller.deleteProduct);

module.exports = router;
