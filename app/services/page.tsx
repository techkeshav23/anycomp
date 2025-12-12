import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Briefcase, FileText, Shield, TrendingUp, ArrowRight } from 'lucide-react';

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  price: string;
}

export default function Services() {
  const services: Service[] = [
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
    <div>
      <Navbar />
      <div className="pt-20 min-h-screen bg-slate-50">
        
        <div className="bg-white py-16 border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Our Services</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to start, run, and grow your business in Malaysia.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto py-16 px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-slate-200 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-semibold text-slate-900">{service.price}</span>
                  <span className="text-blue-600 flex items-center gap-1 text-sm font-semibold">
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
