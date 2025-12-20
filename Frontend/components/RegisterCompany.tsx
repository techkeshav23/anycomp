import { Building2, CreditCard, UserCheck, FileText, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface TimelineStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Secretary {
  id: number;
  name: string;
  image: string;
  coverImage: string;
  description: string;
  price: string;
}

const timelineSteps: TimelineStep[] = [
  {
    icon: <Building2 size={28} className="text-white" />,
    title: "Appoint Your Company Secretary",
    description: "Start Your Company Incorporation by Choosing a Certified Company Secretary"
  },
  {
    icon: <CreditCard size={28} className="text-white" />,
    title: "Payment",
    description: "Proceed to secure checkout"
  },
  {
    icon: <UserCheck size={28} className="text-white" />,
    title: "Begin incorporation",
    description: "Your new Company Secretary will gather the required information and initiate the incorporation process with SSM."
  },
  {
    icon: <FileText size={28} className="text-white" />,
    title: "3-5 Business days",
    description: "Your Company should be ready in 3-5 business days."
  },
  {
    icon: <LayoutDashboard size={28} className="text-white" />,
    title: "Manage your new Company",
    description: "After registration, manage your company in the Anycomp Dashboard with regular updates from your Company Secretary"
  }
];

const secretaries: Secretary[] = [
  {
    id: 1,
    name: "Osman Mehmet",
    image: "https://i.pravatar.cc/100?img=12",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    description: "Register Your Company with Malaysia's Leading Company Secretaries",
    price: "RM 1,600"
  },
  {
    id: 2,
    name: "Ashley Hazel",
    image: "https://i.pravatar.cc/100?img=5",
    coverImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop",
    description: "Incorporate Your Business with a Certified Company Secretary in Kuala Lumpur",
    price: "RM 1,549"
  },
  {
    id: 3,
    name: "Britney Saran",
    image: "https://i.pravatar.cc/100?img=9",
    coverImage: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=300&fit=crop",
    description: "Get Your Company Registered by a Licensed Company Secretary",
    price: "RM 1,900"
  },
  {
    id: 4,
    name: "Anastasia Mane",
    image: "https://i.pravatar.cc/100?img=16",
    coverImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=300&fit=crop",
    description: "Trusted Company Secretaries to Register Your Business with SSM",
    price: "RM 1,010"
  }
];

export default function RegisterCompany() {
  return (
    <section className="bg-white py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <p className="text-navy font-semibold text-sm mb-2">Get started with Anycomp</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3">Register a New Company</h2>
          <p className="text-slate-500 text-sm sm:text-base">Launch Your Company with Certified and Trusted Company Secretaries</p>
        </div>

        {/* Timeline - Hidden on mobile, visible on md+ */}
        <div className="relative mb-10 sm:mb-16 hidden md:block">
          <div className="flex justify-between items-start relative">
            {/* Connecting Line */}
            <div className="absolute top-8 left-[10%] right-[10%] h-[3px] bg-navy z-0" />
            
            {timelineSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center relative z-10 w-1/5 px-2">
                {/* Icon Circle */}
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-navy rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-lg">
                  {step.icon}
                </div>
                {/* Title */}
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-2 leading-tight">{step.title}</h3>
                {/* Description */}
                <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed hidden lg:block">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline - Mobile version (vertical) */}
        <div className="md:hidden mb-10 space-y-4">
          {timelineSteps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center flex-shrink-0">
                {step.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Secretary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          {secretaries.map((secretary) => (
            <div key={secretary.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              {/* Cover Image */}
              <div className="h-36 sm:h-44 relative overflow-hidden">
                <Image
                  src={secretary.coverImage}
                  alt={secretary.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="p-3 sm:p-4">
                {/* Secretary Info */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden relative flex-shrink-0">
                    <Image
                      src={secretary.image}
                      alt={secretary.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-navy text-sm">{secretary.name}</span>
                    <span className="text-slate-500 text-sm"> - Company Secretary</span>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-slate-600 text-sm mb-3 line-clamp-2">{secretary.description}</p>
                
                {/* Price */}
                <p className="font-bold text-slate-900 text-lg">{secretary.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <Link 
            href="/appoint-secretary" 
            className="inline-block bg-navy text-white px-6 sm:px-8 py-3 rounded-md font-semibold hover:bg-opacity-90 transition-colors text-sm sm:text-base"
          >
            View More
          </Link>
        </div>
      </div>
    </section>
  );
}
