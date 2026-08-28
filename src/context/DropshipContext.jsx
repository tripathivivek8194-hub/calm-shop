import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const DropshipContext = createContext(null);

const SUPPLIERS_KEY = 'calm-shop-suppliers';
const DROPSHIP_ORDERS_KEY = 'calm-shop-dropship-orders';
const SETTINGS_KEY = 'calm-shop-dropship-settings';

const initialState = {
  suppliers: [],
  dropshipOrders: [],
  settings: {
    defaultMargin: 40, // percentage
    autoForwardOrders: true,
    currency: 'INR',
    shippingMethods: [
      { id: 'standard', name: 'Standard Shipping', price: 50, days: '5-7', freeThreshold: 1000 },
      { id: 'express', name: 'Express Shipping', price: 150, days: '2-3', freeThreshold: 2000 },
      { id: 'premium', name: 'Premium Shipping', price: 300, days: '1-2', freeThreshold: 5000 },
    ],
    taxRate: 18, // GST percentage
  },
  notifications: [],
};

function dropshipReducer(state, action) {
  switch (action.type) {
    case 'SET_SUPPLIERS': {
      return { ...state, suppliers: action.payload };
    }
    case 'ADD_SUPPLIER': {
      return { ...state, suppliers: [action.payload, ...state.suppliers] };
    }
    case 'UPDATE_SUPPLIER': {
      return {
        ...state,
        suppliers: state.suppliers.map(s => s.id === action.payload.id ? action.payload : s),
      };
    }
    case 'DELETE_SUPPLIER': {
      return {
        ...state,
        suppliers: state.suppliers.filter(s => s.id !== action.payload),
      };
    }
    case 'SET_DROPSHIP_ORDERS': {
      return { ...state, dropshipOrders: action.payload };
    }
    case 'ADD_DROPSHIP_ORDER': {
      return { ...state, dropshipOrders: [action.payload, ...state.dropshipOrders] };
    }
    case 'UPDATE_DROPSHIP_ORDER': {
      return {
        ...state,
        dropshipOrders: state.dropshipOrders.map(o => o.id === action.payload.id ? action.payload : o),
      };
    }
    case 'SET_SETTINGS': {
      return { ...state, settings: { ...state.settings, ...action.payload } };
    }
    case 'ADD_NOTIFICATION': {
      return { ...state, notifications: [action.payload, ...state.notifications].slice(0, 50) };
    }
    case 'CLEAR_NOTIFICATIONS': {
      return { ...state, notifications: [] };
    }
    default:
      return state;
  }
}

