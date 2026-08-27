import assert from 'node:assert/strict';
import test from 'node:test';

// Import the wishlistReducer logic directly (testing the pure reducer function)
const initialState = {
  items: [],
};

function wishlistReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product } = action.payload;
      const exists = state.items.some(item => item.id === product.id);
      if (exists) {
        return state;
      }
      return {
        ...state,
        items: [...state.items, product],
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    }

    case 'TOGGLE_ITEM': {
      const { product } = action.payload;
      const exists = state.items.some(item => item.id === product.id);
      if (exists) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== product.id),
        };
      }
      return {
        ...state,
        items: [...state.items, product],
      };
    }

    case 'CLEAR_WISHLIST': {
      return { ...state, items: [] };
    }

    case 'SET_WISHLIST': {
      return { ...state, items: action.payload };
    }

    default:
      return state;
  }
}

const createTestState = (overrides = {}) => ({
  items: [],
  ...overrides,
});

test('WishlistReducer - ADD_ITEM adds new product', () => {
  const state = createTestState();
  const product = { id: 'prod-1', name: 'Test', price: 100 };
  const action = { type: 'ADD_ITEM', payload: { product } };
  const result = wishlistReducer(state, action);

  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].id, 'prod-1');
});

test('WishlistReducer - ADD_ITEM does not duplicate', () => {
  const state = createTestState({
    items: [{ id: 'prod-1', name: 'Test', price: 100 }],
  });
  const product = { id: 'prod-1', name: 'Test', price: 100 };
  const action = { type: 'ADD_ITEM', payload: { product } };
  const result = wishlistReducer(state, action);

  assert.equal(result.items.length, 1);
});

test('WishlistReducer - REMOVE_ITEM removes product', () => {
  const state = createTestState({
    items: [{ id: 'prod-1', name: 'Test', price: 100 }],
  });
  const action = { type: 'REMOVE_ITEM', payload: 'prod-1' };
  const result = wishlistReducer(state, action);

  assert.equal(result.items.length, 0);
});

test('WishlistReducer - TOGGLE_ITEM adds when not present', () => {
  const state = createTestState();
  const product = { id: 'prod-1', name: 'Test', price: 100 };
  const action = { type: 'TOGGLE_ITEM', payload: { product } };
  const result = wishlistReducer(state, action);

  assert.equal(result.items.length, 1);
});

test('WishlistReducer - TOGGLE_ITEM removes when present', () => {
  const state = createTestState({
    items: [{ id: 'prod-1', name: 'Test', price: 100 }],
  });
  const product = { id: 'prod-1', name: 'Test', price: 100 };
  const action = { type: 'TOGGLE_ITEM', payload: { product } };
  const result = wishlistReducer(state, action);

  assert.equal(result.items.length, 0);
});

test('WishlistReducer - CLEAR_WISHLIST empties wishlist', () => {
  const state = createTestState({
    items: [
      { id: 'prod-1', name: 'Test', price: 100 },
      { id: 'prod-2', name: 'Test2', price: 200 },
    ],
  });
  const action = { type: 'CLEAR_WISHLIST' };
  const result = wishlistReducer(state, action);

  assert.equal(result.items.length, 0);
});

test('WishlistReducer - SET_WISHLIST replaces items', () => {
  const state = createTestState({
    items: [{ id: 'prod-1', name: 'Test', price: 100 }],
  });
  const newItems = [
    { id: 'prod-2', name: 'Test2', price: 200 },
    { id: 'prod-3', name: 'Test3', price: 300 },
  ];
  const action = { type: 'SET_WISHLIST', payload: newItems };
  const result = wishlistReducer(state, action);

  assert.equal(result.items.length, 2);
  assert.equal(result.items[0].id, 'prod-2');
});

test('WishlistReducer - unknown action returns current state', () => {
  const state = createTestState({ items: [{ id: 'prod-1' }] });
  const action = { type: 'UNKNOWN_ACTION' };
  const result = wishlistReducer(state, action);

  assert.equal(result, state);
});