import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const WishlistContext = createContext(null);

const WISHLIST_STORAGE_KEY = 'calm-shop-wishlist';

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

export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState, () => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...initialState, items: parsed };
      }
    } catch (e) {
      console.warn('Failed to parse wishlist from localStorage:', e);
    }
    return initialState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(state.items));
    } catch (e) {
      console.warn('Failed to save wishlist to localStorage:', e);
    }
  }, [state.items]);

  const addItem = useCallback((product) => {
    dispatch({ type: 'ADD_ITEM', payload: { product } });
  }, []);

  const removeItem = useCallback((id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const toggleItem = useCallback((product) => {
    dispatch({ type: 'TOGGLE_ITEM', payload: { product } });
  }, []);

  const clearWishlist = useCallback(() => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  }, []);

  const isInWishlist = useCallback((id) => {
    return state.items.some(item => item.id === id);
  }, [state.items]);

  const itemCount = state.items.length;

  const value = {
    ...state,
    itemCount,
    addItem,
    removeItem,
    toggleItem,
    clearWishlist,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}