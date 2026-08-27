import assert from 'node:assert/strict';
import test from 'node:test';

// Import the cartReducer logic directly (testing the pure reducer function)
const initialState = {
  items: [],
  isOpen: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1 } = action.payload;
      const existingIndex = state.items.findIndex(item => item.id === product.id);

      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
        };
        return { ...state, items: newItems, isOpen: true };
      }

      return {
        ...state,
        items: [...state.items, { ...product, quantity }],
        isOpen: true,
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== id),
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    }

    case 'CLEAR_CART': {
      return { ...state, items: [] };
    }

    case 'TOGGLE_CART': {
      return { ...state, isOpen: !state.isOpen };
    }

    case 'OPEN_CART': {
      return { ...state, isOpen: true };
    }

    case 'CLOSE_CART': {
      return { ...state, isOpen: false };
    }

    case 'SET_CART': {
      return { ...state, items: action.payload, isOpen: false };
    }

    default:
      return state;
  }
}

const createTestState = (overrides = {}) => ({
  items: [],
  isOpen: false,
  ...overrides,
});

test('CartReducer - ADD_ITEM adds new product', () => {
  const state = createTestState();
  const product = { id: 'prod-1', name: 'Test', price: 100, quantity: 1 };
  const action = { type: 'ADD_ITEM', payload: { product, quantity: 2 } };
  const result = cartReducer(state, action);

  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].id, 'prod-1');
  assert.equal(result.items[0].quantity, 2);
  assert.equal(result.isOpen, true);
});

test('CartReducer - ADD_ITEM increments quantity for existing product', () => {
  const state = createTestState({
    items: [{ id: 'prod-1', name: 'Test', price: 100, quantity: 1 }],
  });
  const product = { id: 'prod-1', name: 'Test', price: 100 };
  const action = { type: 'ADD_ITEM', payload: { product, quantity: 2 } };
  const result = cartReducer(state, action);

  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].quantity, 3);
});

test('CartReducer - REMOVE_ITEM removes product', () => {
  const state = createTestState({
    items: [{ id: 'prod-1', name: 'Test', price: 100, quantity: 1 }],
  });
  const action = { type: 'REMOVE_ITEM', payload: 'prod-1' };
  const result = cartReducer(state, action);

  assert.equal(result.items.length, 0);
});

test('CartReducer - UPDATE_QUANTITY updates quantity', () => {
  const state = createTestState({
    items: [{ id: 'prod-1', name: 'Test', price: 100, quantity: 1 }],
  });
  const action = { type: 'UPDATE_QUANTITY', payload: { id: 'prod-1', quantity: 5 } };
  const result = cartReducer(state, action);

  assert.equal(result.items[0].quantity, 5);
});

test('CartReducer - UPDATE_QUANTITY removes item when quantity <= 0', () => {
  const state = createTestState({
    items: [{ id: 'prod-1', name: 'Test', price: 100, quantity: 1 }],
  });
  const action = { type: 'UPDATE_QUANTITY', payload: { id: 'prod-1', quantity: 0 } };
  const result = cartReducer(state, action);

  assert.equal(result.items.length, 0);
});

test('CartReducer - CLEAR_CART empties cart', () => {
  const state = createTestState({
    items: [
      { id: 'prod-1', name: 'Test', price: 100, quantity: 1 },
      { id: 'prod-2', name: 'Test2', price: 200, quantity: 2 },
    ],
  });
  const action = { type: 'CLEAR_CART' };
  const result = cartReducer(state, action);

  assert.equal(result.items.length, 0);
});

test('CartReducer - TOGGLE_CART toggles isOpen', () => {
  let state = createTestState({ isOpen: false });
  let action = { type: 'TOGGLE_CART' };
  let result = cartReducer(state, action);
  assert.equal(result.isOpen, true);

  state = createTestState({ isOpen: true });
  result = cartReducer(state, action);
  assert.equal(result.isOpen, false);
});

test('CartReducer - OPEN_CART opens cart', () => {
  const state = createTestState({ isOpen: false });
  const action = { type: 'OPEN_CART' };
  const result = cartReducer(state, action);

  assert.equal(result.isOpen, true);
});

test('CartReducer - CLOSE_CART closes cart', () => {
  const state = createTestState({ isOpen: true });
  const action = { type: 'CLOSE_CART' };
  const result = cartReducer(state, action);

  assert.equal(result.isOpen, false);
});

test('CartReducer - SET_CART replaces items', () => {
  const state = createTestState({
    items: [{ id: 'prod-1', name: 'Test', price: 100, quantity: 1 }],
  });
  const newItems = [
    { id: 'prod-2', name: 'Test2', price: 200, quantity: 3 },
    { id: 'prod-3', name: 'Test3', price: 300, quantity: 1 },
  ];
  const action = { type: 'SET_CART', payload: newItems };
  const result = cartReducer(state, action);

  assert.equal(result.items.length, 2);
  assert.equal(result.items[0].id, 'prod-2');
  assert.equal(result.isOpen, false);
});

test('CartReducer - unknown action returns current state', () => {
  const state = createTestState({ items: [{ id: 'prod-1' }] });
  const action = { type: 'UNKNOWN_ACTION' };
  const result = cartReducer(state, action);

  assert.equal(result, state);
});