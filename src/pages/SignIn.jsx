import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function SignIn() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <div style={{ padding: '2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#64748b', fontWeight: '500' }}>
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </div>
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#0f172a' }}>Welcome back</h1>
            <p style={{ color: '#64748b' }}>Sign in to your Anycomp account</p>
          </div>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontWeight: '500', color: '#334155' }}>Password</label>
                <a href="#" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.9rem' }}>Forgot password?</a>
              </div>
              <input 
                type="password" 
                className="search-input" 
                style={{ padding: '0.75rem 1rem', fontSize: '1rem' }}
                placeholder="••••••••"
              />
            </div>

            <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>Sign In</button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', color: '#64748b' }}>
            Don't have an account? <Link to="/signup" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
