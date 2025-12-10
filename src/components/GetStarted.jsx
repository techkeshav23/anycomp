import React from 'react';
import { Link } from 'react-router-dom';

export default function GetStarted() {
  return (
    <section className="section" style={{ background: '#f8fafc' }}>
      <div className="container">
        <h2 className="section-title">Get started with Anycomp</h2>
        <div className="grid grid-2">
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>Register a New Company</h3>
            <p style={{ margin: '1rem 0 2rem', color: '#475569' }}>Launch Your Company with Certified and Trusted Company Secretaries</p>
            <Link to="/signup" className="btn btn-primary">Register Now</Link>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>Appoint Your Company Secretary</h3>
            <p style={{ margin: '1rem 0 2rem', color: '#475569' }}>Start Your Company Incorporation by Choosing a Certified Company Secretary</p>
            <a href="#appoint" className="btn btn-outline">Find Secretary</a>
          </div>
        </div>
      </div>
    </section>
  );
}
