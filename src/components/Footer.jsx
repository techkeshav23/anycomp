import React from 'react';

export default function Footer() {
  return (
    <footer className="footer" style={{ background: '#020617', paddingTop: '6rem', paddingBottom: '3rem', borderTop: '1px solid #1e293b' }}>
      <div className="container">
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4rem' }}>
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              color: 'white', 
              fontWeight: '800', 
              fontSize: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ width: '24px', height: '24px', background: '#3b82f6', borderRadius: '6px' }}></div>
              Anycomp
            </div>
            <p style={{ color: '#94a3b8', marginBottom: '2rem', maxWidth: '300px', lineHeight: '1.6' }}>
              The modern operating system for Malaysian companies. Incorporate, manage, and grow your business with confidence.
            </p>
            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
              ST Comp Holding Sdn Bhd<br/>
              Registration No. 202501000000 (123456-A)
            </div>
          </div>
          
          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Product</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Incorporation</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Company Secretary</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Compliance</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Pricing</a></li>
            </ul>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Company</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>About Us</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Careers</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Blog</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Legal</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Terms of Service</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Privacy Policy</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.9rem' }}>
          <div>© 2025 Anycomp. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Twitter</a>
            <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>LinkedIn</a>
            <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
