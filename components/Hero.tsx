'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="bg-white text-slate-900 pt-8 sm:pt-12 pb-12 sm:pb-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 sm:mb-6 text-slate-800 tracking-tight">
              Register your Company
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-lg mb-6 sm:mb-10 leading-relaxed font-medium">
              Incorporate Your Company, Appoint a Secretary & Manage Everything in One Platform
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
              <Link href="/signup" className="w-full sm:w-auto bg-navy border-none py-3 sm:py-4 px-8 sm:px-10 text-base font-semibold rounded-lg text-white no-underline hover:bg-opacity-90 transition-colors text-center">
                Get Started
              </Link>
              
              <div className="flex items-center gap-4">
                <div className="flex ml-2.5">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-300 border-[3px] border-white -ml-3.5 first:ml-0"
                      style={{ 
                        backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 max-w-[150px] leading-tight">
                  Find and Appoint any Company Secretary
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative order-1 lg:order-2"
          >
            <div className="w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] bg-slate-100 rounded-2xl sm:rounded-3xl overflow-hidden relative">
              <div 
                className="w-full h-full brightness-95"
                style={{ 
                  backgroundImage: 'url(https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div className="absolute top-0 right-0 w-36 h-full bg-gradient-to-l from-white/20 to-transparent pointer-events-none" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
