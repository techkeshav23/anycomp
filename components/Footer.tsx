export default function Footer() {
  return (
    <footer className="bg-slate-950 pt-12 sm:pt-24 pb-8 sm:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-16 mb-12 sm:mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-2 text-white font-extrabold text-xl sm:text-2xl mb-4 sm:mb-6">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-md" />
              Anycomp
            </div>
            <p className="text-slate-400 mb-6 sm:mb-8 max-w-sm leading-relaxed text-sm sm:text-base">
              The modern operating system for Malaysian companies. Incorporate, manage, and grow your business with confidence.
            </p>
            <div className="text-slate-500 text-xs sm:text-sm">
              ST Comp Holding Sdn Bhd<br/>
              Registration No. 202501000000 (123456-A)
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 sm:mb-6 text-sm sm:text-base">Product</h3>
            <ul className="flex flex-col gap-3 sm:gap-4 list-none p-0">
              <li><a href="#" className="text-slate-400 no-underline hover:text-white transition-colors text-sm">Incorporation</a></li>
              <li><a href="#" className="text-slate-400 no-underline hover:text-white transition-colors text-sm">Company Secretary</a></li>
              <li><a href="#" className="text-slate-400 no-underline hover:text-white transition-colors text-sm">Compliance</a></li>
              <li><a href="#" className="text-slate-400 no-underline hover:text-white transition-colors text-sm">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 sm:mb-6 text-sm sm:text-base">Company</h3>
            <ul className="flex flex-col gap-3 sm:gap-4 list-none p-0">
              <li><a href="#" className="text-slate-400 no-underline hover:text-white transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-slate-400 no-underline hover:text-white transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="text-slate-400 no-underline hover:text-white transition-colors text-sm">Blog</a></li>
              <li><a href="#" className="text-slate-400 no-underline hover:text-white transition-colors text-sm">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-6 sm:pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-xs sm:text-sm">
          <div>© 2025 Anycomp. All rights reserved.</div>
          <div className="flex gap-4 sm:gap-6">
            <a href="#" className="text-slate-500 no-underline hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-slate-500 no-underline hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="text-slate-500 no-underline hover:text-white transition-colors">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
