import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustedBy from '../components/TrustedBy';
import ProcessTimeline from '../components/ProcessTimeline';
import Secretaries from '../components/Secretaries';
import Features from '../components/Features';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="home">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <ProcessTimeline />
      <Secretaries />
      <Footer />
    </div>
  );
}
