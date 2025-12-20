'use client';

import { useState } from 'react';
import {
  Search,
  Book,
  MessageCircle,
  Mail,
  Phone,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  Video,
  HelpCircle,
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    id: '1',
    question: 'How do I register a new company?',
    answer: 'To register a new company, navigate to the Specialists page and select a company registration service. Fill in the required information, upload necessary documents, and submit for processing. Our team will guide you through the entire process.',
    category: 'Getting Started',
  },
  {
    id: '2',
    question: 'What documents are required for company registration?',
    answer: 'Typically, you need: IC/Passport copies of directors and shareholders, proof of address, proposed company name, business activity description, and share capital information. Specific requirements may vary based on company type.',
    category: 'Getting Started',
  },
  {
    id: '3',
    question: 'How long does company registration take?',
    answer: 'Standard company registration typically takes 3-5 working days after all documents are submitted and approved. Express services may be available for faster processing.',
    category: 'Services',
  },
  {
    id: '4',
    question: 'How do I track my order status?',
    answer: 'Go to the Service Orders page in your dashboard. You can see all your orders with their current status. You will also receive email notifications when your order status changes.',
    category: 'Orders',
  },
  {
    id: '5',
    question: 'What payment methods are accepted?',
    answer: 'We accept credit/debit cards (Visa, Mastercard), online banking (FPX), and e-wallets. All payments are processed securely through our payment gateway.',
    category: 'Payments',
  },
  {
    id: '6',
    question: 'How do I contact my Company Secretary?',
    answer: 'Use the Messages feature in your dashboard to communicate directly with your assigned Company Secretary. You can also view their contact details on your service order page.',
    category: 'Services',
  },
];

const categories = ['All', 'Getting Started', 'Services', 'Orders', 'Payments'];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-2">
        Dashboard &gt; <span className="text-gray-900">Help Center</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
        <p className="text-gray-500 text-sm">Find answers to common questions</p>
      </div>

      {/* Search */}
      <div className="bg-blue-900 rounded-lg p-8 mb-8">
        <h2 className="text-xl font-semibold text-white text-center mb-4">
          How can we help you today?
        </h2>
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
            <Book className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">Documentation</h3>
          <p className="text-xs text-gray-500">Browse guides and tutorials</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-3">
            <Video className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">Video Tutorials</h3>
          <p className="text-xs text-gray-500">Watch step-by-step guides</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
            <MessageCircle className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">Live Chat</h3>
          <p className="text-xs text-gray-500">Chat with our support team</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mb-3">
            <FileText className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">Submit Ticket</h3>
          <p className="text-xs text-gray-500">Get help from our team</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 p-4 border-b border-gray-200 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? 'bg-blue-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="divide-y divide-gray-200">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No results found. Try a different search term.
            </div>
          ) : (
            filteredFaqs.map((faq) => (
              <div key={faq.id} className="p-4">
                <button
                  onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
                    <span className="text-sm font-medium text-gray-900">{faq.question}</span>
                  </div>
                  {expandedId === faq.id ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedId === faq.id && (
                  <div className="mt-3 ml-8 text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Still need help?</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Email Us</p>
              <p className="text-xs text-gray-500">support@anycomp.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Call Us</p>
              <p className="text-xs text-gray-500">+60 3-1234 5678</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Live Chat</p>
              <p className="text-xs text-gray-500">Available 9am - 6pm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
