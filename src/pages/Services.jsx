import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Briefcase, FileText, Shield, TrendingUp, ArrowRight } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: <Briefcase size={24} />,
      title: "Company Incorporation",
      description: "Register your Sdn. Bhd. completely online. We handle the name search, SSM filing, and post-incorporation setup.",
      price: "From RM 1,540"
    },
    {
      icon: <Shield size={24} />,
      title: "Company Secretary",
      description: "Certified professionals to ensure your company stays compliant with the Companies Act 2016.",
      price: "RM 60 / month"
    },
    {
      icon: <FileText size={24} />,
      title: "Accounting & Tax",
      description: "Cloud-based accounting services, bookkeeping, and tax filing preparation for small businesses.",
      price: "Custom Quote"
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Employment Pass",
      description: "Assistance with work visas and employment passes for foreign directors or employees.",
      price: "Custom Quote"
    }
  ];

  return (
    <div className="animate-fade-in">
      <Navbar />
      <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#f8fafc' }}>
        
        <div style={{ background: 'white', padding: '4rem 0', borderBottom: '1px solid #e2e8f0' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>Our Services</h1>
            <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
              Everything you need to start, run, and grow your business in Malaysia.
            </p>
          </div>
        </div>

        <div className="container" style={{ maxWidth: '1200px', margin: '4rem auto', padding: '0 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {services.map((service, index) => (
              <div key={index} style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', transition: 'transform 0.2s', cursor: 'pointer' }} className="service-card">
                <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', marginBottom: '1.5rem' }}>
                  {service.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>{service.title}</h3>
                <p style={{ color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.6' }}>{service.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>{service.price}</span>
                  <span style={{ color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', fontWeight: '600' }}>
                    Learn more <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
