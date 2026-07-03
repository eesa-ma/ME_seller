import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, IndianRupee, ShoppingBag, PackageCheck, TrendingUp, TrendingDown, MoreVertical, Search, Filter } from 'lucide-react';

const mockNGOs = [
  { id: '1', name: 'Green Earth Initiative', revenue: 145000, itemsSold: 420, payoutBalance: 24000, status: 'Active', category: 'Environment', color: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
  { id: '2', name: 'Artisan Crafts Co.', revenue: 83200, itemsSold: 215, payoutBalance: 8000, status: 'Active', category: 'Handicrafts', color: 'linear-gradient(135deg, #fa709a, #fee140)' },
  { id: '3', name: 'Tech For All', revenue: 251000, itemsSold: 890, payoutBalance: 45000, status: 'Active', category: 'Education', color: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  { id: '4', name: 'Local Farmers Guild', revenue: 67200, itemsSold: 310, payoutBalance: 12000, status: 'Active', category: 'Agriculture', color: 'linear-gradient(135deg, #f83600, #f9d423)' },
  { id: '5', name: 'Women Empowerment Hub', revenue: 198000, itemsSold: 560, payoutBalance: 32000, status: 'Active', category: 'Social Cause', color: 'linear-gradient(135deg, #FF6B6B, #FF8E53)' },
  { id: '6', name: 'Vintage Books Society', revenue: 15200, itemsSold: 45, payoutBalance: 1500, status: 'Warning', category: 'Education', color: 'linear-gradient(135deg, #667eea, #764ba2)' },
];

const CommunitiesScreen = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNGOs = mockNGOs.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPlatformRevenue = mockNGOs.reduce((acc, ngo) => acc + ngo.revenue, 0);
  const totalItemsSold = mockNGOs.reduce((acc, ngo) => acc + ngo.itemsSold, 0);
  const totalPendingPayouts = mockNGOs.reduce((acc, ngo) => acc + ngo.payoutBalance, 0);

  return (
    <div className="communities-dashboard">
      <div className="header-section">
        <div>
          <h1 className="page-title">NGOs / Sellers Directory</h1>
          <p className="page-subtitle">Monitor e-commerce performance and payouts across all registered communities.</p>
        </div>
        <button className="create-btn">
          + Onboard NGO
        </button>
      </div>

      {/* Global Stats Cards */}
      <div className="stats-grid">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="stat-card"
        >
          <div className="stat-icon-wrapper" style={{ background: 'rgba(79, 172, 254, 0.15)', color: '#4facfe' }}>
            <IndianRupee size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Platform Revenue</p>
            <h3 className="stat-value">₹{totalPlatformRevenue.toLocaleString('en-IN')}</h3>
            <p className="stat-change positive">
              <TrendingUp size={14} /> +15% vs last month
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="stat-card"
        >
          <div className="stat-icon-wrapper" style={{ background: 'rgba(67, 233, 123, 0.15)', color: '#43e97b' }}>
            <PackageCheck size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Items Sold</p>
            <h3 className="stat-value">{totalItemsSold.toLocaleString('en-IN')}</h3>
            <p className="stat-change positive">
              <TrendingUp size={14} /> +8% vs last month
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="stat-card"
        >
          <div className="stat-icon-wrapper" style={{ background: 'rgba(255, 154, 68, 0.15)', color: '#FF9A44' }}>
            <Building2 size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending Payouts</p>
            <h3 className="stat-value">₹{totalPendingPayouts.toLocaleString('en-IN')}</h3>
            <p className="stat-change negative">
              <TrendingDown size={14} /> 12 Sellers awaiting
            </p>
          </div>
        </motion.div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search NGOs by shop name or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="filter-btn">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* Communities Grid */}
      <div className="communities-grid">
        {filteredNGOs.map((ngo, index) => (
          <motion.div 
            key={ngo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            className="community-card"
            onClick={() => navigate(`/admin/communities/${ngo.id}`)}
          >
            <div className="community-card-header" style={{ background: ngo.color }}>
              <div className="community-status">
                <span className={`status-dot ${ngo.status.toLowerCase()}`}></span>
                {ngo.status}
              </div>
              <button className="more-btn" onClick={(e) => e.stopPropagation()}>
                <MoreVertical size={18} />
              </button>
            </div>
            
            <div className="community-card-body">
              <div className="community-avatar">
                {ngo.name.charAt(0)}
              </div>
              <h3 className="community-name">{ngo.name}</h3>
              <p className="community-category">{ngo.category}</p>
              
              <div className="community-metrics">
                <div className="metric">
                  <span className="metric-label">Revenue</span>
                  <span className="metric-value">₹{(ngo.revenue / 1000).toFixed(1)}k</span>
                </div>
                <div className="metric divider"></div>
                <div className="metric">
                  <span className="metric-label">Items Sold</span>
                  <span className="metric-value">{ngo.itemsSold}</span>
                </div>
                <div className="metric divider"></div>
                <div className="metric">
                  <span className="metric-label">Payout Bal</span>
                  <span className="metric-value warning">₹{(ngo.payoutBalance / 1000).toFixed(1)}k</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        .communities-dashboard {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding-bottom: 2rem;
        }

        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .page-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          font-family: 'Montserrat', sans-serif;
        }

        .page-subtitle {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .create-btn {
          background: var(--accent);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(255, 118, 18, 0.3);
        }

        .create-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 118, 18, 0.4);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          box-shadow: var(--shadow-hover);
          transform: translateY(-2px);
        }

        .stat-icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
          font-family: 'Montserrat', sans-serif;
        }

        .stat-change {
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-weight: 600;
        }

        .stat-change.positive { color: #10B981; }
        .stat-change.negative { color: #EF4444; }

        /* Toolbar */
        .toolbar {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .search-bar {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-secondary);
        }

        .search-bar input {
          width: 100%;
          padding: 0.8rem 1rem 0.8rem 2.8rem;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.95rem;
          transition: border-color 0.2s ease;
        }

        .search-bar input:focus {
          outline: none;
          border-color: var(--accent);
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1.25rem;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-btn:hover {
          background: var(--bg-primary);
          border-color: var(--accent);
          color: var(--accent);
        }

        /* Communities Grid */
        .communities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .community-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: var(--shadow-sm);
        }

        .community-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
          border-color: rgba(255, 118, 18, 0.3);
        }

        .community-card-header {
          height: 100px;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
        }

        .community-status {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(4px);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-dot.active { background: #43e97b; }
        .status-dot.warning { background: #f9d423; }

        .more-btn {
          background: rgba(0,0,0,0.2);
          backdrop-filter: blur(4px);
          color: white;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .more-btn:hover {
          background: rgba(0,0,0,0.4);
        }

        .community-card-body {
          padding: 1.5rem;
          padding-top: 0;
          position: relative;
          text-align: center;
        }

        .community-avatar {
          width: 70px;
          height: 70px;
          border-radius: 16px;
          background: var(--bg-primary);
          border: 4px solid var(--bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 800;
          color: var(--accent);
          margin: -35px auto 1rem auto;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .community-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
          font-family: 'Montserrat', sans-serif;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .community-category {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .community-metrics {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid var(--border);
          padding-top: 1rem;
        }

        .metric {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .metric.divider {
          width: 1px;
          background: var(--border);
        }

        .metric-label {
          font-size: 0.7rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .metric-value {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .metric-value.warning {
          color: #FF9A44;
        }
      `}</style>
    </div>
  );
};

export default CommunitiesScreen;
