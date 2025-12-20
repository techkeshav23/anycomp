'use client';

import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white py-3 sticky top-0 z-50 shadow-md border-b border-gray-100">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl sm:text-2xl font-bold tracking-wider text-navy uppercase">
              ANYCOMP
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex flex-1 justify-center space-x-10 items-center">
            <Link href="/services?category=incorporation" className="text-[13px] font-medium text-gray-700 hover:text-navy transition-all duration-200 whitespace-nowrap relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-navy after:transition-all after:duration-200 hover:after:w-full">
              Register Your Company
            </Link>
            <Link href="/appoint-secretary" className="text-[13px] font-medium text-gray-700 hover:text-navy transition-all duration-200 whitespace-nowrap relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-navy after:transition-all after:duration-200 hover:after:w-full">
              Appoint a Company Secretary
            </Link>
            <Link href="/services" className="text-[13px] font-medium text-gray-700 hover:text-navy transition-all duration-200 whitespace-nowrap relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-navy after:transition-all after:duration-200 hover:after:w-full">
              Company Secretarial Services
            </Link>
            <Link href="/how-it-works" className="text-[13px] font-medium text-gray-700 hover:text-navy transition-all duration-200 whitespace-nowrap relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-navy after:transition-all after:duration-200 hover:after:w-full">
              How Anycomp Works
            </Link>
          </div>

          {/* Search and Auth - Desktop */}
          <div className="hidden lg:flex items-center space-x-5">
            {/* Search Bar */}
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search for any services"
                className="w-[200px] pl-4 pr-3 py-2 border border-navy border-r-0 rounded-l-md text-sm focus:outline-none placeholder-gray-500 bg-white"
              />
              <button className="px-4 py-2 bg-navy text-white rounded-r-md hover:bg-opacity-90 transition-colors flex items-center justify-center h-[38px]">
                <Search size={18} />
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/signin" className="text-sm font-semibold text-navy border border-navy px-5 py-2 rounded-md hover:bg-navy hover:text-white transition-colors">
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-navy text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-opacity-90 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-navy"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
            <div className="flex flex-col space-y-4">
              <Link href="/services?category=incorporation" className="text-sm font-medium text-gray-700 hover:text-navy" onClick={() => setIsMenuOpen(false)}>
                Register Your Company
              </Link>
              <Link href="/appoint-secretary" className="text-sm font-medium text-gray-700 hover:text-navy" onClick={() => setIsMenuOpen(false)}>
                Appoint a Company Secretary
              </Link>
              <Link href="/services" className="text-sm font-medium text-gray-700 hover:text-navy" onClick={() => setIsMenuOpen(false)}>
                Company Secretarial Services
              </Link>
              <Link href="/how-it-works" className="text-sm font-medium text-gray-700 hover:text-navy" onClick={() => setIsMenuOpen(false)}>
                How Anycomp Works
              </Link>
              
              {/* Mobile Search */}
              <div className="flex items-center pt-2">
                <input
                  type="text"
                  placeholder="Search for any services"
                  className="flex-1 pl-4 pr-3 py-2 border border-navy border-r-0 rounded-l-md text-sm focus:outline-none placeholder-gray-500 bg-white"
                />
                <button className="px-4 py-2 bg-navy text-white rounded-r-md hover:bg-opacity-90 transition-colors flex items-center justify-center h-[38px]">
                  <Search size={18} />
                </button>
              </div>
              
              {/* Mobile Auth Buttons */}
              <div className="flex flex-col space-y-3 pt-2">
                <Link href="/signin" className="text-sm font-semibold text-navy border border-navy px-5 py-2 rounded-md hover:bg-navy hover:text-white transition-colors text-center" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-navy text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-opacity-90 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
