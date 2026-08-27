import assert from 'node:assert/strict';
import test from 'node:test';
import {
  formatPrice,
  generateSlug,
  getAllProducts,
  getFeaturedProducts,
  getInStockProducts,
  getProductBySlug,
  getProductsByCategory,
  getCategories
} from '../src/data/products.js';

test('formatPrice - formats INR correctly', () => {
  assert.equal(formatPrice(100), '₹8,500');
  assert.equal(formatPrice(0), '₹0');
  assert.equal(formatPrice(12345), '₹10,49,325');
  assert.equal(formatPrice(99), '₹8,415');
});

test('formatPrice - handles large numbers', () => {
  assert.equal(formatPrice(100000), '₹85,00,000');
  assert.equal(formatPrice(1000000), '₹8,50,00,000');
});

test('generateSlug - creates URL-friendly slugs', () => {
  assert.equal(generateSlug('Calm & Collected!'), 'calm-collected');
  assert.equal(generateSlug('Hello World'), 'hello-world');
  assert.equal(generateSlug('Test@#$%Product'), 'test-product');
  assert.equal(generateSlug('  Spaces  '), 'spaces');
  assert.equal(generateSlug('UPPERCASE'), 'uppercase');
  assert.equal(generateSlug('multiple---dashes'), 'multiple-dashes');
});

test('getAllProducts - returns all products', () => {
  const products = getAllProducts();
  assert.ok(products.length > 0);
  assert.equal(products.length, 12);
});

test('getAllProducts - products have required fields', () => {
  const products = getAllProducts();
  products.forEach(product => {
    assert.ok(product.id);
    assert.ok(product.name);
    assert.ok(product.slug);
    assert.ok(product.price);
    assert.ok(product.category);
    assert.ok(product.geometryType);
    assert.ok(product.color);
    assert.ok(product.secondaryColor);
    assert.ok(product.material);
    assert.ok(product.dimensions);
    assert.ok(product.weight);
    assert.ok(typeof product.inStock === 'boolean');
  });
});

test('getAllProducts - products have unique IDs and slugs', () => {
  const products = getAllProducts();
  const ids = products.map(p => p.id);
  const slugs = products.map(p => p.slug);
  assert.equal(new Set(ids).size, products.length);
  assert.equal(new Set(slugs).size, products.length);
});

test('getFeaturedProducts - returns only featured products', () => {
  const featured = getFeaturedProducts();
  assert.ok(featured.length > 0);
  featured.forEach(product => {
    assert.equal(product.featured, true);
    assert.equal(product.inStock, true);
  });
});

test('getInStockProducts - returns only in-stock products', () => {
  const inStock = getInStockProducts();
  inStock.forEach(product => {
    assert.equal(product.inStock, true);
  });
});

test('getProductBySlug - finds product by slug', () => {
  const product = getProductBySlug('aurora-sphere-cluster');
  assert.ok(product);
  assert.equal(product.name, 'Aurora Sphere Cluster');
});

test('getProductBySlug - returns undefined for non-existent slug', () => {
  const product = getProductBySlug('non-existent-product');
  assert.equal(product, undefined);
});

test('getProductsByCategory - filters by category', () => {
  const sculptures = getProductsByCategory('Sculptures');
  sculptures.forEach(product => {
    assert.equal(product.category, 'Sculptures');
  });

  const decor = getProductsByCategory('Decor');
  decor.forEach(product => {
    assert.equal(product.category, 'Decor');
  });
});

test('getProductsByCategory - returns empty array for unknown category', () => {
  const result = getProductsByCategory('Unknown Category');
  assert.equal(result.length, 0);
});

test('getCategories - returns expected categories', () => {
  const categories = getCategories();
  const categoryIds = categories.map(c => c.id);
  assert.ok(categoryIds.includes('spheres'));
  assert.ok(categoryIds.includes('knots'));
  assert.ok(categoryIds.includes('platonic'));
  assert.ok(categoryIds.includes('organic'));
  assert.ok(categoryIds.includes('geodes'));
});

test('products - have valid geometry types', () => {
  const products = getAllProducts();
  const validGeometries = [
    'sphereCluster', 'torusKnot', 'icosahedron',
    'dodecahedron', 'octahedron', 'tetrahedron',
    'blob', 'geode'
  ];
  products.forEach(product => {
    assert.ok(validGeometries.includes(product.geometryType),
      `Invalid geometry type: ${product.geometryType} for product ${product.id}`);
  });
});

test('products - have valid materials', () => {
  const products = getAllProducts();
  const validMaterials = ['glass', 'crystal', 'matte', 'wax', 'pearl', 'translucent'];
  products.forEach(product => {
    assert.ok(validMaterials.includes(product.material),
      `Invalid material: ${product.material} for product ${product.id}`);
  });
});

test('products - dimensions have width, height, depth', () => {
  const products = getAllProducts();
  products.forEach(product => {
    assert.ok(typeof product.dimensions.width === 'number');
    assert.ok(typeof product.dimensions.height === 'number');
    assert.ok(typeof product.dimensions.depth === 'number');
    assert.ok(product.dimensions.width > 0);
    assert.ok(product.dimensions.height > 0);
    assert.ok(product.dimensions.depth > 0);
  });
});

test('products - weight is positive number', () => {
  const products = getAllProducts();
  products.forEach(product => {
    assert.ok(typeof product.weight === 'number');
    assert.ok(product.weight > 0);
  });
});

test('products - price is positive number', () => {
  const products = getAllProducts();
  products.forEach(product => {
    assert.ok(typeof product.price === 'number');
    assert.ok(product.price > 0);
  });
});