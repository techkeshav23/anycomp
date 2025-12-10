import React from 'react';
import { Check, LayoutDashboard, FileText, PenTool, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function Features() {
  return (
    <section className="section" style={{ background: '#ffffff' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }}>
          <h2 className="section-title" style={{ fontSize: '2.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>
            Everything you need to run your company
          </h2>
          <p className="section-subtitle" style={{ fontSize: '1.125rem', color: '#64748b', lineHeight: '1.6' }}>
            A complete operating system for your Malaysian business entity. We handle the paperwork so you can focus on growth.
          </p>
        </div>
        
        <div className="bento-grid">
          {/* Large Feature */}
          <div className="bento-item bento-span-2 bento-row-2" style={{ 
            background: '#f8fafc', 
            border: '1px solid #e2e8f0',
            boxShadow: 'none',
            padding: '3rem'
          }}>
            <div style={{ marginBottom: '1.5rem', color: '#2563eb', background: '#eff6ff', width: 'fit-content', padding: '1rem', borderRadius: '12px' }}>
              <LayoutDashboard size={32} />
            </div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#0f172a', fontWeight: '700' }}>Company Dashboard</h3>
            <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '2.5rem' }}>
              Get a bird's eye view of your company's compliance status. Track deadlines, view shareholder details, and manage directors all in one secure place.
            </p>
            {/* Abstract UI representation */}
            <div style={{ 
              background: 'white', 
              borderRadius: '16px', 
              padding: '2rem', 
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                <div style={{ width: '120px', height: '12px', background: '#e2e8f0', borderRadius: '6px' }}></div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <div style={{ width: '32px', height: '32px', background: '#f1f5f9', borderRadius: '50%' }}></div>
                   <div style={{ width: '32px', height: '32px', background: '#f1f5f9', borderRadius: '50%' }}></div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div style={{ height: '80px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}></div>
                <div style={{ height: '80px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}></div>
                <div style={{ height: '80px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}></div>
              </div>
            </div>
          </div>

          {/* Medium Feature */}
          <div className="bento-item" style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ marginBottom: '1rem', color: '#2563eb', background: '#eff6ff', width: 'fit-content', padding: '0.75rem', borderRadius: '10px' }}>
              <FileText size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>Digital Documents</h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>Securely store and manage all your company records in the cloud.</p>
          </div>

          {/* Medium Feature */}
          <div className="bento-item" style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ marginBottom: '1rem', color: '#2563eb', background: '#eff6ff', width: 'fit-content', padding: '0.75rem', borderRadius: '10px' }}>
              <PenTool size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>eSignature</h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>Sign resolutions and official forms digitally with full legal compliance.</p>
          </div>

          {/* Wide Feature */}
          <div className="bento-item bento-span-2" style={{ 
            background: '#0f172a', 
            color: 'white',
            display: 'flex', 
            alignItems: 'center', 
            gap: '3rem',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{ flex: 1, position: 'relative', zIndex: 2 }}>
              <div style={{ marginBottom: '1rem', color: '#60a5fa' }}><ShieldCheck size={32} /></div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem' }}>Bank-Grade Security</h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>Your data is encrypted with AES-256 bit encryption and stored in secure data centers.</p>
            </div>
            <div style={{ position: 'absolute', right: '-20px', bottom: '-40px', opacity: 0.1 }}>
               <ShieldCheck size={240} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
