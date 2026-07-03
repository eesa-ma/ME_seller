import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, IndianRupee, PackageCheck, AlertTriangle, Store, Settings, AlertCircle, 
  TrendingUp, Clock, Package, ShoppingCart, Filter, Search, MoreVertical 
} from 'lucide-react';

const mockNGOs = {
  '1': { name: 'Green Earth Initiative', revenue: 145000, itemsSold: 420, payoutBalance: 24000, pendingOrders: 15, lowStock: 3, status: 'Active', category: 'Environment', color: 'linear-gradient(135deg, #43e97b, #38f9d7)', owner: 'John Doe', joinDate: 'Jan 2024' },
  '2': { name: 'Artisan Crafts Co.', revenue: 83200, itemsSold: 215, payoutBalance: 8000, pendingOrders: 5, lowStock: 1, status: 'Active', category: 'Handicrafts', color: 'linear-gradient(135deg, #fa709a, #fee140)', owner: 'Jane Smith', joinDate: 'Mar 2024' },
};

const mockProducts = [
  { id: 'P01', name: 'Organic Cotton Tote', price: 450, stock: 45, status: 'In Stock', sales: 120 },
  { id: 'P02', name: 'Bamboo Toothbrush Set', price: 299, stock: 12, status: 'Low Stock', sales: 340 },
  { id: 'P03', name: 'Recycled Paper Notebook', price: 150, stock: 0, status: 'Out of Stock', sales: 89 },
  { id: 'P04', name: 'Reusable Coffee Cup', price: 599, stock: 65, status: 'In Stock', sales: 45 },
];

const mockOrders = [
  { id: '#ORD-8821', date: '2024-06-15', customer: 'Rahul Sharma', total: 1350, status: 'Pending', items: 3 },
  { id: '#ORD-8822', date: '2024-06-14', customer: 'Priya Patel', total: 450, status: 'Shipped', items: 1 },
  { id: '#ORD-8823', date: '2024-06-14', customer: 'Amit Kumar', total: 898, status: 'Delivered', items: 2 },
  { id: '#ORD-8824', date: '2024-06-13', customer: 'Neha Singh', total: 2500, status: 'Delivered', items: 5 },
];

