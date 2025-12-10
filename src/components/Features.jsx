import React from 'react';
import { Check, LayoutDashboard, FileText, PenTool, ShieldCheck } from 'lucide-react';

export default function Features() {
  return (
    <section className="section" style={{ background: '#f8fafc' }}>
      <div className="container">
        <h2 className="section-title">Everything you need to run your company</h2>
        <p className="section-subtitle">A complete operating system for your Malaysian business entity.</p>
        
        <div className="bento-grid">
          {/* Large Feature */}
          <div className="bento-item bento-span-2 bento-row-2" style={{ background: 'linear-gradient(135deg, #fff 0%, #f1f5f9 100%)' }}>
            <div style={{ marginBottom: '1.5rem', color: '#2563eb', background: '#dbeafe', width: 'fit-content', padding: '0.75rem', borderRadius: '12px' }}>
              <LayoutDashboard size={32} />
            </div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Company Dashboard</h3>
            <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '2rem' }}>
              Get a bird's eye view of your company's compliance status. Track deadlines, view shareholder details, and manage directors all in one secure place.
            </p>
            {/* Abstract UI representation */}
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '1.5rem', 
              boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ width: '40%', height: '10px', background: '#e2e8f0', borderRadius: '4px' }}></div>
                <div style={{ width: '20%', height: '10px', background: '#dbeafe', borderRadius: '4px' }}></div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, height: '60px', background: '#f8fafc', borderRadius: '8px' }}></div>
                <div style={{ flex: 1, height: '60px', background: '#f8fafc', borderRadius: '8px' }}></div>
              </div>
            </div>
          </div>

          {/* Medium Feature */}
          <div className="bento-item">
            <div style={{ marginBottom: '1rem', color: '#2563eb' }}><FileText size={28} /></div>
            <h3>Digital Documents</h3>
            <p style={{ marginTop: '0.5rem', color: '#64748b' }}>Securely store and manage all your company records in the cloud.</p>
          </div>

          {/* Medium Feature */}
          <div className="bento-item">
            <div style={{ marginBottom: '1rem', color: '#2563eb' }}><PenTool size={28} /></div>
            <h3>eSignature</h3>
            <p style={{ marginTop: '0.5rem', color: '#64748b' }}>Sign resolutions and official forms digitally with full legal compliance.</p>
          </div>

          {/* Wide Feature */}
          <div className="bento-item bento-span-2" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '1rem', color: '#2563eb' }}><ShieldCheck size={28} /></div>
              <h3>Bank-Grade Security</h3>
              <p style={{ marginTop: '0.5rem', color: '#64748b' }}>Your data is encrypted with AES-256 bit encryption and stored in secure data centers.</p>
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
               <ShieldCheck size={120} color="#e2e8f0" strokeWidth={1} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
