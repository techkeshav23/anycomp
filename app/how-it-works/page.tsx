import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, Edit, CheckCircle, ArrowRight } from 'lucide-react';
import { ReactNode } from 'react';

interface Step {
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
}

export default function HowItWorks() {
  const steps: Step[] = [
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
    <div>
      <Navbar />
      <div className="pt-20 min-h-screen bg-slate-50">
        
        <div className="bg-slate-950 text-white py-20">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-extrabold mb-6">How Anycomp Works</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              We&apos;ve simplified the company registration process into a few easy steps. No paperwork, no queues.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-16 px-6">
          <div className="flex flex-col gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-8 bg-white p-8 rounded-2xl border border-slate-200 items-start">
                <div className="text-5xl font-extrabold text-slate-100 leading-none">{step.number}</div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/register-company" className="inline-flex items-center gap-2 py-4 px-10 text-lg font-semibold bg-blue-600 text-white rounded-lg no-underline hover:bg-blue-700 transition-colors">
              Start Your Registration <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
