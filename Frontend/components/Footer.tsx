import Link from 'next/link';
import { Linkedin, Facebook, Youtube, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Clients Column */}
          <div>
            <h3 className="text-[#8b9dc3] font-medium text-sm mb-4">Clients</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/register-company" className="text-[#4a9eff] hover:text-white text-sm transition-colors">
                  Register a Company
                </Link>
              </li>
              <li>
                <Link href="/appoint-secretary" className="text-[#4a9eff] hover:text-white text-sm transition-colors">
                  Appoint a Company Secretary
                </Link>
              </li>
              <li>
                <span className="text-[#4a9eff] hover:text-white text-sm transition-colors cursor-pointer">
                  eSignature
                </span>
              </li>
              <li>
                <span className="text-[#4a9eff] hover:text-white text-sm transition-colors cursor-pointer">
                  Documents & File Storage
                </span>
              </li>
              <li>
                <Link href="/how-it-works" className="text-[#4a9eff] hover:text-white text-sm transition-colors">
                  How Anycomp Works
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-[#4a9eff] hover:text-white text-sm transition-colors">
                  Create an account
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Secretary Column */}
          <div>
            <h3 className="text-[#8b9dc3] font-medium text-sm mb-4">Company Secretary</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-[#4a9eff] hover:text-white text-sm transition-colors cursor-pointer">
                  Partner with Anycomp
                </span>
              </li>
              <li>
                <Link href="/how-it-works" className="text-[#4a9eff] hover:text-white text-sm transition-colors">
                  How Anycomp works - CoSec
                </Link>
              </li>
              <li>
                <span className="text-[#4a9eff] hover:text-white text-sm transition-colors cursor-pointer">
                  Get verified
                </span>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-[#8b9dc3] font-medium text-sm mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-[#4a9eff] hover:text-white text-sm transition-colors cursor-pointer">
                  About us
                </span>
              </li>
              <li>
                <span className="text-[#4a9eff] hover:text-white text-sm transition-colors cursor-pointer">
                  Contact us
                </span>
              </li>
              <li>
                <span className="text-[#4a9eff] hover:text-white text-sm transition-colors cursor-pointer">
                  Partners
                </span>
              </li>
              <li>
                <span className="text-[#4a9eff] hover:text-white text-sm transition-colors cursor-pointer">
                  Careers
                </span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-[#8b9dc3] font-medium text-sm mb-4">Follow us</h3>
            <div className="flex items-center gap-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#4a9eff] transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#4a9eff] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#4a9eff] transition-colors">
                <Youtube size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#4a9eff] transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#1e293b] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[#64748b] text-xs">
            © ST COMP HOLDING SDN BHD
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[#4a9eff] hover:text-white text-xs transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="text-[#4a9eff] hover:text-white text-xs transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span className="text-[#4a9eff] hover:text-white text-xs transition-colors cursor-pointer">
              Payment Terms
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
