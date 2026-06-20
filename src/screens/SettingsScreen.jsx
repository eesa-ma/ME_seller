import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Store, 
  User, 
  Phone, 
  CreditCard,
  Building,
  Save,
  CheckCircle
} from 'lucide-react';
import { getSellerSession, updateSellerProfile } from '../utils/storage';

const SettingsScreen = () => {
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [locationUrl, setLocationUrl] = useState('');
  
  // Banking payout mock settings
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const seller = getSellerSession();
    if (seller) {
      setShopName(seller.shopName || '');
      setOwnerName(seller.ownerName || '');
      setEmail(seller.email || '');
      setPhone(seller.phone || '9876543210');
      setCategory(seller.category || 'Wellness');
      setDescription(seller.description || 'Verified seller partner of the Mind Empowered Community.');
      setLogo(seller.logo || '');
      setLocationUrl(seller.locationUrl || '');
      setBankName(seller.bankName || 'State Bank of India');
      setAccountNumber(seller.accountNumber || '•••• •••• •••• 9821');
      setIfsc(seller.ifsc || 'SBIN0008432');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(false);

    const payload = {
      shopName,
      ownerName,
      phone,
      category,
      description,
      logo,
      locationUrl,
      bankName,
      accountNumber,
      ifsc
    };

    const updated = updateSellerProfile(payload);
    if (updated) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
      // Emit a custom window event so the sidebar component knows it has to refresh session
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <div className="settings-screen">
      <div className="settings-header">
        <div>
          <h2>Shop Configuration Settings</h2>
          <p>Update your shop details, billing settings, and bank configurations.</p>
        </div>
      </div>

      {saved && (
        <motion.div 
          className="settings-save-success"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CheckCircle size={18} />
          <span>Success! Shop settings successfully saved. Changes applied.</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="settings-form-layout">
        {/* Profile Card */}
        <div className="card settings-card">
          <div className="settings-card-header">
            <Store size={20} className="header-icon" />
            <h3>Shop Profile & Description</h3>
          </div>

          <div className="form-group">
            <label htmlFor="shop-name">Shop Name</label>
            <input 
              type="text" 
              id="shop-name" 
              className="form-input" 
              value={shopName} 
              onChange={(e) => setShopName(e.target.value)}
              required
            />
          </div>

          <div className="form-double-col">
            <div className="form-group">
              <label htmlFor="shop-cat">Primary Category</label>
              <select 
                id="shop-cat" 
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

            <div className="form-group">
              <label htmlFor="shop-email">Registered Email (Read-Only)</label>
              <input 
                type="email" 
                id="shop-email" 
                className="form-input form-disabled" 
                value={email} 
                disabled
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="shop-desc">Public Shop Description</label>
            <textarea 
              id="shop-desc" 
              className="form-input textarea-field" 
              rows="3" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="form-double-col">
            <div className="form-group">
              <label htmlFor="shop-logo">Shop Logo Image URL</label>
              <input 
                type="url" 
                id="shop-logo" 
                className="form-input" 
                placeholder="e.g. https://images.unsplash.com/photo-..." 
                value={logo} 
                onChange={(e) => setLogo(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="shop-location">Physical Shop Location URL (Optional)</label>
              <input 
                type="url" 
                id="shop-location" 
                className="form-input" 
                placeholder="e.g. https://maps.google.com/..." 
                value={locationUrl} 
                onChange={(e) => setLocationUrl(e.target.value)}
              />
            </div>
          </div>

          {logo && (
            <div className="logo-preview-container">
              <span>Logo Preview:</span>
              <img src={logo} alt="Shop Logo Preview" className="settings-logo-preview" />
            </div>
          )}
        </div>

        {/* Contact & Security */}
        <div className="card settings-card">
          <div className="settings-card-header">
            <User size={20} className="header-icon" />
            <h3>Contact Person & Ownership</h3>
          </div>

          <div className="form-double-col">
            <div className="form-group">
              <label htmlFor="owner-name">Owner Full Name</label>
              <input 
                type="text" 
                id="owner-name" 
                className="form-input" 
                value={ownerName} 
                onChange={(e) => setOwnerName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="owner-phone">Contact Number</label>
              <input 
                type="tel" 
                id="owner-phone" 
                className="form-input" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Payout Banking configuration */}
        <div className="card settings-card">
          <div className="settings-card-header">
            <CreditCard size={20} className="header-icon" />
            <h3>Payout Bank Settings</h3>
          </div>
          <p className="card-sub-info">Configure your bank details so completed orders can automatically pay out.</p>

          <div className="form-group">
            <label htmlFor="bank-name">Bank Institution Name</label>
            <input 
              type="text" 
              id="bank-name" 
              className="form-input" 
              placeholder="e.g. State Bank of India" 
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              required
            />
          </div>

          <div className="form-double-col">
            <div className="form-group">
              <label htmlFor="bank-account">Account Number</label>
              <input 
                type="text" 
                id="bank-account" 
                className="form-input" 
                placeholder="e.g. 501002349821" 
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bank-ifsc">IFSC Bank Code</label>
              <input 
                type="text" 
                id="bank-ifsc" 
                className="form-input" 
                placeholder="e.g. SBIN0008432" 
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="settings-actions-footer">
          <button type="submit" className="btn btn-primary btn-save">
            <Save size={18} />
            <span>Save Shop Changes</span>
          </button>
        </div>
      </form>

      <style>{`
        .settings-screen {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .settings-header {
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .settings-header h2 {
          font-size: 1.75rem;
        }

        .settings-header p {
          color: var(--text-secondary);
        }

        .settings-save-success {
          background: var(--success-soft);
          color: var(--success);
          border: 1px solid var(--success);
          padding: 0.85rem 1.25rem;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .settings-form-layout {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .settings-card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 0.75rem;
        }

        .settings-card-header h3 {
          font-size: 1.1rem;
          color: var(--text-primary);
        }

        .header-icon {
          color: var(--accent);
        }

        .form-double-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 600px) {
          .form-double-col {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }

        .textarea-field {
          resize: vertical;
          min-height: 80px;
        }

        .form-disabled {
          background-color: var(--border);
          color: var(--text-secondary);
          cursor: not-allowed;
        }

        .card-sub-info {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
          margin-top: -0.75rem;
        }

        .settings-actions-footer {
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid var(--border);
          padding-top: 1.5rem;
          margin-top: 1rem;
        }

        .btn-save {
          min-width: 200px;
          padding: 0.9rem;
        }

        .logo-preview-container {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 1rem;
          background: var(--bg-primary);
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .logo-preview-container span {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .settings-logo-preview {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--accent);
        }
      `}</style>
    </div>
  );
};

export default SettingsScreen;
