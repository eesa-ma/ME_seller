import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { getSellerSession } from '../utils/storage';
import { Bell, ShoppingBag, ShieldCheck } from 'lucide-react';

const DashboardLayout = ({ children, onLogout }) => {
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    const session = getSellerSession();
    if (!session) {
      navigate('/auth');
    } else {
      setSeller(session);
    }
  }, [navigate]);

  if (!seller) {
    return (
      <div className="layout-loading">
        <div className="loading-branding">
          <img src="/brand/logo.gif" alt="Mind Empowered Logo" className="loading-logo-gif" />
          <p>Verifying Shop Session...</p>
        </div>
        <style>{`
          .layout-loading {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-primary);
          }
          .loading-branding {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          .loading-logo-gif {
            width: 80px;
            height: 80px;
            border-radius: 16px;
            border: 2px solid var(--accent);
            box-shadow: var(--shadow-hover);
          }
          .loading-branding p {
            font-size: 0.9rem;
            color: var(--text-secondary);
            font-weight: 500;
            letter-spacing: 0.05em;
            animation: pulse 1.5s infinite ease-in-out;
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar onLogout={onLogout} />
      
      <div className="dashboard-main-content">
        {/* Top bar header */}
        <header className="dashboard-topbar">
          <div className="topbar-welcome">
            <span className="badge badge-info">
              <ShieldCheck size={14} style={{ marginRight: '4px' }} /> Verified Seller
            </span>
          </div>
          
          <div className="topbar-actions">
            <div className="topbar-stat">
              <span className="stat-label">Payout Balance</span>
              <span className="stat-value">₹{seller.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            
            <button className="topbar-icon-btn" title="Notifications">
              <Bell size={20} />
              <span className="notification-indicator"></span>
            </button>
          </div>
        </header>

        {/* Page body */}
        <main className="dashboard-page-body">
          {children}
        </main>
      </div>

      <style>{`
        .dashboard-main-content {
          flex: 1;
          margin-left: var(--sidebar-width);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-primary);
        }

        .dashboard-topbar {
          height: 70px;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border);
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .topbar-stat {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .stat-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--accent);
          font-family: 'Montserrat', sans-serif;
        }

        .topbar-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
          color: var(--text-primary);
          position: relative;
          border: 1px solid var(--border);
        }

        .topbar-icon-btn:hover {
          background: var(--border);
        }

        .notification-indicator {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          background-color: var(--me-orange);
          border-radius: 50%;
          border: 1.5px solid var(--bg-secondary);
        }

        .dashboard-page-body {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        @media (max-width: 991px) {
          .dashboard-main-content {
            margin-left: 0;
            padding-top: 60px; /* Space for mobile menu topbar */
          }
          
          .dashboard-topbar {
            padding: 0 1rem;
          }
          
          .dashboard-page-body {
            padding: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
