import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const OrderContext = createContext(null);

const ORDER_STORAGE_KEY = 'calm-shop-orders';

const initialState = {
  orders: [],
};

function orderReducer(state, action) {
  switch (action.type) {
    case 'ADD_ORDER': {
      return {
        ...state,
        orders: [action.payload, ...state.orders],
      };
    }
    case 'SET_ORDERS': {
      return { ...state, orders: action.payload };
    }
    case 'UPDATE_ORDER': {
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? action.payload : order
        ),
      };
    }
    default:
      return state;
  }
}

export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(orderReducer, initialState, () => {
    try {
      const stored = localStorage.getItem(ORDER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...initialState, orders: parsed };
      }
    } catch (e) {
      console.warn('Failed to parse orders from localStorage:', e);
    }
    return initialState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(state.orders));
    } catch (e) {
      console.warn('Failed to save orders to localStorage:', e);
    }
  }, [state.orders]);

  const addOrder = useCallback((orderData) => {
    const order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      ...orderData,
    };
    dispatch({ type: 'ADD_ORDER', payload: order });
    return order;
  }, []);

  const getOrders = useCallback(() => {
    return state.orders;
  }, [state.orders]);

  const getOrderById = useCallback((id) => {
    return state.orders.find(order => order.id === id);
  }, [state.orders]);

  const updateOrderStatus = useCallback((id, status) => {
    dispatch({
      type: 'UPDATE_ORDER',
      payload: { id, status, updatedAt: new Date().toISOString() },
    });
  }, []);

  const value = {
    orders: state.orders,
    addOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}