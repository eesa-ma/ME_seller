import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, 
  Search, 
  MapPin, 
  Mail, 
  Calendar, 
  ShoppingBag, 
  CheckCircle,
  Truck,
  Box,
  X,
  IndianRupee
} from 'lucide-react';
import { getOrders, updateOrderStatus } from '../utils/storage';

const OrdersScreen = () => {
  const [orders, setProductsOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setProductsOrders(getOrders());
  };

  const handleStatusChange = (orderId, nextStatus) => {
    const updated = updateOrderStatus(orderId, nextStatus);
    setProductsOrders(updated);
    
    // Update the currently viewed order modal state too
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({
        ...prev,
        fulfillmentStatus: nextStatus
      }));
    }
  };

  // Filter orders by tab and search
  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'All' || order.fulfillmentStatus === activeTab;
    const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase()) || 
                          order.customerName.toLowerCase().includes(search.toLowerCase()) ||
                          order.customerEmail.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getFulfillmentIcon = (status) => {
    switch (status) {
      case 'Processing': return <Box size={14} />;
      case 'Shipped': return <Truck size={14} />;
      case 'Delivered': return <CheckCircle size={14} />;
      default: return null;
    }
  };

  return (
    <div className="orders-screen">
      <div className="orders-header">
        <div>
          <h2>Manage Shop Orders</h2>
          <p>Review customer purchases, print shipping details, and update fulfillment states.</p>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="orders-controls card">
        <div className="orders-tabs">
          {['All', 'Processing', 'Shipped', 'Delivered'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`order-tab-btn ${activeTab === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="orders-search">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by Order ID, buyer name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Grid/List */}
      <div className="orders-list-wrapper">
        {filteredOrders.length === 0 ? (
          <div className="card empty-orders-card">
            <ClipboardList size={48} className="empty-icon" />
            <p>No orders found under "{activeTab}" status.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {filteredOrders.map(order => (
              <motion.div 
                key={order.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card order-item-card"
              >
                <div className="order-item-header">
                  <div>
                    <span className="order-badge-id">{order.id}</span>
                    <span className="order-date-label">
                      <Calendar size={12} style={{marginRight: '4px'}} /> {order.date}
                    </span>
                  </div>
                  <span className={`badge ${
                    order.fulfillmentStatus === 'Delivered' ? 'badge-success' :
                    order.fulfillmentStatus === 'Shipped' ? 'badge-info' : 'badge-warning'
                  }`}>
                    {getFulfillmentIcon(order.fulfillmentStatus)}
                    <span style={{marginLeft: '4px'}}>{order.fulfillmentStatus}</span>
                  </span>
                </div>

                <div className="order-item-body">
                  <div className="order-customer-details">
                    <h4>{order.customerName}</h4>
                    <span>{order.customerEmail}</span>
                  </div>

                  <div className="order-items-preview">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="preview-row">
                        <span>{item.productName} <strong className="preview-qty">x{item.quantity}</strong></span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-total-amount">
                    <span>Total Amount</span>
                    <span className="total-val">₹{order.totalAmount}</span>
                  </div>
                </div>

                <div className="order-item-footer">
                  <button 
                    onClick={() => setSelectedOrder(order)} 
                    className="btn btn-secondary btn-sm"
                  >
                    View Details & Address
                  </button>

                  <div className="fulfillment-actions">
                    {order.fulfillmentStatus === 'Processing' && (
                      <button 
                        onClick={() => handleStatusChange(order.id, 'Shipped')} 
                        className="btn btn-primary btn-sm btn-action-ship"
                      >
                        <Truck size={14} /> Ship Order
                      </button>
                    )}
                    {order.fulfillmentStatus === 'Shipped' && (
                      <button 
                        onClick={() => handleStatusChange(order.id, 'Delivered')} 
                        className="btn btn-primary btn-sm btn-action-deliver"
                      >
                        <CheckCircle size={14} /> Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="modal-overlay">
            <motion.div 
              className="modal-card order-detail-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="modal-header">
                <div>
                  <h3>Order Details — {selectedOrder.id}</h3>
                  <span className="modal-subtitle">Received on {selectedOrder.date}</span>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="close-btn">
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body-scroll">
                <div className="detail-section-split">
                  {/* Shipping information */}
                  <div className="detail-shipping-card">
                    <h4>Customer Shipping Address</h4>
                    <div className="shipping-info-item">
                      <MapPin size={18} className="shipping-icon" />
                      <div>
                        <strong>{selectedOrder.customerName}</strong>
                        <p>{selectedOrder.shippingAddress}</p>
                      </div>
                    </div>
                    <div className="shipping-info-item">
                      <Mail size={18} className="shipping-icon" />
                      <p>{selectedOrder.customerEmail}</p>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="detail-payment-card">
                    <h4>Fulfillment & Payment</h4>
                    <div className="payment-row">
                      <span>Payment Status:</span>
                      <span className="badge badge-success">Paid via Online Payout</span>
                    </div>
                    <div className="payment-row">
                      <span>Fulfillment Status:</span>
                      <span className={`badge ${
                        selectedOrder.fulfillmentStatus === 'Delivered' ? 'badge-success' :
                        selectedOrder.fulfillmentStatus === 'Shipped' ? 'badge-info' : 'badge-warning'
                      }`}>
                        {selectedOrder.fulfillmentStatus}
                      </span>
                    </div>

                    <div className="payment-flow-updater">
                      {selectedOrder.fulfillmentStatus === 'Processing' && (
                        <button 
                          onClick={() => handleStatusChange(selectedOrder.id, 'Shipped')} 
                          className="btn btn-primary w-full"
                        >
                          <Truck size={16} /> Mark as Shipped
                        </button>
                      )}
                      {selectedOrder.fulfillmentStatus === 'Shipped' && (
                        <button 
                          onClick={() => handleStatusChange(selectedOrder.id, 'Delivered')} 
                          className="btn btn-primary w-full"
                        >
                          <CheckCircle size={16} /> Mark as Fully Delivered
                        </button>
                      )}
                      {selectedOrder.fulfillmentStatus === 'Delivered' && (
                        <div className="success-delivery-badge">
                          <CheckCircle size={18} /> Payout credited to your balance
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items Breakdown Table */}
                <div className="order-breakdown-container">
                  <h4>Ordered Products Breakdown</h4>
                  <table className="breakdown-table">
                    <thead>
                      <tr>
                        <th>Product Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.productName}</td>
                          <td>₹{item.price}</td>
                          <td>{item.quantity} units</td>
                          <td>₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                      <tr className="breakdown-total-row">
                        <td colSpan="3">Total Grand Amount</td>
                        <td className="grand-total">₹{selectedOrder.totalAmount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  onClick={() => setSelectedOrder(null)} 
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .orders-screen {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .orders-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .orders-header h2 {
          font-size: 1.75rem;
        }

        .orders-header p {
          color: var(--text-secondary);
        }

        .orders-controls {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          padding: 1rem 1.5rem;
        }

        .orders-tabs {
          display: flex;
          gap: 0.5rem;
          background: var(--bg-primary);
          padding: 4px;
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .order-tab-btn {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .order-tab-btn.active {
          background: var(--bg-secondary);
          color: var(--text-primary);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }

        .orders-search {
          position: relative;
          display: flex;
          align-items: center;
          min-width: 280px;
        }

        .orders-search input {
          width: 100%;
          padding: 0.6rem 1rem 0.6rem 2.5rem;
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 8px;
          outline: none;
        }

        .orders-search input:focus {
          border-color: var(--accent);
          background: var(--bg-secondary);
        }

        .orders-search .search-icon {
          position: absolute;
          left: 12px;
          color: var(--text-secondary);
        }

        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .order-item-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1rem;
        }

        .order-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
          padding-bottom: 0.75rem;
        }

        .order-badge-id {
          font-weight: 700;
          color: var(--me-navy);
          font-size: 0.95rem;
          margin-right: 0.75rem;
        }

        .order-date-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          display: inline-flex;
          align-items: center;
        }

        .order-item-body {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .order-customer-details h4 {
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .order-customer-details span {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .order-items-preview {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          background: var(--bg-primary);
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.85rem;
        }

        .preview-row {
          display: flex;
          justify-content: space-between;
        }

        .preview-qty {
          color: var(--accent);
        }

        .order-total-amount {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          border-top: 1px dashed var(--border);
          padding-top: 0.75rem;
        }

        .total-val {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          font-family: 'Montserrat', sans-serif;
        }

        .order-item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border);
          padding-top: 1rem;
        }

        .btn-sm {
          padding: 0.45rem 0.9rem;
          font-size: 0.8rem;
          border-radius: 6px;
        }

        .fulfillment-actions {
          display: flex;
          gap: 0.5rem;
        }

        .empty-orders-card {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-secondary);
        }

        /* Modal scroll settings */
        .order-detail-modal {
          max-width: 720px;
        }

        .modal-body-scroll {
          padding: 1.5rem;
          max-height: 480px;
          overflow-y: auto;
        }

        .detail-section-split {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 600px) {
          .detail-section-split {
            grid-template-columns: 1fr;
          }
        }

        .detail-shipping-card, .detail-payment-card {
          background: var(--bg-primary);
          border: 1px solid var(--border);
          padding: 1.25rem;
          border-radius: 12px;
        }

        .detail-shipping-card h4, .detail-payment-card h4 {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
        }

        .shipping-info-item {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .shipping-icon {
          color: var(--accent);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .shipping-info-item strong {
          display: block;
          font-size: 0.9rem;
        }

        .shipping-info-item p {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .payment-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
        }

        .payment-flow-updater {
          margin-top: 1rem;
        }

        .w-full {
          width: 100%;
        }

        .success-delivery-badge {
          background: var(--success-soft);
          color: var(--success);
          border: 1px solid var(--success);
          border-radius: 8px;
          padding: 0.6rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .order-breakdown-container h4 {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
        }

        .breakdown-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.85rem;
        }

        .breakdown-table th, .breakdown-table td {
          padding: 0.75rem;
          border-bottom: 1px solid var(--border);
        }

        .breakdown-table th {
          font-weight: 600;
          color: var(--text-secondary);
          background: var(--bg-primary);
        }

        .breakdown-total-row {
          font-weight: 700;
          background: var(--bg-primary);
        }

        .grand-total {
          font-size: 1rem;
          color: var(--accent);
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default OrdersScreen;
