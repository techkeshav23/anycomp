'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is Anycomp?",
    answer: "Anycomp is a digital platform that simplifies company registration and corporate secretarial services in Malaysia. We connect you with certified company secretaries to handle all your incorporation needs."
  },
  {
    question: "What is a Company Secretary and why do I need one?",
    answer: "A Company Secretary is a statutory officer required by Malaysian law for every company. They ensure your company complies with the Companies Act 2016, maintain statutory records, and handle official filings with SSM."
  },
  {
    question: "What is SSM?",
    answer: "SSM stands for Suruhanjaya Syarikat Malaysia (Companies Commission of Malaysia). It is the government agency responsible for regulating companies and businesses in Malaysia."
  },
  {
    question: "How do I Register my Company?",
    answer: "Simply choose a company secretary on our platform, complete the online form with your business details, make payment, and your secretary will handle the entire registration process with SSM."
  },
  {
    question: "How much does it cost to use Anycomp?",
    answer: "The cost varies depending on the company secretary you choose and the services required. Incorporation packages typically start from RM 1,000 and include basic secretarial services."
  },
  {
    question: "Who can use Anycomp — individuals, businesses, or foreigners?",
    answer: "Anycomp is available for Malaysian citizens, permanent residents, and foreigners who wish to register a company in Malaysia. Both individuals and existing businesses can use our platform."
  },
  {
    question: "Can I register more than one Company on Anycomp?",
    answer: "Yes, you can register multiple companies through Anycomp. Each company will have its own dashboard and can be managed separately through our platform."
  },
  {
    question: "How long does the company registration process take?",
    answer: "Typically, company registration takes 3-5 business days once all required documents are submitted and approved by SSM."
  },
  {
    question: "What is the Company Dashboard and what information does it show?",
    answer: "The Company Dashboard is your central hub for managing your company. It shows key information like company details, directors, shareholders, documents, compliance deadlines, and communication with your company secretary."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Side - Image */}
          <div className="relative order-2 lg:order-1">
            <div className="rounded-xl overflow-hidden max-w-md mx-auto lg:mx-0">
              {/* Person Image */}
              <div className="relative h-[280px] sm:h-[350px] lg:h-[400px] bg-gray-100">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=700&fit=crop"
                  alt="Professional with Malaysian flag"
                  fill
                  className="object-cover object-top"
                />
              </div>
              {/* Navy Banner */}
              <div className="bg-navy py-4 sm:py-5 px-4 sm:px-6 text-center">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Frequently asked Questions</h2>
                <p className="text-cyan-400 text-xs sm:text-sm">Everything You Need to Know</p>
              </div>
            </div>
          </div>

          {/* Right Side - FAQ Accordion */}
          <div className="space-y-0 order-1 lg:order-2">
            {/* Mobile Header */}
            <div className="lg:hidden mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">FAQ</h2>
              <p className="text-slate-500 text-sm">Common questions answered</p>
            </div>
            
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-gray-200">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full py-4 sm:py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-slate-900 font-medium pr-4 text-sm sm:text-base">{item.question}</span>
                  <ChevronDown 
                    size={20} 
                    className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                  />
                </button>
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-4 sm:pb-5 pr-6 sm:pr-8 text-slate-600 leading-relaxed text-sm sm:text-base">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
