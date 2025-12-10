import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3>Anycomp</h3>
            <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>ST Comp Holding Sdn Bhd</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#">Terms of Service</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
          
          <div>
            <h3>Register your company</h3>
            <ul>
              <li><a href="#">Register Company</a></li>
              <li><a href="#">Appoint a Company Secretary</a></li>
              <li><a href="#">How Anycomp Works</a></li>
              <li><a href="#">Sign up</a></li>
            </ul>
          </div>

          <div>
            <h3>Company Secretary</h3>
            <ul>
              <li><a href="#">Partner with Anycomp</a></li>
              <li><a href="#">Payment Terms</a></li>
            </ul>
          </div>

          <div>
            <h3>Follow us</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#">LinkedIn</a>
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #334155', textAlign: 'center', color: '#94a3b8' }}>
          © 2024 Anycomp. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
