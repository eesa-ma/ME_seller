import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Building2, 
  IndianRupee, 
  Settings, 
  LogOut, 
  Sun, 
  Moon,
  Menu,
  X,
  ShieldAlert,
  ClipboardList,
  Activity
} from 'lucide-react';
import { logoutSeller } from '../utils/auth';

const AdminCommunitiesSidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const menuItems = [
    { name: 'All NGOs/Communities', path: '/admin/communities', icon: Building2 },
    { name: 'Buyer Reports', path: '/admin/reports', icon: ClipboardList },
    { name: 'Admin Settings', path: '/admin/communities/settings', icon: Settings },
  ];

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogoutClick = async () => {
    try {
      await logoutSeller();
      if (onLogout) onLogout();
      navigate('/auth');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
      <div className="mobile-header">
        <div className="mobile-logo">
          <ShieldAlert size={20} className="text-accent" />
          <span className="logo-text">ME Admin</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-menu-btn">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">
            <div className="brand-icon" style={{
              width: '42px', height: '42px', borderRadius: '8px', 
              background: 'linear-gradient(135deg, var(--accent), #ff9a44)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
            }}>
              <ShieldAlert size={24} />
            </div>
            <div className="brand-title">
              <h3>Mind Empowered</h3>
              <span>E-commerce Admin</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/admin/communities' && location.pathname.startsWith(item.path));
              return (
                <li key={item.name}>
                  <button 
                    onClick={() => handleNav(item.path)} 
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? (
              <>
                <Moon size={18} />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun size={18} />
                <span>Light Mode</span>
              </>
            )}
          </button>
          
          <button onClick={handleLogoutClick} className="logout-btn">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <style>{`
        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: var(--bg-sidebar);
          color: var(--text-sidebar);
          padding: 0 1.5rem;
          align-items: center;
          justify-content: space-between;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .mobile-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .text-accent {
          color: var(--accent);
        }
        
        .logo-text {
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
        }
        
        .mobile-menu-btn {
          color: var(--text-sidebar);
          background: none;
          border: none;
          cursor: pointer;
        }

        .sidebar {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          width: var(--sidebar-width);
          background: var(--bg-sidebar);
          color: var(--text-sidebar);
          display: flex;
          flex-direction: column;
          z-index: 999;
          transition: transform 0.3s ease;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .sidebar-brand {
          padding: 1.5rem 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .brand-title h3 {
          font-size: 1.05rem;
          color: white;
          font-family: 'Montserrat', sans-serif;
          margin: 0;
        }
        
        .brand-title span {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          display: block;
        }
        
        .sidebar-nav {
          flex: 1;
          padding: 1.5rem 1rem;
          overflow-y: auto;
        }
        
        .nav-link {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1rem;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
          font-size: 0.95rem;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .nav-link:hover {
          background: var(--bg-sidebar-hover);
          color: white;
        }
        
        .nav-link.active {
          background: var(--accent);
          color: white;
          box-shadow: 0 4px 12px rgba(255, 118, 18, 0.2);
        }
        
        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .theme-toggle, .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .theme-toggle:hover, .logout-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }
        
        .logout-btn:hover {
          color: var(--danger);
          background: rgba(239, 68, 68, 0.1);
        }

        @media (max-width: 991px) {
          .mobile-header {
            display: flex;
          }
          
          .sidebar {
            transform: translateX(-100%);
            top: 60px;
          }
          
          .sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default AdminCommunitiesSidebar;
