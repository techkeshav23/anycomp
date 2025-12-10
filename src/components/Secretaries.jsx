import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, CheckCircle, ShieldCheck } from 'lucide-react';

const secretaries = [
  {
    name: "Grace Lam",
    company: "Corpsec Services Sdn Bhd",
    clients: 250,
    location: "Kuala Lumpur, Malaysia",
    experience: "7+ years",
    price: "RM 1,600",
    features: [
      "24/7 access to statutory company records",
      "Enjoy one month free Company Secretary Subscription",
      "Complimentary Corporate Bank account opening"
    ]
  },
  {
    name: "Jessica Lane",
    company: "Napoli Secretarial Sdn Bhd",
    clients: 371,
    location: "Cyberjaya, Malaysia",
    experience: "4+ years",
    price: "RM 1,200",
    features: [
      "Documents are prioritised for submission",
      "Registered office address use",
      "Get automated reminders for all your compliance"
    ]
  },
  {
    name: "Siti Hisham",
    company: "Hisham Corps Sdn Bhd",
    clients: 89,
    location: "Petaling Jaya, Selangor",
    experience: "11+ years",
    price: "RM 1,200",
    features: [
      "Receive your first Share certificate at no cost",
      "Always on chat support for Compliance",
      "Have your company documents delivered securely"
    ]
  },
  {
    name: "Ahmad Usman",
    company: "Big Secretarial Sdn Bhd",
    clients: 390,
    location: "Petaling Jaya, Selangor",
    experience: "21+ years",
    price: "RM 1,200",
    features: [
      "Enjoy one month free Company Secretary Subscription",
      "Complimentary Corporate Bank account opening",
      "24/7 access to statutory company records"
    ]
  }
];

export default function Secretaries() {
  return (
    <section className="section" style={{ background: '#f8fafc' }}>
      <div className="container">
        <h2 className="section-title">Register Your Company with Malaysia’s Leading Company Secretaries</h2>
        <p className="section-subtitle">Certified Experts. Appoint a Company Secretary. Your secretary handles all details and documents to ensure a smooth and compliant SSM registration.</p>
        
        <div className="grid grid-2">
          {secretaries.map((sec, index) => (
            <div key={index} className="card secretary-card">
              <div className="secretary-header">
                <div className="secretary-avatar"></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{sec.name}</h3>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.25rem', 
                      fontSize: '0.75rem', 
                      background: '#dbeafe', 
                      color: '#1e40af', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '999px',
                      fontWeight: '600'
                    }}>
                      <ShieldCheck size={12} /> Verified
                    </div>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>{sec.company}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', marginTop: '0.5rem', color: '#64748b' }}>
                    <span>{sec.clients} clients served</span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: '#475569', padding: '1rem 0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} /> {sec.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Briefcase size={16} /> {sec.experience}
                </div>
              </div>

              <div style={{ padding: '1rem 0' }}>
                <div className="secretary-price">{sec.price}</div>
                <ul className="secretary-features">
                  {sec.features.map((feature, i) => (
                    <li key={i}>
                      <CheckCircle size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/signup" className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }}>Incorporate with {sec.name.split(' ')[0]}</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
