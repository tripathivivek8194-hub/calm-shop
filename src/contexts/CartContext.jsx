/* Cart Context */
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CartContext = createContext(null);

const initialState = {
  items: [],
  isOpen: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant, quantity = 1 } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.productId === product.id && item.variantId === variant.id
      );

      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += quantity;
        return { ...state, items: newItems };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            id: `${product.id}-${variant.id}-${Date.now()}`,
            productId: product.id,
            variantId: variant.id,
            quantity,
            addedAt: Date.now(),
          },
        ],
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== itemId),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
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

    case 'SET_ITEMS': {
      return { ...state, items: action.payload };
    }

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [savedItems, setSavedItems] = useLocalStorage('calm-shop-cart', []);
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Sync with localStorage on mount
  useEffect(() => {
    if (savedItems.length > 0) {
      dispatch({ type: 'SET_ITEMS', payload: savedItems });
    }
  }, [savedItems]);

  // Persist to localStorage
  useEffect(() => {
    setSavedItems(state.items);
  }, [state.items, setSavedItems]);

  const addItem = useCallback((product, variant, quantity) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, variant, quantity } });
    dispatch({ type: 'OPEN_CART' });
  }, []);

  const removeItem = useCallback((itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const toggleCart = useCallback(() => {
    dispatch({ type: 'TOGGLE_CART' });
  }, []);

  const openCart = useCallback(() => {
    dispatch({ type: 'OPEN_CART' });
  }, []);

  const closeCart = useCallback(() => {
    dispatch({ type: 'CLOSE_CART' });
  }, []);

  // Computed values
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => {
    // We'll need product data to calculate - placeholder
    return sum + (item.price || 0) * item.quantity;
  }, 0);

  const value = {
    ...state,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}