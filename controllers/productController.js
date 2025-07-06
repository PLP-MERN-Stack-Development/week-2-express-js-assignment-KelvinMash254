const { v4: uuidv4 } = require('uuid');
const { NotFoundError } = require('../utils/customErrors');

// Use in-memory database (shared between files)
let products = require('../data/products'); // we'll make this next

exports.getAllProducts = (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  let filtered = [...products];

  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + parseInt(limit));

  res.json(paginated);
};

exports.getProductById = (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return next(new NotFoundError('Product not found'));
  res.json(product);
};

exports.createProduct = (req, res) => {
  const newProduct = { id: uuidv4(), ...req.body };
  products.push(newProduct);
  res.status(201).json(newProduct);
};

exports.updateProduct = (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError('Product not found'));
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
};

exports.deleteProduct = (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError('Product not found'));
  const removed = products.splice(index, 1);
  res.json({ message: 'Product deleted', product: removed[0] });
};

exports.searchProducts = (req, res) => {
  const { name } = req.query;
  const results = products.filter(p =>
    p.name.toLowerCase().includes(name.toLowerCase())
  );
  res.json(results);
};

exports.getProductStats = (req, res) => {
  const stats = {};
  products.forEach(p => {
    stats[p.category] = (stats[p.category] || 0) + 1;
  });
  res.json(stats);
};
