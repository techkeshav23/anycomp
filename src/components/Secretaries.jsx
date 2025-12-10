import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, CheckCircle, ShieldCheck, Star } from 'lucide-react';

const secretaries = [
  {
    name: "Grace Lam",
    company: "Corpsec Services Sdn Bhd",
    clients: 250,
    rating: 4.9,
    location: "Kuala Lumpur",
    experience: "7+ years",
    price: "RM 1,600",
    features: [
      "24/7 access to statutory company records",
      "One month free Company Secretary Subscription",
      "Complimentary Corporate Bank account opening"
    ]
  },
  {
    name: "Jessica Lane",
    company: "Napoli Secretarial Sdn Bhd",
    clients: 371,
    rating: 4.8,
    location: "Cyberjaya",
    experience: "4+ years",
    price: "RM 1,200",
    features: [
      "Priority document submission",
      "Registered office address included",
      "Automated compliance reminders"
    ]
  },
  {
    name: "Siti Hisham",
    company: "Hisham Corps Sdn Bhd",
    clients: 89,
    rating: 5.0,
    location: "Petaling Jaya",
    experience: "11+ years",
    price: "RM 1,200",
    features: [
      "Free first Share certificate",
      "Dedicated compliance chat support",
      "Secure document delivery"
    ]
  },
  {
    name: "Ahmad Usman",
    company: "Big Secretarial Sdn Bhd",
    clients: 390,
    rating: 4.9,
    location: "Petaling Jaya",
    experience: "21+ years",
    price: "RM 1,450",
    features: [
      "Senior secretarial consultation",
      "Express incorporation service",
      "Annual return filing included"
    ]
  }
];

export default function Secretaries() {
  return (
    <section className="section" style={{ background: '#f8fafc', padding: '6rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem auto' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.5rem 1rem', 
            background: '#eff6ff', 
            color: '#2563eb', 
            borderRadius: '999px', 
            fontSize: '0.875rem', 
            fontWeight: '600',
            marginBottom: '1.5rem'
          }}>
            <ShieldCheck size={16} /> Verified Partners
          </div>
          <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#0f172a' }}>
            Malaysia’s Top Company Secretaries
          </h2>
          <p className="section-subtitle" style={{ fontSize: '1.125rem', color: '#64748b' }}>
            We partner with certified experts to handle your compliance. Choose a secretary that fits your business needs and get started today.
          </p>
        </div>
        
        <div className="grid grid-2" style={{ gap: '2rem' }}>
          {secretaries.map((sec, index) => (
            <div key={index} className="card secretary-card" style={{ 
              background: 'white', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              padding: '2rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              <div className="secretary-header" style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="secretary-avatar" style={{ 
                  width: '64px', 
                  height: '64px', 
                  background: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)', 
                  borderRadius: '12px',
                  flexShrink: 0
                }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>{sec.name}</h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>{sec.company}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontWeight: '600', fontSize: '0.9rem' }}>
                      <Star size={16} fill="#f59e0b" /> {sec.rating}
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '1rem', 
                padding: '1rem 0', 
                borderTop: '1px solid #f1f5f9',
                borderBottom: '1px solid #f1f5f9',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                  <MapPin size={16} className="text-blue-500" /> {sec.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                  <Briefcase size={16} className="text-blue-500" /> {sec.experience}
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <div className="secretary-price" style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>
                  {sec.price} <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '400' }}>/ incorporation</span>
                </div>
                <ul className="secretary-features" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {sec.features.map((feature, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.95rem', color: '#475569' }}>
                      <CheckCircle size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: '3px' }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/signup" className="btn btn-primary" style={{ 
                width: '100%', 
                justifyContent: 'center', 
                padding: '0.875rem',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '8px',
                background: '#0f172a',
                color: 'white',
                border: 'none'
              }}>
                Select {sec.name.split(' ')[0]}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
