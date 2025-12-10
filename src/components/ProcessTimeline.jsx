import React from 'react';
import { CreditCard, FileText, Clock, LayoutDashboard } from 'lucide-react';

const steps = [
  {
    icon: <CreditCard size={24} />,
    title: "Secure Payment",
    description: "Choose your preferred company secretary and proceed to secure checkout via FPX or Credit Card."
  },
  {
    icon: <FileText size={24} />,
    title: "Digital Incorporation",
    description: "Your secretary initiates the SSM registration process. Submit all documents digitally through our secure portal."
  },
  {
    icon: <Clock size={24} />,
    title: "3-5 Business Days",
    description: "Sit back while we handle the bureaucracy. Your company registration is typically approved within a standard business week."
  },
  {
    icon: <LayoutDashboard size={24} />,
    title: "Manage & Grow",
    description: "Access your digital company dashboard to manage compliance, banking, and governance from anywhere."
  }
];

export default function ProcessTimeline() {
  return (
    <section className="section" style={{ background: 'white', padding: '8rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 5rem auto' }}>
          <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#0f172a', fontWeight: '700' }}>
            How It Works
          </h2>
          <p className="section-subtitle" style={{ fontSize: '1.125rem', color: '#64748b', lineHeight: '1.6' }}>
            From payment to operation in four simple steps. We've streamlined the entire incorporation process.
          </p>
        </div>

        <div style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto' }}>
          <div className="grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '3rem',
            position: 'relative',
            zIndex: 1
          }}>
            {steps.map((step, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  background: '#eff6ff', 
                  color: '#2563eb', 
                  borderRadius: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  position: 'relative',
                  zIndex: 2
                }}>
                  {step.icon}
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '24px',
                    height: '24px',
                    background: '#0f172a',
                    color: 'white',
                    borderRadius: '50%',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid white'
                  }}>
                    {index + 1}
                  </div>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>{step.title}</h3>
                <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '1rem' }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
