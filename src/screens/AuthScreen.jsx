import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginSeller, registerSeller } from '../utils/auth';
import { LogIn, UserPlus, Mail, Lock, ShoppingBag, ShieldCheck } from 'lucide-react';

const AuthScreen = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [category, setCategory] = useState('Wellness');
  const [error, setError] = useState('');

  //HANDLE  SUBMIT
   const handleSubmit = async (e) => { 
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all standard credentials.');
      return;
    }

    if (isLogin) {
      try {
        const session = await loginSeller(email, password); 
        if (onLogin) onLogin();
        if (session.is_admin) {
          navigate('/admin/communities');
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error("Login Error:", err);
        setError(err.message || 'Login failed. Please check your credentials.');
      }
    } else {
      if (!shopName || !ownerName) {
        setError('Please fill in all shop and owner details.');
        return;
      }
      
      try {
        const session = await registerSeller(email, password, { shopName, ownerName, category }); // await the Supabase call
        if (onLogin) onLogin();
        if (session.is_admin) {
          navigate('/admin/communities');
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error("Registration Error:", err);
        setError(err.message || 'Registration failed.');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <motion.div 
        className="auth-card-wrapper"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, cubicBezier: [0.4, 0, 0.2, 1] }}
      >
        <div className="auth-card">
          <div className="auth-brand">
            <img src="/brand/logo.gif" alt="Mind Empowered logo" className="auth-brand-logo-gif" />
            <h2>Mind Empowered</h2>
            <p>Seller Portal Management</p>
          </div>

          <div className="auth-tabs">
            <button 
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(true); setError(''); }}
            >
              <LogIn size={16} />
              Login
            </button>
            <button 
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(false); setError(''); }}
            >
              <UserPlus size={16} />
              Register
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  id="email" 
                  className="form-input" 
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  id="password" 
                  className="form-input" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="shopName">Shop Name</label>
                  <div className="input-with-icon">
                    <ShoppingBag size={18} className="input-icon" />
                    <input 
                      type="text" 
                      id="shopName" 
                      className="form-input" 
                      placeholder="Enter your shop name" 
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="ownerName">Owner/Contact Full Name</label>
                  <div className="input-with-icon">
                    <UserPlus size={18} className="input-icon" />
                    <input 
                      type="text" 
                      id="ownerName" 
                      className="form-input" 
                      placeholder="Enter your full name" 
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="category">Primary Business Category</label>
                  <select 
                    id="category" 
                    className="form-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Wellness">Wellness & Health</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Stationery">Stationery & Planners</option>
                    <option value="Apparel">Apparel & Merchandising</option>
                    <option value="Crafts">Handmade Crafts</option>
                  </select>
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary auth-submit-btn">
              {isLogin ? 'Sign In' : 'Complete Setup & Register'}
            </button>
          </form>

        </div>
      </motion.div>

      <style>{`
        .auth-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #FAF6F1, #E8DEC9);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 2rem;
        }

        /* Floating background graphics */
        .auth-shapes .shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          z-index: 1;
        }
        
        .shape-1 {
          width: 350px;
          height: 350px;
          background: rgba(70, 23, 17, 0.08); /* Maroon */
          top: -100px;
          left: -100px;
        }

        .shape-2 {
          width: 400px;
          height: 400px;
          background: rgba(255, 118, 18, 0.08); /* Orange */
          bottom: -150px;
          right: -150px;
        }

        .auth-card-wrapper {
          width: 100%;
          max-width: 480px;
          position: relative;
          z-index: 10;
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid var(--me-cream-border);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          box-shadow: 0 10px 40px rgba(70, 23, 17, 0.06);
        }

        .auth-brand {
          text-align: center;
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .auth-brand-logo-gif {
          width: 80px;
          height: 80px;
          border-radius: 16px;
          object-fit: cover;
          border: 2px solid var(--me-orange);
          margin-bottom: 0.75rem;
          box-shadow: 0 4px 12px rgba(70, 23, 17, 0.15);
        }

        .auth-brand h2 {
          font-size: 1.6rem;
          color: var(--me-maroon);
          font-family: 'Montserrat', sans-serif;
          margin-bottom: 0.25rem;
        }

        .auth-brand p {
          color: var(--me-brown-soft);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .auth-tabs {
          display: flex;
          background: var(--me-cream);
          border: 1px solid var(--me-cream-border);
          padding: 4px;
          border-radius: 12px;
          margin-bottom: 2rem;
        }

        .auth-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--me-brown-soft);
        }

        .auth-tab.active {
          background: white;
          color: var(--me-maroon);
          box-shadow: 0 4px 12px rgba(70, 23, 17, 0.05);
        }

        .auth-error {
          background: #FEE2E2;
          border: 1px solid #FCA5A5;
          color: #B91C1C;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .auth-form {
          margin-bottom: 1.5rem;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--me-brown-soft);
        }

        .input-with-icon .form-input {
          padding-left: 2.75rem;
        }

        .auth-submit-btn {
          width: 100%;
          padding: 0.9rem;
          margin-top: 1rem;
        }

        /*
        .demo-login-box {
          border-top: 1px dashed var(--me-cream-border);
          padding-top: 1.5rem;
          margin-top: 1.5rem;
          text-align: center;
        }

        .demo-badge {
          display: inline-block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: var(--accent-soft);
          color: var(--accent);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .demo-login-box p {
          font-size: 0.8rem;
          color: var(--me-brown-soft);
          margin-bottom: 0.75rem;
        }

        .quick-login-btn {
          width: 100%;
          padding: 0.6rem;
          font-size: 0.85rem;
          border: 1px solid var(--me-cream-border);
          background: white;
        }

        .quick-login-btn:hover {
          background: var(--me-cream);
        }
        */

        @media (max-width: 480px) {
          .auth-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthScreen;
