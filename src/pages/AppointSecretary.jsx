import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, ArrowRight, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AppointSecretary() {
  return (
    <div className="animate-fade-in">
      <Navbar />
      <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#f8fafc' }}>
        
        {/* Hero Section */}
        <div style={{ background: '#0f172a', color: 'white', padding: '4rem 0' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Appoint a Company Secretary</h1>
            <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Every Sdn. Bhd. in Malaysia requires a qualified Company Secretary. Switch to Anycomp for digital, hassle-free compliance.
            </p>
            <Link to="/register-company" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
              Get Started Now
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="container" style={{ maxWidth: '1000px', margin: '4rem auto', padding: '0 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', marginBottom: '1.5rem' }}>
                <UserCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: '#0f172a' }}>Why do you need one?</h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                Under the Companies Act 2016, every private limited company (Sdn. Bhd.) must appoint at least one Company Secretary within 30 days of incorporation. They ensure your company complies with statutory requirements.
              </p>
            </div>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', marginBottom: '1.5rem' }}>
                <CheckCircle size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: '#0f172a' }}>What we handle</h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#64748b' }}>
                <li style={{ display: 'flex', gap: '0.75rem' }}><CheckCircle size={18} color="#2563eb" /> Annual Return filing</li>
                <li style={{ display: 'flex', gap: '0.75rem' }}><CheckCircle size={18} color="#2563eb" /> Board Resolutions</li>
                <li style={{ display: 'flex', gap: '0.75rem' }}><CheckCircle size={18} color="#2563eb" /> Maintenance of statutory books</li>
                <li style={{ display: 'flex', gap: '0.75rem' }}><CheckCircle size={18} color="#2563eb" /> Advisory on compliance</li>
              </ul>
            </div>

          </div>

          {/* CTA Box */}
          <div style={{ marginTop: '4rem', background: 'white', padding: '3rem', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>Ready to switch to Anycomp?</h2>
            <p style={{ color: '#64748b', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Transferring your company secretary to us is seamless. We handle all the paperwork with your previous provider.
            </p>
            <button className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              Contact Sales <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
