import React from 'react';
import { UserPlus, FileText, PenTool, FolderOpen } from 'lucide-react';

const steps = [
  {
    icon: <UserPlus size={32} />,
    title: "Appoint a Company Secretary",
    description: "Connect with a licensed Company Secretary on our Platform and appoint them to register your company."
  },
  {
    icon: <FileText size={32} />,
    title: "Register your Company",
    description: "Your appointed Secretary will handle the registration process with SSM, ensuring everything is compliant."
  },
  {
    icon: <PenTool size={32} />,
    title: "eSignature",
    description: "Digitally sign official documents requested by your Company Secretary with full legal compliance."
  },
  {
    icon: <FolderOpen size={32} />,
    title: "Documents and Files",
    description: "Securely upload, store, and manage all your company documents."
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section">
      <div className="container">
        <h2 className="section-title">How it works</h2>
        <p className="section-subtitle">Appoint a Company Secretary to register your company</p>
        
        <div className="grid grid-2">
          {steps.map((step, index) => (
            <div key={index} className="card step-card">
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p style={{ marginTop: '1rem', color: '#475569' }}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
