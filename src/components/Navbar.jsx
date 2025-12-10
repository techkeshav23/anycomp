import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="navbar" style={{ 
      position: 'fixed', 
      width: '100%', 
      top: 0, 
      zIndex: 100,
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      padding: '0.75rem 0'
    }}>
      <div className="container nav-content" style={{ maxWidth: '1400px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <Link to="/" className="logo" style={{ 
            fontWeight: '800', 
            fontSize: '1.5rem', 
            letterSpacing: '-0.03em',
            color: '#0f172a',
            textDecoration: 'none',
            fontFamily: 'sans-serif'
          }}>
            ANYCOMP
          </Link>
          <ul className="nav-links" style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }}>
            <li><Link to="/register-company" style={{ fontSize: '0.9rem', fontWeight: '500', color: '#334155', textDecoration: 'none' }}>Register a company</Link></li>
            <li><a href="#appoint" style={{ fontSize: '0.9rem', fontWeight: '500', color: '#334155', textDecoration: 'none' }}>Appoint a Company Secretary</a></li>
            <li><a href="#services" style={{ fontSize: '0.9rem', fontWeight: '500', color: '#334155', textDecoration: 'none' }}>Company Secretarial Services</a></li>
            <li><a href="#how-it-works" style={{ fontSize: '0.9rem', fontWeight: '500', color: '#334155', textDecoration: 'none' }}>How Anycomp Works</a></li>
          </ul>
        </div>

        <div className="nav-actions" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search for any services" 
              style={{ 
                padding: '0.6rem 1rem', 
                paddingRight: '2.5rem',
                borderRadius: '4px', 
                border: '1px solid #e2e8f0', 
                background: '#f8fafc',
                fontSize: '0.9rem',
                width: '240px'
              }} 
            />
            <button style={{ 
              position: 'absolute', 
              right: '0', 
              top: '0', 
              height: '100%', 
              width: '36px', 
              background: '#0f172a', 
              border: 'none', 
              borderTopRightRadius: '4px',
              borderBottomRightRadius: '4px',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <Search size={16} color="white" />
            </button>
          </div>
          
          <Link to="/signin" style={{ 
            textDecoration: 'none', 
            color: '#0f172a', 
            fontWeight: '600', 
            fontSize: '0.95rem' 
          }}>Login</Link>
          <Link to="/signup" className="btn btn-primary" style={{ 
            padding: '0.6rem 1.5rem', 
            fontSize: '0.95rem',
            background: '#0f172a',
            color: 'white',
            borderRadius: '4px',
            fontWeight: '600',
            textDecoration: 'none'
          }}>Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}
