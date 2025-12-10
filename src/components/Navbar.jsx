import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo" style={{ 
          fontWeight: '800', 
          fontSize: '1.5rem', 
          letterSpacing: '-0.03em',
          color: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          textDecoration: 'none'
        }}>
          <div style={{ width: '24px', height: '24px', background: '#2563eb', borderRadius: '6px' }}></div>
          Anycomp
        </Link>
        <ul className="nav-links">
          <li><a href="#register">Register Company</a></li>
          <li><a href="#appoint">Find Secretary</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#how-it-works">How it Works</a></li>
        </ul>
        <div className="nav-actions">
          <Link to="/signin" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>Sign In</Link>
        </div>
      </div>
    </nav>
  );
}
