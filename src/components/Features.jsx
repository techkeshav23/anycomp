import React from 'react';
import { Check } from 'lucide-react';

export default function Features() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Seamless Incorporation & Compliance</h2>
        <div className="grid grid-3">
          <div className="card">
            <div style={{ marginBottom: '1rem', color: '#2563eb' }}><Check size={32} /></div>
            <h3>Manage your Company</h3>
            <p style={{ marginTop: '0.5rem', color: '#475569' }}>Company Dashboard to give you an overview of your company’s key information and activities</p>
          </div>
          <div className="card">
            <div style={{ marginBottom: '1rem', color: '#2563eb' }}><Check size={32} /></div>
            <h3>Documents & Files</h3>
            <p style={{ marginTop: '0.5rem', color: '#475569' }}>Provides a secure place to store and manage important company records</p>
          </div>
          <div className="card">
            <div style={{ marginBottom: '1rem', color: '#2563eb' }}><Check size={32} /></div>
            <h3>eSignature</h3>
            <p style={{ marginTop: '0.5rem', color: '#475569' }}>Digitally sign documents requested by your Company Secretary with full legal compliance</p>
          </div>
        </div>
      </div>
    </section>
  );
}