export function DropshipProvider({ children }) {
  const [state, dispatch] = useReducer(dropshipReducer, initialState, () => {
    try {
      const storedSuppliers = localStorage.getItem(SUPPLIERS_KEY);
      const storedOrders = localStorage.getItem(DROPSHIP_ORDERS_KEY);
      const storedSettings = localStorage.getItem(SETTINGS_KEY);
      return {
        ...initialState,
        suppliers: storedSuppliers ? JSON.parse(storedSuppliers) : getDefaultSuppliers(),
        dropshipOrders: storedOrders ? JSON.parse(storedOrders) : [],
        settings: storedSettings ? JSON.parse(storedSettings) : initialState.settings,
      };
    } catch (e) {
      console.warn('Failed to parse dropship data:', e);
      return { ...initialState, suppliers: getDefaultSuppliers() };
    }
  });

  useEffect(() => {
    localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(state.suppliers));
  }, [state.suppliers]);

  useEffect(() => {
    localStorage.setItem(DROPSHIP_ORDERS_KEY, JSON.stringify(state.dropshipOrders));
  }, [state.dropshipOrders]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
  }, [state.settings]);

  // Supplier management
  const addSupplier = useCallback((supplierData) => {
    const supplier = {
      id: `SUP-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: 'active',
      rating: 5,
      totalOrders: 0,
      fulfilledOrders: 0,
      ...supplierData,
    };
    dispatch({ type: 'ADD_SUPPLIER', payload: supplier });
    return supplier;
  }, []);

  const updateSupplier = useCallback((supplier) => {
    dispatch({ type: 'UPDATE_SUPPLIER', payload: supplier });
  }, []);

  const deleteSupplier = useCallback((id) => {
    dispatch({ type: 'DELETE_SUPPLIER', payload: id });
  }, []);

  const getSupplierById = useCallback((id) => {
    return state.suppliers.find(s => s.id === id);
  }, [state.suppliers]);

  // Dropship order management
  const createDropshipOrder = useCallback((orderData) => {
    const supplier = state.suppliers.find(s => s.id === orderData.supplierId);
    const margin = orderData.margin || state.settings.defaultMargin;
    const supplierPrice = orderData.retailPrice / (1 + margin / 100);
    const profit = orderData.retailPrice - supplierPrice;

    const dropshipOrder = {
      id: `DS-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      supplierId: orderData.supplierId,
      supplierName: supplier?.name || 'Unknown Supplier',
      customerOrderId: orderData.customerOrderId,
      items: orderData.items.map(item => ({
        ...item,
        supplierPrice: item.price / (1 + margin / 100),
        margin,
        profit: item.price - (item.price / (1 + margin / 100)),
      })),
      subtotal: orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      supplierTotal: orderData.items.reduce((sum, item) => sum + (item.price / (1 + margin / 100)) * item.quantity, 0),
      totalProfit: orderData.items.reduce((sum, item) => sum + (item.price - item.price / (1 + margin / 100)) * item.quantity, 0),
      margin,
      shippingAddress: orderData.shippingAddress,
      trackingNumber: null,
      estimatedDelivery: null,
    };
    dispatch({ type: 'ADD_DROPSHIP_ORDER', payload: dropshipOrder });

    // Auto-forward to supplier if enabled
    if (state.settings.autoForwardOrders) {
      forwardToSupplier(dropshipOrder);
    }

    return dropshipOrder;
  }, [state.suppliers, state.settings]);

  const forwardToSupplier = useCallback(async (dropshipOrder) => {
    // Simulate API call to supplier
    await new Promise(resolve => setTimeout(resolve, 500));

    dispatch({
      type: 'UPDATE_DROPSHIP_ORDER',
      payload: {
        ...dropshipOrder,
        status: 'forwarded',
        forwardedAt: new Date().toISOString(),
      },
    });

    // Update supplier stats
    const supplier = state.suppliers.find(s => s.id === dropshipOrder.supplierId);
    if (supplier) {
      updateSupplier({
        ...supplier,
        totalOrders: supplier.totalOrders + 1,
      });
    }

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `notif-${Date.now()}`,
        type: 'success',
        message: `Order ${dropshipOrder.id} forwarded to ${dropshipOrder.supplierName}`,
        timestamp: new Date().toISOString(),
      },
    });
  }, [state.suppliers, updateSupplier]);

  const updateDropshipOrderStatus = useCallback((id, status, trackingNumber = null) => {
    const order = state.dropshipOrders.find(o => o.id === id);
    if (order) {
      dispatch({
        type: 'UPDATE_DROPSHIP_ORDER',
        payload: {
          ...order,
          status,
          trackingNumber: trackingNumber || order.trackingNumber,
          ...(status === 'delivered' ? { deliveredAt: new Date().toISOString() } : {}),
        },
      });

      if (status === 'delivered') {
        const supplier = state.suppliers.find(s => s.id === order.supplierId);
        if (supplier) {
          updateSupplier({
            ...supplier,
            fulfilledOrders: supplier.fulfilledOrders + 1,
          });
        }
      }
    }
  }, [state.dropshipOrders, state.suppliers, updateSupplier]);

  const updateSettings = useCallback((newSettings) => {
    dispatch({ type: 'SET_SETTINGS', payload: newSettings });
  }, []);

  // Profit calculation utilities
  const calculateRetailPrice = useCallback((supplierPrice, margin = null) => {
    const m = margin || state.settings.defaultMargin;
    return Math.round(supplierPrice * (1 + m / 100));
  }, [state.settings.defaultMargin]);

  const calculateMargin = useCallback((supplierPrice, retailPrice) => {
    return Math.round(((retailPrice - supplierPrice) / retailPrice) * 100);
  }, []);

  const calculateProfit = useCallback((supplierPrice, retailPrice, quantity = 1) => {
    return (retailPrice - supplierPrice) * quantity;
  }, []);

  // Import/Export
  const exportProductsCSV = useCallback(() => {
    // This would be called with products from ProductContext
    return '';
  }, []);

  const importProductsFromCSV = useCallback(async (csvText) => {
    // Parse CSV and create products
    return [];
  }, []);

  const exportOrdersCSV = useCallback(() => {
    const headers = ['Order ID', 'Date', 'Supplier', 'Customer Order', 'Items', 'Retail Total', 'Supplier Total', 'Profit', 'Margin %', 'Status', 'Tracking'];
    const rows = state.dropshipOrders.map(order => [
      order.id,
      new Date(order.createdAt).toLocaleDateString(),
      order.supplierName,
      order.customerOrderId,
      order.items.map(i => `${i.name} x${i.quantity}`).join('; '),
      order.subtotal,
      order.supplierTotal,
      order.totalProfit,
      order.margin,
      order.status,
      order.trackingNumber || '',
    ]);
    return [headers, ...rows].map(r => r.join(',')).join('\n');
  }, [state.dropshipOrders]);

  // Shipping calculation
  const calculateShipping = useCallback((subtotal, methodId = 'standard') => {
    const method = state.settings.shippingMethods.find(m => m.id === methodId);
    if (!method) return 0;
    if (subtotal >= method.freeThreshold) return 0;
    return method.price;
  }, [state.settings.shippingMethods]);

  const getShippingMethods = useCallback(() => {
    return state.settings.shippingMethods;
  }, [state.settings.shippingMethods]);

  const value = {
    // State
    suppliers: state.suppliers,
    dropshipOrders: state.dropshipOrders,
    settings: state.settings,
    notifications: state.notifications,
    // Supplier actions
    addSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplierById,
    // Dropship order actions
    createDropshipOrder,
    forwardToSupplier,
    updateDropshipOrderStatus,
    // Settings
    updateSettings,
    // Profit calculations
    calculateRetailPrice,
    calculateMargin,
    calculateProfit,
    // Import/Export
    exportProductsCSV,
    importProductsFromCSV,
    exportOrdersCSV,
    // Shipping
    calculateShipping,
    getShippingMethods,
  };

  return (
    <DropshipContext.Provider value={value}>
      {children}
    </DropshipContext.Provider>
  );
}

