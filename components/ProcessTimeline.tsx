import { User, Globe, FileSignature, FolderOpen } from 'lucide-react';
import { ReactNode } from 'react';

interface Step {
  icon: ReactNode;
  iconBg: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: <User size={28} className="text-white" />,
    iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
    title: "Appoint a Company Secretary to register your company",
    description: "Connect with a licensed Company Secretary on our Platform and appoint them to register your company."
  },
  {
    icon: <Globe size={28} className="text-white" />,
    iconBg: "bg-gradient-to-br from-cyan-500 to-blue-600",
    title: "Register your Company",
    description: "Your appointed Secretary will handle the registration process with SSM (Suruhanjaya Syarikat Malaysia), ensuring everything is compliant."
  },
  {
    icon: <FileSignature size={28} className="text-white" />,
    iconBg: "bg-gradient-to-br from-pink-500 to-rose-500",
    title: "eSignature",
    description: "Digitally sign official documents requested by your Company Secretary with full legal compliance."
  },
  {
    icon: <FolderOpen size={28} className="text-white" />,
    iconBg: "bg-gradient-to-br from-rose-500 to-red-500",
    title: "Documents and Files",
    description: "Securely upload, store, and manage all your company documents."
  }
];

export default function ProcessTimeline() {
  return (
    <section className="bg-navy-dark py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            How it works
          </h2>
        </div>

        {/* Grid of Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-x-20 sm:gap-y-16">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4 sm:gap-5">
              {/* Icon */}
              <div className={`w-12 h-12 sm:w-14 sm:h-14 ${step.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                {step.icon}
              </div>
              {/* Content */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-cyan-400 mb-2">{step.title}</h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
