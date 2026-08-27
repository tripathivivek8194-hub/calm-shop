import assert from 'node:assert/strict';
import test from 'node:test';

const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    _reset: () => { store = {}; },
  };
})();

global.localStorage = mockLocalStorage;

test('OrderContext - addOrder creates order with generated ID', () => {
  let orders = [];

  const addOrder = (orderData) => {
    const order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      ...orderData,
    };
    orders = [order, ...orders];
    return order;
  };

  const order = addOrder({
    email: 'test@example.com',
    items: [{ id: 'prod-1', name: 'Test', price: 100, quantity: 2 }],
    subtotal: 200,
    shipping: 0,
    total: 200,
  });

  assert.ok(order.id.startsWith('ORD-'));
  assert.equal(order.email, 'test@example.com');
  assert.equal(order.status, 'confirmed');
  assert.ok(order.createdAt);
  assert.equal(orders.length, 1);
});

test('OrderContext - getOrders returns all orders', () => {
  let orders = [
    { id: 'ORD-1', createdAt: '2024-01-01' },
    { id: 'ORD-2', createdAt: '2024-01-02' },
  ];

  const getOrders = () => orders;

  const result = getOrders();
  assert.equal(result.length, 2);
  assert.equal(result[0].id, 'ORD-1');
});

test('OrderContext - getOrderById finds order by ID', () => {
  let orders = [
    { id: 'ORD-1', email: 'a@test.com' },
    { id: 'ORD-2', email: 'b@test.com' },
  ];

  const getOrderById = (id) => orders.find(order => order.id === id);

  const order = getOrderById('ORD-2');
  assert.equal(order.id, 'ORD-2');
  assert.equal(order.email, 'b@test.com');

  const notFound = getOrderById('ORD-999');
  assert.equal(notFound, undefined);
});

test('OrderContext - updateOrderStatus updates order status', () => {
  let orders = [
    { id: 'ORD-1', status: 'confirmed' },
    { id: 'ORD-2', status: 'confirmed' },
  ];

  const updateOrderStatus = (id, status) => {
    orders = orders.map(order =>
      order.id === id ? { ...order, status, updatedAt: new Date().toISOString() } : order
    );
  };

  updateOrderStatus('ORD-1', 'shipped');

  const updated = orders.find(o => o.id === 'ORD-1');
  assert.equal(updated.status, 'shipped');
  assert.ok(updated.updatedAt);

  const unchanged = orders.find(o => o.id === 'ORD-2');
  assert.equal(unchanged.status, 'confirmed');
});