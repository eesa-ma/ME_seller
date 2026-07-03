import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminCommunitiesSidebar from './AdminCommunitiesSidebar';
import { getSellerSession } from '../utils/auth';
import { ShieldCheck, UserCog } from 'lucide-react';

const AdminCommunitiesLayout = ({ children, onLogout }) => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  // Assuming seller session implies admin access for now, or we just verify any session.
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getSellerSession();
        if (!session) {
          navigate('/auth');
        } else {
          setAdmin(session);
        }
      } catch (err) {
        console.error("Admin layout session error:", err);
        navigate('/auth');
      }
    };
    fetchSession();
  }, [navigate]);

  if (!admin) {
    return (
      <div className="layout-loading">
        <div className="loading-branding">
          <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <UserCog size={40} />
          </div>
          <p>Verifying Admin Session...</p>
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
      <AdminCommunitiesSidebar onLogout={onLogout} />

      <div className="dashboard-main-content">
        {/* Top bar header */}
        <header className="dashboard-topbar">
          <div className="topbar-welcome">
            <span className="badge badge-warning" style={{ background: 'rgba(255, 154, 68, 0.1)', color: '#ff9a44', padding: '0.4rem 0.8rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: '600' }}>
              <ShieldCheck size={16} /> Community Admin
            </span>
          </div>

          <div className="topbar-actions">
            <div className="topbar-profile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>{admin.ownerName || 'Admin'}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Super Admin</div>
              </div>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {admin.ownerName ? admin.ownerName.charAt(0).toUpperCase() : 'A'}
              </div>
            </div>
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
          margin-left: var(--sidebar-width, 260px);
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

export default AdminCommunitiesLayout;
