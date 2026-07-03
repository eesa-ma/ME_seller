import React from 'react';
import { ClipboardList } from 'lucide-react';

const AdminOrdersScreen = () => {
  return (
    <div className="placeholder-screen">
      <div className="placeholder-content">
        <ClipboardList size={64} className="placeholder-icon" />
        <h2>Global Orders</h2>
        <p>This module is currently under construction. Here you will monitor the fulfillment status of orders across all stores on the platform.</p>
      </div>
      <style>{`
        .placeholder-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 70vh;
        }
        .placeholder-content {
          text-align: center;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .placeholder-icon {
          color: var(--accent);
          opacity: 0.8;
          margin-bottom: 1rem;
        }
        .placeholder-content h2 {
          font-size: 1.8rem;
          color: var(--text-primary);
        }
        .placeholder-content p {
          color: var(--text-secondary);
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default AdminOrdersScreen;
