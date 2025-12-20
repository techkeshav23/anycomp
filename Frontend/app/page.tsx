import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import RegisterCompany from '@/components/RegisterCompany';
import AppointSecretary from '@/components/AppointSecretary';
import ManageCompany from '@/components/ManageCompany';
import ProcessTimeline from '@/components/ProcessTimeline';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="home">
      <Navbar />
      <Hero />
      <ProcessTimeline />
      <RegisterCompany />
      <AppointSecretary />
      <ManageCompany />
      <FAQ />
      <Footer />
    </div>
  );
}
