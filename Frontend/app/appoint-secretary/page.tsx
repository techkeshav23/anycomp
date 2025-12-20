import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle, ArrowRight, UserCheck } from 'lucide-react';

export default function AppointSecretary() {
  return (
    <div>
      <Navbar />
      <div className="pt-20 min-h-screen bg-slate-50">
        
        {/* Hero Section */}
        <div className="bg-slate-950 text-white py-10 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4">Appoint a Company Secretary</h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-6 sm:mb-8">
              Every Sdn. Bhd. in Malaysia requires a qualified Company Secretary. Switch to Anycomp for digital, hassle-free compliance.
            </p>
            <Link href="/services" className="inline-flex items-center py-3 px-6 sm:px-8 text-sm sm:text-base font-semibold bg-blue-600 text-white rounded-lg no-underline hover:bg-blue-700 transition-colors">
              Get Started Now
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto py-10 sm:py-16 px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            
            <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-slate-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center text-blue-600 mb-4 sm:mb-6">
                <UserCheck size={20} className="sm:hidden" />
                <UserCheck size={24} className="hidden sm:block" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-slate-900">Why do you need one?</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Under the Companies Act 2016, every private limited company (Sdn. Bhd.) must appoint at least one Company Secretary within 30 days of incorporation. They ensure your company complies with statutory requirements.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-slate-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center text-blue-600 mb-4 sm:mb-6">
                <CheckCircle size={20} className="sm:hidden" />
                <CheckCircle size={24} className="hidden sm:block" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-slate-900">What we handle</h3>
              <ul className="list-none p-0 flex flex-col gap-2 sm:gap-3 text-slate-600 text-sm sm:text-base">
                <li className="flex gap-2 sm:gap-3"><CheckCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5 sm:hidden" /><CheckCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5 hidden sm:block" /> Annual Return filing</li>
                <li className="flex gap-2 sm:gap-3"><CheckCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5 sm:hidden" /><CheckCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5 hidden sm:block" /> Board Resolutions</li>
                <li className="flex gap-2 sm:gap-3"><CheckCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5 sm:hidden" /><CheckCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5 hidden sm:block" /> Maintenance of statutory books</li>
                <li className="flex gap-2 sm:gap-3"><CheckCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5 sm:hidden" /><CheckCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5 hidden sm:block" /> Advisory on compliance</li>
              </ul>
            </div>

          </div>

          {/* CTA Box */}
          <div className="mt-10 sm:mt-16 bg-white p-8 sm:p-12 rounded-2xl sm:rounded-3xl border border-slate-200 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">Ready to switch to Anycomp?</h2>
            <p className="text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
              Transferring your company secretary to us is seamless. We handle all the paperwork with your previous provider.
            </p>
            <button className="inline-flex items-center gap-2 py-3 px-6 sm:px-8 bg-blue-600 text-white rounded-lg font-semibold text-sm sm:text-base border-none cursor-pointer hover:bg-blue-700 transition-colors">
              Contact Sales <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