const CommunityDetailsScreen = () => {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // overview, products, orders
  
  const ngo = mockNGOs[communityId] || mockNGOs['1']; // Fallback for mock purposes

  if (!ngo) {
    return (
      <div className="not-found">
        <AlertCircle size={48} className="error-icon" />
        <h2>NGO Not Found</h2>
        <button onClick={() => navigate('/admin/communities')} className="back-btn">
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="community-details">
      {/* Header Profile Section */}
      <div className="details-header">
        <button className="back-nav-btn" onClick={() => navigate('/admin/communities')}>
          <ArrowLeft size={18} /> Back to NGOs
        </button>
        
        <div className="banner" style={{ background: ngo.color }}>
          <div className="banner-actions">
            <button className="action-btn"><Settings size={16} /> Manage Shop</button>
          </div>
        </div>
        
        <div className="profile-info-section">
          <div className="profile-avatar-large">
            {ngo.name.charAt(0)}
          </div>
          <div className="profile-text">
            <div className="title-row">
              <h1 className="community-title">{ngo.name}</h1>
              <span className={`status-badge ${ngo.status.toLowerCase()}`}>{ngo.status}</span>
            </div>
            <p className="community-category">
              <Store size={14} style={{ display: 'inline', marginRight: '4px' }} /> 
              {ngo.category} • Operated by {ngo.owner} • Joined {ngo.joinDate}
            </p>
          </div>
        </div>

        <div className="tabs-container">
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            Overview
          </button>
          <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <Package size={16} /> Products ({mockProducts.length})
          </button>
          <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <ShoppingCart size={16} /> Orders ({mockOrders.length})
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {/* Analytics Overview */}
            <div className="analytics-grid">
              <div className="analytic-card">
                <div className="analytic-icon color-accent"><IndianRupee size={24} /></div>
                <div>
                  <p className="analytic-label">Total Revenue Generated</p>
                  <h4 className="analytic-value">₹{ngo.revenue.toLocaleString('en-IN')}</h4>
                  <span className="analytic-trend positive"><TrendingUp size={12}/> +12% this month</span>
                </div>
              </div>
              
              <div className="analytic-card">
                <div className="analytic-icon color-success"><PackageCheck size={24} /></div>
                <div>
                  <p className="analytic-label">Items Successfully Sold</p>
                  <h4 className="analytic-value">{ngo.itemsSold.toLocaleString('en-IN')}</h4>
                  <span className="analytic-trend positive"><TrendingUp size={12}/> +5% this month</span>
                </div>
              </div>

              <div className="analytic-card">
                <div className="analytic-icon color-warning"><Clock size={24} /></div>
                <div>
                  <p className="analytic-label">Pending Fulfillment</p>
                  <h4 className="analytic-value">{ngo.pendingOrders}</h4>
                  <span className="analytic-trend warning">Orders waiting to ship</span>
                </div>
              </div>
            </div>

            <div className="dashboard-visuals-grid">
              <div className="card chart-card">
                <div className="chart-header">
                  <div>
                    <h3>Monthly Sales Revenue</h3>
                    <p>Store performance over last 6 months</p>
                  </div>
                </div>
                <div className="revenue-chart-container">
                  <div className="bar-chart-visual">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, idx) => {
                      const barHeight = 40 + (Math.random() * 50); // mock height
                      return (
                        <div key={month} className="chart-column">
                          <div className="chart-column-bar-wrapper">
                            <div className="chart-column-bar" style={{ height: `${barHeight}%` }}></div>
                          </div>
                          <span className="chart-column-label">{month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="card payout-card">
                <div className="card-header">
                  <h3>Financial Overview</h3>
                </div>
                <div className="payout-details">
                  <div className="payout-balance-box">
                    <span>Current Payout Balance</span>
                    <h2>₹{ngo.payoutBalance.toLocaleString('en-IN')}</h2>
                  </div>
                  <div className="payout-history">
                    <h4>Recent Payouts</h4>
                    <div className="history-item">
                      <div className="history-info">
                        <span className="history-date">Jun 15, 2024</span>
                        <span className="history-status success">Completed</span>
                      </div>
                      <span className="history-amount">₹45,000</span>
                    </div>
                  </div>
                  <button className="btn-full-width">Process Payout</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'products' && (
          <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="table-card">
            <div className="table-toolbar">
              <h3>Community Products</h3>
              <div className="search-box">
                <Search size={16} />
                <input type="text" placeholder="Search products..." />
              </div>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Stock Level</th>
                    <th>Total Sales</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockProducts.map(product => (
                    <tr key={product.id}>
                      <td className="font-medium">{product.name}</td>
                      <td>₹{product.price}</td>
                      <td>
                        <span className={`status-badge ${product.stock > 10 ? 'active' : product.stock > 0 ? 'warning' : 'danger'}`}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td>{product.sales} units</td>
                      <td>
                        <button className="icon-btn"><MoreVertical size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="table-card">
            <div className="table-toolbar">
              <h3>Community Orders</h3>
              <div className="search-box">
                <Search size={16} />
                <input type="text" placeholder="Search orders..." />
              </div>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map(order => (
                    <tr key={order.id}>
                      <td className="font-medium color-accent">{order.id}</td>
                      <td>{order.date}</td>
                      <td>{order.customer}</td>
                      <td>{order.items} items</td>
                      <td>₹{order.total}</td>
                      <td>
                        <span className={`status-badge ${order.status === 'Delivered' ? 'active' : order.status === 'Shipped' ? 'info' : 'warning'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .community-details {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding-bottom: 2rem;
        }

        .back-nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 1rem;
          transition: color 0.2s;
        }

        .back-nav-btn:hover {
          color: var(--accent);
        }

        .details-header {
          background: var(--bg-secondary);
          border-radius: 16px;
          border: 1px solid var(--border);
          overflow: hidden;
        }

        .banner {
          height: 140px;
          position: relative;
        }

        .banner-actions {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: rgba(0,0,0,0.5);
        }

        .profile-info-section {
          padding: 0 2rem 1.5rem 2rem;
          position: relative;
          display: flex;
          gap: 1.5rem;
        }

        .profile-avatar-large {
          width: 100px;
          height: 100px;
          border-radius: 20px;
          background: var(--bg-primary);
          border: 4px solid var(--bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          font-weight: 800;
          color: var(--accent);
          margin-top: -40px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }

        .profile-text {
          flex: 1;
          padding-top: 1rem;
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.25rem;
        }

        .community-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-primary);
          font-family: 'Montserrat', sans-serif;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-badge.active { background: rgba(67, 233, 123, 0.1); color: #43e97b; }
        .status-badge.warning { background: rgba(249, 212, 35, 0.1); color: #f9d423; }
        .status-badge.danger { background: rgba(239, 68, 68, 0.1); color: #EF4444; }
        .status-badge.info { background: rgba(79, 172, 254, 0.1); color: #4facfe; }

        .community-category {
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.9rem;
        }

        .tabs-container {
          display: flex;
          gap: 2rem;
          padding: 0 2rem;
          border-top: 1px solid var(--border);
        }

        .tab-btn {
          background: none;
          border: none;
          padding: 1rem 0;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: color 0.2s;
        }

        .tab-btn:hover {
          color: var(--text-primary);
        }

        .tab-btn.active {
          color: var(--accent);
        }

        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--accent);
          border-radius: 3px 3px 0 0;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .analytic-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .analytic-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .color-accent { background: var(--accent-soft); color: var(--accent); }
        .color-success { background: var(--success-soft); color: var(--success); }
        .color-warning { background: var(--warning-soft); color: var(--warning); }
        .color-danger { background: var(--danger-soft); color: var(--danger); }

        .analytic-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .analytic-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
          font-family: 'Montserrat', sans-serif;
        }

        .analytic-trend {
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }
        .analytic-trend.positive { color: #10B981; }
        .analytic-trend.negative { color: #EF4444; }
        .analytic-trend.warning { color: #F59E0B; }

        .dashboard-visuals-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        @media (max-width: 1024px) {
          .dashboard-visuals-grid {
            grid-template-columns: 1fr;
          }
        }

        .card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.5rem;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .chart-header h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .chart-header p {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .revenue-chart-container {
          height: 250px;
          position: relative;
          padding-top: 1rem;
        }

        .bar-chart-visual {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 100%;
          border-bottom: 1px solid var(--border);
          padding-bottom: 0.5rem;
        }

        .chart-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          gap: 0.5rem;
        }

        .chart-column-bar-wrapper {
          flex: 1;
          width: 50%;
          max-width: 40px;
          display: flex;
          align-items: flex-end;
        }

        .chart-column-bar {
          width: 100%;
          background: linear-gradient(to top, var(--me-maroon), var(--me-orange));
          border-radius: 6px 6px 0 0;
        }

        .chart-column-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .payout-card {
          display: flex;
          flex-direction: column;
        }

        .payout-card .card-header h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
        }

        .payout-details {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          flex: 1;
        }

        .payout-balance-box {
          background: var(--bg-primary);
          border: 1px solid var(--accent);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
        }

        .payout-balance-box span {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .payout-balance-box h2 {
          font-size: 2rem;
          font-family: 'Montserrat', sans-serif;
          color: var(--text-primary);
          margin-top: 0.5rem;
        }

        .payout-history h4 {
          font-size: 0.9rem;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border);
        }

        .history-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .history-date {
          font-size: 0.85rem;
          color: var(--text-primary);
          font-weight: 500;
        }

        .history-status {
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .history-status.success { color: #10B981; }

        .history-amount {
          font-weight: 700;
          color: var(--text-primary);
        }

        .btn-full-width {
          width: 100%;
          padding: 0.8rem;
          background: var(--accent);
          border: none;
          color: white;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: auto;
        }

        .btn-full-width:hover {
          background: var(--accent-hover);
        }

        /* Tables */
        .table-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
        }

        .table-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .table-toolbar h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg-primary);
          border: 1px solid var(--border);
          padding: 0.5rem 1rem;
          border-radius: 8px;
        }

        .search-box input {
          background: none;
          border: none;
          color: var(--text-primary);
          outline: none;
          font-size: 0.9rem;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th, .data-table td {
          padding: 1rem 1.5rem;
          text-align: left;
          border-bottom: 1px solid var(--border);
        }

        .data-table th {
          font-size: 0.8rem;
          text-transform: uppercase;
          color: var(--text-secondary);
          font-weight: 600;
          background: rgba(0,0,0,0.02);
        }

        .data-table td {
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .font-medium {
          font-weight: 600;
        }

        .icon-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
        }
        
        .icon-btn:hover {
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
};

export default CommunityDetailsScreen;
