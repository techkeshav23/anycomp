'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  Search, 
  CheckCircle, 
  Building2, 
  Users, 
  CreditCard,
  ChevronRight,
  Menu,
  X,
  Home
} from 'lucide-react';

interface Step {
  number: number;
  title: string;
  icon: React.ReactNode;
}

export default function RegisterCompany() {
  const [step, setStep] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const steps: Step[] = [
    { number: 1, title: "Name Search", icon: <Search size={20} /> },
    { number: 2, title: "Company Details", icon: <Building2 size={20} /> },
    { number: 3, title: "Directors", icon: <Users size={20} /> },
    { number: 4, title: "Payment", icon: <CreditCard size={20} /> }
  ];

  return (
    <>
    <Navbar />
    <div className="flex min-h-screen bg-slate-50 pt-[73px]">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 top-[73px] bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-[260px] bg-slate-950 text-white flex flex-col fixed h-[calc(100vh-73px)] top-[73px] transition-all duration-300 z-50 ${sidebarOpen ? 'left-0' : '-left-[260px]'} lg:left-0`}>
        <div className="p-8 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
          <span className="text-xl font-bold">Anycomp</span>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="ml-auto bg-transparent border-none text-slate-400 cursor-pointer lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-6 flex-1">
          <div className="mb-8">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3 px-3">Menu</p>
            <ul className="list-none p-0 m-0 flex flex-col gap-2">
              <li>
                <a href="#" className="flex items-center gap-3 py-3 px-3 rounded-lg text-slate-400 no-underline transition-all hover:text-white hover:bg-slate-800">
                  <LayoutDashboard size={20} /> Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 py-3 px-3 rounded-lg bg-blue-600 text-white no-underline font-medium">
                  <PlusCircle size={20} /> Register Company
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 py-3 px-3 rounded-lg text-slate-400 no-underline transition-all hover:text-white hover:bg-slate-800">
                  <FileText size={20} /> Documents
                </a>
              </li>
              <li>
                <Link href="/" className="flex items-center gap-3 py-3 px-3 rounded-lg text-slate-400 no-underline transition-all hover:text-white hover:bg-slate-800">
                  <Home size={20} /> Back to Home
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[260px]">
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl border-none cursor-pointer z-30 flex items-center justify-center"
        >
          <Menu size={24} />
        </button>

        {/* Content Area */}
        <div className="p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Register Your Company</h1>
          <p className="text-slate-500 mb-12">Complete the steps below to incorporate your Sdn. Bhd.</p>

          {/* Progress Steps */}
          <div className="grid grid-cols-4 gap-4 mb-12">
            {steps.map((s) => (
              <div 
                key={s.number}
                className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                  step === s.number 
                    ? 'bg-blue-50 border-blue-600' 
                    : step > s.number 
                      ? 'bg-green-50 border-green-600' 
                      : 'bg-white border-slate-200'
                }`}
                onClick={() => setStep(s.number)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === s.number 
                      ? 'bg-blue-600 text-white' 
                      : step > s.number 
                        ? 'bg-green-600 text-white' 
                        : 'bg-slate-100 text-slate-400'
                  }`}>
                    {step > s.number ? <CheckCircle size={16} /> : s.number}
                  </div>
                  <span className={`text-lg font-semibold ${step >= s.number ? 'text-slate-900' : 'text-slate-400'}`}>
                    {s.title}
                  </span>
                </div>
                <div className={step >= s.number ? 'text-blue-600' : 'text-slate-300'}>
                  {s.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-4xl">
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Check Company Name Availability</h2>
                <div className="mb-6">
                  <label className="block mb-2 font-medium text-slate-700">Proposed Company Name</label>
                  <input 
                    type="text" 
                    className="w-full py-3 px-4 text-base rounded-lg border border-slate-300 bg-slate-50 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    placeholder="Example Sdn. Bhd."
                  />
                  <p className="text-sm text-slate-500 mt-2">Company name must end with "Sdn. Bhd." or "Sendirian Berhad"</p>
                </div>
                <button className="py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold border-none cursor-pointer hover:bg-blue-700 transition-colors flex items-center gap-2">
                  Search Availability <ChevronRight size={18} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Company Details</h2>
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="block mb-2 font-medium text-slate-700">Business Activity</label>
                    <textarea 
                      className="w-full py-3 px-4 text-base rounded-lg border border-slate-300 bg-slate-50 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 min-h-[100px] resize-none"
                      placeholder="Describe your company's business activities..."
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-slate-700">Registered Address</label>
                    <input 
                      type="text" 
                      className="w-full py-3 px-4 text-base rounded-lg border border-slate-300 bg-slate-50 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      placeholder="Street address"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Directors Information</h2>
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-medium text-slate-700">Full Name</label>
                      <input 
                        type="text" 
                        className="w-full py-3 px-4 text-base rounded-lg border border-slate-300 bg-slate-50 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        placeholder="Director's full name"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-medium text-slate-700">IC / Passport Number</label>
                      <input 
                        type="text" 
                        className="w-full py-3 px-4 text-base rounded-lg border border-slate-300 bg-slate-50 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        placeholder="123456-12-1234"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment</h2>
                <div className="bg-slate-50 p-6 rounded-xl mb-6">
                  <div className="flex justify-between mb-4">
                    <span className="text-slate-700">Company Registration</span>
                    <span className="font-semibold text-slate-900">RM 1,540</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-slate-700">Company Secretary (Annual)</span>
                    <span className="font-semibold text-slate-900">RM 720</span>
                  </div>
                  <div className="border-t border-slate-300 pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-slate-900">Total</span>
                      <span className="text-2xl font-bold text-blue-600">RM 2,260</span>
                    </div>
                  </div>
                </div>
                <button className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold border-none cursor-pointer hover:bg-blue-700 transition-colors text-lg">
                  Proceed to Payment
                </button>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-8 border-t border-slate-200">
              {step > 1 && (
                <button 
                  onClick={() => setStep(step - 1)}
                  className="py-3 px-6 bg-slate-100 text-slate-700 rounded-lg font-semibold border-none cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  Previous
                </button>
              )}
              {step < 4 && (
                <button 
                  onClick={() => setStep(step + 1)}
                  className="py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold border-none cursor-pointer hover:bg-blue-700 transition-colors ml-auto flex items-center gap-2"
                >
                  Next <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
