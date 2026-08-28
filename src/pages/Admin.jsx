import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useDropship } from '../context/DropshipContext';
import { getAllProducts, formatPrice, calculateMargin, calculateProfit } from '../data/products';
import { Layout } from '../components/layout/Layout';
import { PageLoader } from '../components/PageLoader';
import './Admin.css';

const AdminTabs = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'orders', label: 'Customer Orders', icon: '📦' },
  { id: 'dropship', label: 'Dropship Orders', icon: '🚚' },
  { id: 'suppliers', label: 'Suppliers', icon: '🏭' },
  { id: 'products', label: 'Products', icon: '📦' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export function Admin() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { orders, getOrderById, updateOrderStatus } = useOrders();
  const {
    suppliers,
    dropshipOrders,
    settings,
    notifications,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    createDropshipOrder,
    updateDropshipOrderStatus,
    calculateShipping,
    getShippingMethods,
    exportOrdersCSV,
    exportProductsCSV,
    updateSettings,
  } = useDropship();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    gstin: '',
    categories: [],
    minOrderValue: 0,
    leadTime: '',
    commissionRate: 0,
    paymentTerms: '',
    apiEndpoint: '',
    apiKey: '',
  });
  const [newDropshipOrder, setNewDropshipOrder] = useState({ supplierId: '', customerOrderId: '', items: [] });
  const [showDropshipModal, setShowDropshipModal] = useState(false);

  // Check admin access
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/admin' } });
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Stats computation
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
    totalProfit: dropshipOrders.reduce((sum, o) => sum + (o.totalProfit || 0), 0),
    pendingDropship: dropshipOrders.filter(o => o.status === 'pending').length,
    activeSuppliers: suppliers.filter(s => s.status === 'active').length,
    lowStockProducts: getAllProducts().filter(p => p.inStock && p.stock !== undefined && p.stock < 10).length,
  };

  const handleSupplierSubmit = (e) => {
    e.preventDefault();
    if (editingSupplier) {
      updateSupplier({ ...editingSupplier, ...supplierForm });
    } else {
      addSupplier(supplierForm);
    }
    setShowSupplierModal(false);
    setEditingSupplier(null);
    setSupplierForm({
      name: '', contactPerson: '', email: '', phone: '', address: '', gstin: '',
      categories: [], minOrderValue: 0, leadTime: '', commissionRate: 0,
      paymentTerms: '', apiEndpoint: '', apiKey: '',
    });
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setSupplierForm(supplier);
    setShowSupplierModal(true);
  };

  const handleDeleteSupplier = (id) => {
    if (window.confirm('Delete this supplier?')) {
      deleteSupplier(id);
    }
  };

  const handleCreateDropshipOrder = (e) => {
    e.preventDefault();
    const customerOrder = getOrderById(newDropshipOrder.customerOrderId);
    if (!customerOrder) {
      alert('Customer order not found');
      return;
    }
    createDropshipOrder({
      supplierId: newDropshipOrder.supplierId,
      customerOrderId: newDropshipOrder.customerOrderId,
      items: customerOrder.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        supplierSku: item.supplierSku,
      })),
      retailPrice: customerOrder.total,
      shippingAddress: customerOrder.shippingAddress,
    });
    setShowDropshipModal(false);
    setNewDropshipOrder({ supplierId: '', customerOrderId: '', items: [] });
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (loading || authLoading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <PageLoader />
        </div>
      </Layout>
    );
  }

  const renderOverview = () => (
    <div className="admin-grid">
      <div className="stat-card">
        <div className="stat-icon">📦</div>
        <div className="stat-value">{stats.totalOrders}</div>
        <div className="stat-label">Total Orders</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">💰</div>
        <div className="stat-value">{formatPrice(stats.totalRevenue / 85)}</div>
        <div className="stat-label">Total Revenue</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">📈</div>
        <div className="stat-value">{formatPrice(stats.totalProfit / 85)}</div>
        <div className="stat-label">Total Profit</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">🚚</div>
        <div className="stat-value">{stats.pendingDropship}</div>
        <div className="stat-label">Pending Dropship</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">🏭</div>
        <div className="stat-value">{stats.activeSuppliers}</div>
        <div className="stat-label">Active Suppliers</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">⚠️</div>
        <div className="stat-value">{stats.lowStockProducts}</div>
        <div className="stat-label">Low Stock Items</div>
      </div>

      <div className="admin-section" style={{ gridColumn: '1 / -1' }}>
        <h3>Recent Notifications</h3>
        {notifications.length === 0 ? (
          <p className="empty-state">No notifications yet</p>
        ) : (
          <div className="notification-list">
            {notifications.slice(0, 10).map(notif => (
              <div key={notif.id} className={`notification ${notif.type}`}>
                <span>{notif.message}</span>
                <time>{new Date(notif.timestamp).toLocaleString()}</time>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="admin-section" style={{ gridColumn: '1 / -1' }}>
        <h3>Quick Actions</h3>
        <div className="quick-actions">
          <button className="btn btn-primary" onClick={() => setShowSupplierModal(true)}>+ Add Supplier</button>
          <button className="btn btn-secondary" onClick={() => setShowDropshipModal(true)}>+ Create Dropship Order</button>
          <button className="btn btn-secondary" onClick={() => downloadCSV(exportOrdersCSV(), 'dropship-orders.csv')}>Export Dropship Orders</button>
          <button className="btn btn-secondary" onClick={() => downloadCSV(exportProductsCSV(), 'products.csv')}>Export Products</button>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="admin-section">
      <h3>Customer Orders</h3>
      {orders.length === 0 ? (
        <p className="empty-state">No orders yet</p>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.customerName || order.email || 'Guest'}</td>
                  <td>{order.items?.length || 0} items</td>
                  <td>{formatPrice(order.total / 85)}</td>
                  <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                  <td>
                    <button className="btn btn-sm" onClick={() => updateOrderStatus(order.id, 'processing')}>Process</button>
                    <button className="btn btn-sm" onClick={() => { setShowDropshipModal(true); setNewDropshipOrder({...newDropshipOrder, customerOrderId: order.id}); }}>Dropship</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderDropshipOrders = () => (
    <div className="admin-section">
      <h3>Dropship Orders</h3>
      {dropshipOrders.length === 0 ? (
        <p className="empty-state">No dropship orders yet</p>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Supplier</th>
                <th>Customer Order</th>
                <th>Retail Total</th>
                <th>Supplier Cost</th>
                <th>Profit</th>
                <th>Margin</th>
                <th>Status</th>
                <th>Tracking</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dropshipOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.supplierName}</td>
                  <td>{order.customerOrderId}</td>
                  <td>{formatPrice(order.subtotal / 85)}</td>
                  <td>{formatPrice(order.supplierTotal / 85)}</td>
                  <td className="profit">{formatPrice(order.totalProfit / 85)}</td>
                  <td>{order.margin}%</td>
                  <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                  <td>{order.trackingNumber || '-'}</td>
                  <td>
                    {order.status === 'pending' && (
                      <button className="btn btn-sm" onClick={() => updateDropshipOrderStatus(order.id, 'forwarded')}>Forward</button>
                    )}
                    {order.status === 'forwarded' && (
                      <button className="btn btn-sm" onClick={() => {
                        const tracking = prompt('Enter tracking number:');
                        if (tracking) updateDropshipOrderStatus(order.id, 'shipped', tracking);
                      }}>Ship</button>
                    )}
                    {order.status === 'shipped' && (
                      <button className="btn btn-sm" onClick={() => updateDropshipOrderStatus(order.id, 'delivered')}>Deliver</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderSuppliers = () => (
    <div className="admin-section">
      <div className="section-header">
        <h3>Suppliers</h3>
        <button className="btn btn-primary" onClick={() => { setEditingSupplier(null); setShowSupplierModal(true); }}>+ Add Supplier</button>
      </div>
      {suppliers.length === 0 ? (
        <p className="empty-state">No suppliers configured</p>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Categories</th>
                <th>Min Order</th>
                <th>Lead Time</th>
                <th>Commission</th>
                <th>Rating</th>
                <th>Orders</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(supplier => (
                <tr key={supplier.id}>
                  <td><strong>{supplier.name}</strong></td>
                  <td>{supplier.contactPerson}<br /><small>{supplier.email}</small></td>
                  <td>{supplier.categories.join(', ')}</td>
                  <td>{formatPrice(supplier.minOrderValue / 85)}</td>
                  <td>{supplier.leadTime}</td>
                  <td>{supplier.commissionRate}%</td>
                  <td>{supplier.rating}/5.0</td>
                  <td>{supplier.fulfilledOrders}/{supplier.totalOrders}</td>
                  <td><span className={`status-badge ${supplier.status}`}>{supplier.status}</span></td>
                  <td>
                    <button className="btn btn-sm" onClick={() => handleEditSupplier(supplier)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteSupplier(supplier.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showSupplierModal && (
        <div className="modal-overlay" onClick={() => { setShowSupplierModal(false); setEditingSupplier(null); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</h3>
            <form onSubmit={handleSupplierSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Supplier Name *</label>
                  <input type="text" value={supplierForm.name} onChange={e => setSupplierForm({...supplierForm, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Contact Person</label>
                  <input type="text" value={supplierForm.contactPerson} onChange={e => setSupplierForm({...supplierForm, contactPerson: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" value={supplierForm.email} onChange={e => setSupplierForm({...supplierForm, email: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" value={supplierForm.phone} onChange={e => setSupplierForm({...supplierForm, phone: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea value={supplierForm.address} onChange={e => setSupplierForm({...supplierForm, address: e.target.value})} rows={2} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>GSTIN</label>
                  <input type="text" value={supplierForm.gstin} onChange={e => setSupplierForm({...supplierForm, gstin: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Categories (comma separated)</label>
                  <input type="text" value={supplierForm.categories.join(', ')} onChange={e => setSupplierForm({...supplierForm, categories: e.target.value.split(',').map(c => c.trim()).filter(Boolean)})} placeholder="spheres, platonic, geodes" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Min Order Value</label>
                  <input type="number" value={supplierForm.minOrderValue} onChange={e => setSupplierForm({...supplierForm, minOrderValue: parseInt(e.target.value) || 0})} />
                </div>
                <div className="form-group">
                  <label>Lead Time</label>
                  <input type="text" value={supplierForm.leadTime} onChange={e => setSupplierForm({...supplierForm, leadTime: e.target.value})} placeholder="3-5 days" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Commission Rate %</label>
                  <input type="number" step="0.1" value={supplierForm.commissionRate} onChange={e => setSupplierForm({...supplierForm, commissionRate: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="form-group">
                  <label>Payment Terms</label>
                  <input type="text" value={supplierForm.paymentTerms} onChange={e => setSupplierForm({...supplierForm, paymentTerms: e.target.value})} placeholder="Net 30" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>API Endpoint</label>
                  <input type="url" value={supplierForm.apiEndpoint} onChange={e => setSupplierForm({...supplierForm, apiEndpoint: e.target.value})} placeholder="https://api.supplier.com/orders" />
                </div>
                <div className="form-group">
                  <label>API Key</label>
                  <input type="text" value={supplierForm.apiKey} onChange={e => setSupplierForm({...supplierForm, apiKey: e.target.value})} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowSupplierModal(false); setEditingSupplier(null); }}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingSupplier ? 'Update' : 'Add Supplier'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderProducts = () => {
    const products = getAllProducts();
    return (
      <div className="admin-section">
        <h3>Product Catalog</h3>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Supplier</th>
                <th>Cost Price</th>
                <th>Retail Price</th>
                <th>Margin</th>
                <th>Profit/Unit</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const supplier = suppliers.find(s => s.id === product.supplierId);
                const margin = product.costPrice ? calculateMargin(product.costPrice, product.price) : product.margin;
                const profit = product.costPrice ? calculateProfit(product.costPrice, product.price) : 0;
                return (
                  <tr key={product.id}>
                    <td>
                      <div className="product-thumb" style={{ background: `linear-gradient(135deg, ${product.color}, ${product.secondaryColor})` }} />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{supplier?.name || 'N/A'}</td>
                    <td>{product.costPrice ? formatPrice(product.costPrice / 85) : 'N/A'}</td>
                    <td>{formatPrice(product.price / 85)}</td>
                    <td>{margin}%</td>
                    <td className="profit">{product.costPrice ? formatPrice(profit / 85) : 'N/A'}</td>
                    <td>{product.inStock ? 'In Stock' : 'Out of Stock'}</td>
                    <td><span className={`status-badge ${product.inStock ? 'confirmed' : 'cancelled'}`}>{product.inStock ? 'Active' : 'Inactive'}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="admin-section">
      <h3>Dropshipping Settings</h3>
      <div className="settings-grid">
        <div className="settings-card">
          <h4>Default Profit Margin</h4>
          <div className="form-group">
            <label>Default Margin %</label>
            <input type="number" min="0" max="100" step="1"
              value={settings.defaultMargin}
              onChange={e => updateSettings({ defaultMargin: parseInt(e.target.value) || 40 })} />
          </div>
        </div>
        <div className="settings-card">
          <h4>Auto-Forward Orders</h4>
          <label className="checkbox-label">
            <input type="checkbox"
              checked={settings.autoForwardOrders}
              onChange={e => updateSettings({ autoForwardOrders: e.target.checked })} />
            Automatically forward orders to suppliers when created
          </label>
        </div>
        <div className="settings-card">
          <h4>Tax Settings</h4>
          <div className="form-group">
            <label>GST Rate %</label>
            <input type="number" min="0" max="100" step="0.5"
              value={settings.taxRate}
              onChange={e => updateSettings({ taxRate: parseFloat(e.target.value) || 18 })} />
          </div>
        </div>
        <div className="settings-card">
          <h4>Shipping Methods</h4>
          {settings.shippingMethods.map((method, idx) => (
            <div key={method.id} className="shipping-method-row">
              <input type="text" value={method.name} onChange={e => {
                const updated = [...settings.shippingMethods];
                updated[idx] = { ...updated[idx], name: e.target.value };
                updateSettings({ shippingMethods: updated });
              }} />
              <input type="number" placeholder="Price" value={method.price} onChange={e => {
                const updated = [...settings.shippingMethods];
                updated[idx] = { ...updated[idx], price: parseInt(e.target.value) || 0 };
                updateSettings({ shippingMethods: updated });
              }} />
              <input type="text" placeholder="Days" value={method.days} onChange={e => {
                const updated = [...settings.shippingMethods];
                updated[idx] = { ...updated[idx], days: e.target.value };
                updateSettings({ shippingMethods: updated });
              }} />
              <input type="number" placeholder="Free threshold" value={method.freeThreshold} onChange={e => {
                const updated = [...settings.shippingMethods];
                updated[idx] = { ...updated[idx], freeThreshold: parseInt(e.target.value) || 0 };
                updateSettings({ shippingMethods: updated });
              }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'orders': return renderOrders();
      case 'dropship': return renderDropshipOrders();
      case 'suppliers': return renderSuppliers();
      case 'products': return renderProducts();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <Layout>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <h2>🛍️ Calm Shop Admin</h2>
            <p>Dropshipping Dashboard</p>
          </div>
          <nav className="admin-nav">
            {AdminTabs.map(tab => (
              <button
                key={tab.id}
                className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>
        <main className="admin-main">
          <header className="admin-header">
            <h1>{AdminTabs.find(t => t.id === activeTab)?.label}</h1>
            <div className="admin-user">
              <span>Admin Panel</span>
            </div>
          </header>
          <div className="admin-content">
            {renderTab()}
          </div>
        </main>
      </div>
    </Layout>
  );
}

export default Admin;