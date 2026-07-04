import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Activity, 
  ClipboardList, 
  IndianRupee, 
  CreditCard,
  TrendingUp,
  ChevronRight
} from 'lucide-react';

const AdminAnalyticsHubScreen = () => {
  const navigate = useNavigate();

  const analyticsCards = [
    {
      id: 'orders',
      title: 'Platform Orders',
      description: 'Monitor and review all purchase orders across every registered NGO.',
      icon: <ClipboardList size={28} />,
      color: 'accent',
      path: '/admin/communities/orders'
    },
    {
      id: 'revenue',
      title: 'Revenue Analytics',
      description: 'Track overall platform GMV, commissions, and revenue growth.',
      icon: <TrendingUp size={28} />,
      color: 'success',
      path: '/admin/communities/revenue'
    },
    {
      id: 'payouts',
      title: 'NGO Payouts',
      description: 'Manage and review pending and completed payouts to sellers.',
      icon: <IndianRupee size={28} />,
      color: 'warning',
      path: '/admin/communities/payouts'
    },
    {
      id: 'transactions',
      title: 'Platform Transactions',
      description: 'View all financial transactions, refunds, and adjustments.',
      icon: <CreditCard size={28} />,
      color: 'info',
      path: '/admin/communities/transactions'
    }
  ];

  return (
    <div className="analytics-hub-screen">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="page-header">
        <div className="page-header-icon"><Activity size={22} /></div>
        <div style={{ flex: 1 }}>
          <h2 className="page-title">Platform Analytics</h2>
          <p className="page-subtitle">
            Centralized insights and financial reports across the entire marketplace.
          </p>
        </div>
      </div>

      {/* ── Hub Grid ───────────────────────────────────────────────────────── */}
      <div className="hub-grid">
        {analyticsCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`hub-card card-${card.color}`}
            onClick={() => navigate(card.path)}
          >
            <div className={`card-icon-wrapper text-${card.color}`}>
              {card.icon}
            </div>
            <div className="card-content">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
            <div className={`card-action text-${card.color}`}>
              <ChevronRight size={20} />
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        .analytics-hub-screen {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding-bottom: 3rem;
        }

        /* ── Header ──────────────────────────────── */
        .page-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .page-header-icon {
          width: 48px; height: 48px;
          border-radius: 12px;
          background: rgba(139, 92, 246, 0.12);
          color: #8B5CF6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .page-title {
          font-size: 1.7rem;
          font-weight: 800;
          font-family: 'Montserrat', sans-serif;
          margin: 0 0 0.2rem 0;
          background: linear-gradient(135deg, var(--me-maroon), var(--me-orange));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .page-subtitle {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin: 0;
        }

        /* ── Grid ────────────────────────────────── */
        .hub-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .hub-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 1.75rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow);
        }

        .hub-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: transparent;
          transition: background 0.3s ease;
        }

        .hub-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
          border-color: rgba(255,255,255,0.1);
        }

        /* Colors */
        .card-accent:hover::before { background: var(--accent); }
        .card-success:hover::before { background: var(--success); }
        .card-warning:hover::before { background: var(--warning); }
        .card-info:hover::before { background: #3B82F6; }

        .text-accent { color: var(--accent); }
        .text-success { color: var(--success); }
        .text-warning { color: var(--warning); }
        .text-info { color: #3B82F6; }

        .card-icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.02);
          border: 1px solid rgba(0,0,0,0.05);
          flex-shrink: 0;
        }

        [data-theme="dark"] .card-icon-wrapper {
          background: rgba(255,255,255,0.03);
          border-color: rgba(255,255,255,0.05);
        }

        .card-accent .card-icon-wrapper { background: var(--accent-soft); }
        .card-success .card-icon-wrapper { background: var(--success-soft); }
        .card-warning .card-icon-wrapper { background: var(--warning-soft); }
        .card-info .card-icon-wrapper { background: rgba(59,130,246,0.12); }

        .card-content {
          flex: 1;
        }

        .card-content h3 {
          font-family: 'Montserrat', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0 0 0.4rem 0;
          color: var(--text-primary);
        }

        .card-content p {
          margin: 0;
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .card-action {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.03);
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
        }

        [data-theme="dark"] .card-action {
          background: rgba(255,255,255,0.05);
        }

        .hub-card:hover .card-action {
          opacity: 1;
          transform: translateX(0);
          background: var(--bg-primary);
        }

      `}</style>
    </div>
  );
};

export default AdminAnalyticsHubScreen;
