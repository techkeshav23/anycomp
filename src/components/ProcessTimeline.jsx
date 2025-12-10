import React from 'react';

const steps = [
  {
    title: "Payment",
    description: "Proceed to secure checkout"
  },
  {
    title: "Begin incorporation",
    description: "Your new Company Secretary will gather the required information and initiate the incorporation process with SSM."
  },
  {
    title: "3-5 Business days",
    description: "Your Company should be ready in 3–5 business days."
  },
  {
    title: "Manage your new Company",
    description: "After registration, manage your company in the Anycomp Dashboard with regular updates from your Company Secretary"
  }
];

export default function ProcessTimeline() {
  return (
    <section className="section" style={{ background: 'white' }}>
      <div className="container">
        <h2 className="section-title">Incorporation Process</h2>
        <p className="section-subtitle">Simple, transparent steps to get your company registered.</p>
        <div className="grid grid-2">
          {steps.map((step, index) => (
            <div key={index} style={{ display: 'flex', gap: '1.5rem', padding: '1rem' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                background: '#eff6ff', 
                color: '#2563eb', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0,
                fontWeight: '700',
                fontSize: '1.1rem',
                border: '1px solid #dbeafe'
              }}>
                {index + 1}
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{step.title}</h3>
                <p style={{ color: '#475569', lineHeight: '1.6' }}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
