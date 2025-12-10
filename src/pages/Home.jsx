import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import GetStarted from '../components/GetStarted';
import ProcessTimeline from '../components/ProcessTimeline';
import Secretaries from '../components/Secretaries';
import Features from '../components/Features';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="home">
      <Navbar />
      <Hero />
      <HowItWorks />
      <GetStarted />
      <ProcessTimeline />
      <Secretaries />
      <Features />
      <Footer />
    </div>
  );
}
