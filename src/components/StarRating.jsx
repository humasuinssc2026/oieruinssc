import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ materialId, reviews }) {
  const count = reviews ? reviews.length : 0;
  const average = count > 0 
    ? reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / count 
    : 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface-color)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--surface-hover)' }}>
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star} 
            size={24} 
            color={average >= star - 0.5 ? '#f1c40f' : 'var(--text-muted)'}
            fill={average >= star - 0.5 ? '#f1c40f' : 'transparent'}
            style={{ cursor: 'default' }}
          />
        ))}
      </div>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '1.1rem' }}>{average.toFixed(1)}</span>
        <span>({count} ulasan)</span>
      </div>
    </div>
  );
}
