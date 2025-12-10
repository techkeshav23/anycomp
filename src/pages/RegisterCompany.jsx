import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Settings, 
  FileText, 
  Search, 
  ArrowRight, 
  CheckCircle, 
  Building2, 
  Users, 
  CreditCard,
  ChevronRight,
  Menu,
  X,
  Home
} from 'lucide-react';

export default function RegisterCompany() {
  const [step, setStep] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const steps = [
    { number: 1, title: "Name Search", icon: <Search size={20} /> },
    { number: 2, title: "Company Details", icon: <Building2 size={20} /> },
    { number: 3, title: "Directors", icon: <Users size={20} /> },
    { number: 4, title: "Payment", icon: <CreditCard size={20} /> }
  ];

  return (
    <>
    <Navbar />
    <div className="animate-fade-in" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', paddingTop: '73px' }}>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, top: '73px', background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside style={{ 
        width: '260px', 
        background: '#0f172a', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'fixed',
        height: 'calc(100vh - 73px)',
        top: '73px',
        left: sidebarOpen ? 0 : '-260px',
        transition: 'left 0.3s ease',
        zIndex: 50,
        '@media (min-width: 1024px)': {
          position: 'sticky',
          top: '73px',
          left: 0
        }
      }} className="dashboard-sidebar">
        <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid #1e293b' }}>
          <div style={{ width: '32px', height: '32px', background: '#2563eb', borderRadius: '8px' }}></div>
          <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>Anycomp</span>
          <button 
            onClick={() => setSidebarOpen(false)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'none' }}
            className="mobile-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        <nav style={{ padding: '1.5rem 1rem', flex: 1 }}>
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', paddingLeft: '0.75rem' }}>Menu</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', color: '#94a3b8', textDecoration: 'none', transition: 'all 0.2s' }}>
                  <LayoutDashboard size={20} /> Dashboard
                </a>
              </li>
              <li>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', background: '#2563eb', color: 'white', textDecoration: 'none', fontWeight: '500' }}>
                  <PlusCircle size={20} /> Register Company
                </a>
              </li>
              <li>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', color: '#94a3b8', textDecoration: 'none', transition: 'all 0.2s' }}>
                  <FileText size={20} /> Documents
                </a>
              </li>
              <li>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', color: '#94a3b8', textDecoration: 'none', transition: 'all 0.2s' }}>
                  <Home size={20} /> Back to Home
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', paddingLeft: '0.75rem' }}>Settings</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', color: '#94a3b8', textDecoration: 'none', transition: 'all 0.2s' }}>
                  <Settings size={20} /> Settings
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600' }}>JD</div>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>John Doe</p>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>john@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Mobile Menu Button */}
        <div className="mobile-menu-btn" style={{ padding: '1rem', display: 'none' }}>
          <button 
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <Menu size={24} />
          </button>
        </div>

        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            
            {/* Progress Steps */}
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                {/* Connecting Line */}
                <div style={{ position: 'absolute', top: '20px', left: '0', right: '0', height: '2px', background: '#e2e8f0', zIndex: 0 }}></div>
                <div style={{ position: 'absolute', top: '20px', left: '0', width: `${((step - 1) / (steps.length - 1)) * 100}%`, height: '2px', background: '#2563eb', zIndex: 0, transition: 'width 0.3s ease' }}></div>

                {steps.map((s) => (
                  <div key={s.number} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: step >= s.number ? '#2563eb' : 'white', 
                      border: step >= s.number ? 'none' : '2px solid #e2e8f0',
                      color: step >= s.number ? 'white' : '#94a3b8',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      transition: 'all 0.3s ease'
                    }}>
                      {step > s.number ? <CheckCircle size={20} /> : s.icon}
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: step >= s.number ? '#0f172a' : '#94a3b8' }}>{s.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="card" style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              
              <div key={step} className="animate-slide-up">
              {step === 1 && (
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>Let's start with a name</h2>
                  <p style={{ color: '#64748b', marginBottom: '2rem' }}>Check if your desired company name is available for registration with SSM.</p>
                  
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Proposed Company Name</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1, position: 'relative' }}>
                        <input 
                          type="text" 
                          placeholder="Enter company name" 
                          style={{ 
                            width: '100%', 
                            padding: '0.875rem 1rem', 
                            paddingRight: '3rem',
                            borderRadius: '8px', 
                            border: '1px solid #e2e8f0', 
                            fontSize: '1rem',
                            outline: 'none'
                          }} 
                        />
                        <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#2563eb', fontWeight: '600' }}>SDN. BHD.</div>
                      </div>
                      <button className="btn btn-primary" style={{ padding: '0 1.5rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                        Check Availability
                      </button>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#16a34a', marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle size={14} /> Great news! This name appears to be available.
                    </p>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>Name Search Tips</h3>
                    <ul style={{ paddingLeft: '1.25rem', color: '#64748b', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <li>Avoid names that are too similar to existing companies.</li>
                      <li>Do not use offensive or misleading words.</li>
                      <li>Certain words like "Royal", "Bank", or "Finance" require special approval.</li>
                    </ul>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>Company Details</h2>
                  <p style={{ color: '#64748b', marginBottom: '2rem' }}>Tell us a bit more about your business activities.</p>
                  
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Business Nature</label>
                      <select style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', background: 'white' }}>
                        <option>Technology & Software</option>
                        <option>Retail & E-commerce</option>
                        <option>Consulting & Services</option>
                        <option>Manufacturing</option>
                        <option>Food & Beverage</option>
                      </select>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Business Description</label>
                      <textarea 
                        rows="4"
                        placeholder="Describe what your company does..."
                        style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', fontFamily: 'inherit' }}
                      ></textarea>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Business Address</label>
                      <input 
                        type="text" 
                        placeholder="Street Address" 
                        style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', marginBottom: '0.75rem' }} 
                      />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input type="text" placeholder="City" style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }} />
                        <input type="text" placeholder="Postcode" style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>Directors & Shareholders</h2>
                  <p style={{ color: '#64748b', marginBottom: '2rem' }}>Add at least one director who resides in Malaysia.</p>
                  
                  <div style={{ border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '2rem', textAlign: 'center', background: '#f8fafc', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ width: '48px', height: '48px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#64748b' }}>
                      <PlusCircle size={24} />
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>Add Director</h3>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>You need at least one director</p>
                  </div>

                  <div style={{ marginTop: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>Current Directors</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', background: '#eff6ff', color: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>JD</div>
                        <div>
                          <p style={{ fontWeight: '600', color: '#0f172a' }}>John Doe</p>
                          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Director & Shareholder (100%)</p>
                        </div>
                      </div>
                      <button style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}>Remove</button>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>Review & Payment</h2>
                  <p style={{ color: '#64748b', marginBottom: '2rem' }}>Review your details and proceed to payment.</p>
                  
                  <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ color: '#64748b' }}>SSM Registration Fee</span>
                      <span style={{ fontWeight: '600', color: '#0f172a' }}>RM 1,010.00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ color: '#64748b' }}>Service Fee</span>
                      <span style={{ fontWeight: '600', color: '#0f172a' }}>RM 500.00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ color: '#64748b' }}>Tax (SST 6%)</span>
                      <span style={{ fontWeight: '600', color: '#0f172a' }}>RM 30.00</span>
                    </div>
                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                      <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.1rem' }}>Total</span>
                      <span style={{ fontWeight: '700', color: '#2563eb', fontSize: '1.25rem' }}>RM 1,540.00</span>
                    </div>
                  </div>

                  <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <CreditCard size={20} /> Pay Securely
                  </button>
                </div>
              )}

              </div>

              {/* Navigation Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9' }}>
                <button 
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  style={{ 
                    padding: '0.75rem 1.5rem', 
                    background: 'white', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px', 
                    color: step === 1 ? '#cbd5e1' : '#64748b', 
                    cursor: step === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Back
                </button>
                
                {step < 4 && (
                  <button 
                    onClick={() => setStep(Math.min(4, step + 1))}
                    style={{ 
                      padding: '0.75rem 1.5rem', 
                      background: '#2563eb', 
                      border: 'none', 
                      borderRadius: '8px', 
                      color: 'white', 
                      cursor: 'pointer',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    Next Step <ChevronRight size={18} />
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>
      
      <style>{`
        @media (max-width: 1024px) {
          .dashboard-sidebar {
            position: fixed;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .mobile-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
    </>
  );
}
