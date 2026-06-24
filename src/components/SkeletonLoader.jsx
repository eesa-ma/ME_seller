import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const skeletons = Array(count).fill(0);

  return (
    <>
      {skeletons.map((_, index) => {
        if (type === 'table-row') {
          return (
            <tr key={index}>
              <td><div className="skeleton skeleton-text" style={{ width: '80%', height: '48px' }}></div></td>
              <td><div className="skeleton skeleton-text" style={{ width: '60%' }}></div></td>
              <td><div className="skeleton skeleton-text" style={{ width: '40%' }}></div></td>
              <td><div className="skeleton skeleton-text" style={{ width: '50%' }}></div></td>
              <td><div className="skeleton skeleton-text" style={{ width: '30%' }}></div></td>
              <td><div className="skeleton skeleton-text" style={{ width: '50%' }}></div></td>
              <td><div className="skeleton skeleton-text" style={{ width: '40%' }}></div></td>
            </tr>
          );
        }

        if (type === 'settings-form') {
          return (
            <div key={index} style={{ padding: '1rem' }}>
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div className="skeleton skeleton-text" style={{ height: '40px' }}></div>
                <div className="skeleton skeleton-text" style={{ height: '40px' }}></div>
              </div>
            </div>
          );
        }

        // Default to card
        return (
          <div key={index} className="skeleton skeleton-card"></div>
        );
      })}
    </>
  );
};

export default SkeletonLoader;
