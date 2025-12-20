import Image from 'next/image';

const features = [
  {
    title: "Company Dashboard",
    description: "to give you an overview of your company's key information and activities"
  },
  {
    title: "Documents & Files",
    description: "provides a secure place to store and manage important company records"
  },
  {
    title: "eSignature",
    description: "eSignature lets you digitally sign documents requested by your Company Secretary"
  }
];

export default function ManageCompany() {
  return (
    <section className="bg-white py-10 sm:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <p className="text-navy font-semibold text-sm mb-2">Seamless Incorporation & Compliance</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">Manage your Company</h2>
          
          {/* Feature List */}
          <ul className="space-y-2 sm:space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 sm:gap-3">
                <span className="w-2 h-2 bg-navy rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-slate-600 text-sm sm:text-base">
                  <span className="font-bold text-slate-900">{feature.title}</span> {feature.description}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Dashboard Image Section */}
        <div className="relative mt-8 sm:mt-12">
          {/* Dashboard SVG Image */}
          <div className="relative z-10 flex justify-center">
            <div className="w-full max-w-5xl">
              <Image
                src="/dashboard.svg"
                alt="Anycomp Dashboard"
                width={1200}
                height={600}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
