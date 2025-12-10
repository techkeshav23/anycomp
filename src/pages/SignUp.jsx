import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';

export default function SignUp() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <div style={{ padding: '2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#64748b', fontWeight: '500' }}>
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </div>
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#0f172a' }}>Create an account</h1>
            <p style={{ color: '#64748b' }}>Start your company incorporation journey today</p>
          </div>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>First name</label>
                <input 
                  type="text" 
                  className="search-input" 
                  style={{ padding: '0.75rem 1rem', fontSize: '1rem' }}
                  placeholder="John"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Last name</label>
                <input 
                  type="text" 
                  className="search-input" 
                  style={{ padding: '0.75rem 1rem', fontSize: '1rem' }}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Email address</label>
              <input 
                type="email" 
                className="search-input" 
                style={{ padding: '0.75rem 1rem', fontSize: '1rem' }}
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Password</label>
              <input 
                type="password" 
                className="search-input" 
                style={{ padding: '0.75rem 1rem', fontSize: '1rem' }}
                placeholder="Create a password"
              />
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>Must be at least 8 characters</p>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>Create Account</button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', color: '#64748b' }}>
            Already have an account? <Link to="/signin" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
