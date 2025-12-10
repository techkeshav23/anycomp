import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="hero" style={{ 
      background: 'white', 
      color: '#0f172a', 
      paddingTop: '10rem',
      paddingBottom: '6rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="container" style={{ maxWidth: '1400px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{ 
              fontSize: '4rem', 
              fontWeight: '800', 
              lineHeight: '1.1', 
              marginBottom: '1.5rem',
              color: '#1e293b',
              letterSpacing: '-0.02em'
            }}>
              Register your Company
            </h1>
            
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#475569', 
              maxWidth: '500px', 
              marginBottom: '2.5rem',
              lineHeight: '1.6',
              fontWeight: '500'
            }}>
              Incorporate Your Company, Appoint a Secretary & Manage Everything in One Platform
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <Link to="/signup" className="btn btn-primary" style={{ 
                background: '#0f172a', 
                border: 'none',
                padding: '1rem 2.5rem', 
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '6px',
                color: 'white',
                textDecoration: 'none'
              }}>
                Get Started
              </Link>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', marginLeft: '10px' }}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: `#cbd5e1 url(https://i.pravatar.cc/100?img=${i + 10}) center/cover`, 
                      border: '3px solid white',
                      marginLeft: '-15px'
                    }}></div>
                  ))}
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#334155', maxWidth: '150px', lineHeight: '1.2' }}>
                  Find and Appoint any Company Secretary
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ position: 'relative' }}
          >
            <div style={{ 
              width: '100%', 
              height: '500px', 
              background: '#f1f5f9', 
              borderRadius: '24px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* Placeholder for the Team Image */}
              <div style={{ 
                width: '100%', 
                height: '100%', 
                background: 'url(https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80) center/cover',
                filter: 'brightness(0.95)'
              }}></div>
              
              {/* Flag Overlay Simulation (Optional, to match vibe) */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '150px',
                height: '100%',
                background: 'linear-gradient(to left, rgba(255,255,255,0.2), transparent)',
                pointerEvents: 'none'
              }}></div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
