import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';

export default function SignIn() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <div style={{ padding: '2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#64748b', fontWeight: '500', width: 'fit-content' }}>
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </div>
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '3rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              background: '#eff6ff', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: '#2563eb'
            }}>
              <Lock size={24} />
            </div>
            <h1 style={{ fontSize: '1.875rem', marginBottom: '0.75rem', color: '#0f172a', fontWeight: '700' }}>Welcome back</h1>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>Sign in to your Anycomp account</p>
          </div>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155', fontSize: '0.95rem' }}>Email address</label>
              <input 
                type="email" 
                style={{ 
                  width: '100%',
                  padding: '0.875rem 1rem', 
                  fontSize: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                placeholder="you@company.com"
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.background = 'white';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.background = '#f8fafc';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontWeight: '500', color: '#334155', fontSize: '0.95rem' }}>Password</label>
                <a href="#" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>Forgot password?</a>
              </div>
              <input 
                type="password" 
                style={{ 
                  width: '100%',
                  padding: '0.875rem 1rem', 
                  fontSize: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                placeholder="••••••••"
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.background = 'white';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.background = '#f8fafc';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <button className="btn btn-primary" style={{ 
              width: '100%', 
              padding: '1rem', 
              fontSize: '1rem', 
              fontWeight: '600',
              marginTop: '0.5rem',
              background: '#0f172a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              Sign In
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.95rem' }}>
            Don't have an account? <Link to="/signup" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
