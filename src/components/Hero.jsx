import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <h1>Incorporate Your Company, Appoint a Secretary & Manage Everything in One Platform</h1>
        <p>Find and Appoint any Company Secretary to register your company with SSM.</p>
        
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search for any services..." 
            className="search-input"
          />
          <Search style={{ position: 'absolute', left: '1.25rem', top: '1.25rem', color: '#94a3b8' }} />
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/signup" className="btn btn-primary">
            Register your Company <ArrowRight size={18} />
          </Link>
          <a href="#appoint" className="btn btn-outline">Appoint a Company Secretary</a>
        </div>
      </div>
    </section>
  );
}
