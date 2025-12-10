import React from 'react';

export default function TrustedBy() {
  return (
    <section style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc', padding: '3rem 0' }}>
      <div className="container">
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2rem' }}>
          Trusted by regulators and leading financial institutions
        </p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '4rem', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          opacity: 0.7,
          filter: 'grayscale(100%)'
        }}>
          {/* Placeholder Logos using text for realism simulation */}
          <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#334155', letterSpacing: '-0.02em' }}>SSM</h3>
          <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#334155', letterSpacing: '-0.02em' }}>LHDN</h3>
          <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#334155', letterSpacing: '-0.02em' }}>Maybank</h3>
          <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#334155', letterSpacing: '-0.02em' }}>CIMB</h3>
          <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#334155', letterSpacing: '-0.02em' }}>Alliance Bank</h3>
        </div>
      </div>
    </section>
  );
}
