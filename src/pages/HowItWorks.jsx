import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, Edit, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Check Name Availability",
      description: "Use our instant name search tool to check if your desired company name is available with SSM.",
      icon: <Search size={24} />
    },
    {
      number: "02",
      title: "Fill in Details",
      description: "Complete our simplified online form with your business activities and director details. 100% digital.",
      icon: <Edit size={24} />
    },
    {
      number: "03",
      title: "We File for You",
      description: "Our certified company secretaries review your information and submit the application to SSM.",
      icon: <CheckCircle size={24} />
    },
    {
      number: "04",
      title: "Get Incorporated",
      description: "Receive your Certificate of Incorporation (Section 17) via email. You are now ready to do business!",
      icon: <CheckCircle size={24} />
    }
  ];

  return (
    <div className="animate-fade-in">
      <Navbar />
      <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#f8fafc' }}>
        
        <div style={{ background: '#0f172a', color: 'white', padding: '5rem 0' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>How Anycomp Works</h1>
            <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
              We've simplified the company registration process into a few easy steps. No paperwork, no queues.
            </p>
          </div>
        </div>

        <div className="container" style={{ maxWidth: '1000px', margin: '4rem auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {steps.map((step, index) => (
              <div key={index} style={{ display: 'flex', gap: '2rem', background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '3rem', fontWeight: '800', color: '#e2e8f0', lineHeight: 1 }}>{step.number}</div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>{step.title}</h3>
                  <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '1.1rem' }}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link to="/register-company" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              Start Your Registration <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
