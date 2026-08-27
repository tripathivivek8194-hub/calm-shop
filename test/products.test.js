import assert from 'node:assert/strict';
import test from 'node:test';
import { formatPrice, generateSlug, getAllProducts, getFeaturedProducts, getProductBySlug } from '../src/data/products.js';

test('catalogue products have unique ids and slugs', () => {
  const products = getAllProducts();
  assert.equal(new Set(products.map((product) => product.id)).size, products.length);
  assert.equal(new Set(products.map((product) => product.slug)).size, products.length);
});

test('featured products are available for sale', () => {
  assert.ok(getFeaturedProducts().length > 0);
  assert.ok(getFeaturedProducts().every((product) => product.inStock));
});

test('product lookups, pricing, and slugs work consistently', () => {
  assert.equal(getProductBySlug('aurora-sphere-cluster').name, 'Aurora Sphere Cluster');
  assert.equal(getProductBySlug('missing-product'), undefined);
  assert.equal(formatPrice(100), '₹8,500');
  assert.equal(generateSlug('Calm & Collected!'), 'calm-collected');
});
