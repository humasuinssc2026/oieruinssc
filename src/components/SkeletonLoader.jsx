import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderSkeletons = () => {
    return Array.from({ length: count }).map((_, index) => {
      if (type === 'card') {
        return (
          <div key={index} style={{ 
            display: 'flex', flexDirection: 'column', gap: '10px', 
            background: 'var(--bg-secondary)', padding: '15px', borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <div className="skeleton" style={{ width: '100%', height: '180px', borderRadius: '8px' }}></div>
            <div className="skeleton" style={{ width: '80%', height: '20px', borderRadius: '4px' }}></div>
            <div className="skeleton" style={{ width: '60%', height: '15px', borderRadius: '4px' }}></div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <div className="skeleton" style={{ width: '30px', height: '30px', borderRadius: '50%' }}></div>
              <div className="skeleton" style={{ width: '40%', height: '15px', borderRadius: '4px', alignSelf: 'center' }}></div>
            </div>
          </div>
        );
      }
      
      // Default to a simple line skeleton
      return <div key={index} className="skeleton" style={{ width: '100%', height: '20px', borderRadius: '4px', marginBottom: '10px' }}></div>;
    });
  };

  return (
    <div style={{ 
      display: type === 'card' ? 'grid' : 'block',
      gridTemplateColumns: type === 'card' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr',
      gap: '20px',
      width: '100%'
    }}>
      {renderSkeletons()}
    </div>
  );
};

export default SkeletonLoader;