export function useDropship() {
  const context = useContext(DropshipContext);
  if (!context) {
    throw new Error('useDropship must be used within a DropshipProvider');
  }
  return context;
}

// Default suppliers for demo
function getDefaultSuppliers() {
  return [
    {
      id: 'SUP-DEMO-1',
      name: 'Zenith Home Decor',
      contactPerson: 'Rajesh Kumar',
      email: 'rajesh@zenithdecor.com',
      phone: '+91 98765 43210',
      address: 'Industrial Area, Phase 2, Gurgaon, Haryana 122002',
      gstin: '06AAACZ1234Z1Z5',
      categories: ['spheres', 'platonic', 'geodes'],
      minOrderValue: 5000,
      leadTime: '3-5 days',
      commissionRate: 15,
      paymentTerms: 'Net 30',
      status: 'active',
      rating: 4.8,
      totalOrders: 127,
      fulfilledOrders: 122,
      createdAt: '2025-01-15T10:00:00Z',
      apiEndpoint: 'https://api.zenithdecor.com/orders',
      apiKey: 'zk_live_demo_key_123',
    },
    {
      id: 'SUP-DEMO-2',
      name: 'Artisan Crafts India',
      contactPerson: 'Priya Sharma',
      email: 'priya@artisancrafts.in',
      phone: '+91 87654 32109',
      address: 'Handicraft Hub, Jaipur, Rajasthan 302001',
      gstin: '08AABCA5678P2Z9',
      categories: ['organic', 'knots'],
      minOrderValue: 3000,
      leadTime: '5-7 days',
      commissionRate: 12,
      paymentTerms: 'Net 15',
      status: 'active',
      rating: 4.6,
      totalOrders: 89,
      fulfilledOrders: 85,
      createdAt: '2025-02-20T10:00:00Z',
      apiEndpoint: 'https://api.artisancrafts.in/dropship',
      apiKey: 'aci_live_demo_key_456',
    },
    {
      id: 'SUP-DEMO-3',
      name: 'Modern Geometry Co.',
      contactPerson: 'Amit Patel',
      email: 'amit@moderngemetry.co',
      phone: '+91 76543 21098',
      address: 'Tech Park, Whitefield, Bangalore, Karnataka 560066',
      gstin: '29AADCM9012Q3Z4',
      categories: ['knots', 'platonic', 'geodes'],
      minOrderValue: 10000,
      leadTime: '2-3 days',
      commissionRate: 18,
      paymentTerms: 'Net 45',
      status: 'active',
      rating: 4.9,
      totalOrders: 203,
      fulfilledOrders: 198,
      createdAt: '2025-03-10T10:00:00Z',
      apiEndpoint: 'https://api.moderngemetry.co/v1/orders',
      apiKey: 'mgc_live_demo_key_789',
    },
  ];
}