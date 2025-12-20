'use client';

import Link from 'next/link';
import { Eye, EyeOff, FileText, FolderOpen, PenTool, Users, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function SignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <FileText size={20} />, text: "Register your company on the platform" },
    { icon: <FolderOpen size={20} />, text: "Centralize all your corporate files in one smart, secure drive" },
    { icon: <PenTool size={20} />, text: "Digitally eSign any file" },
    { icon: <Users size={20} />, text: "Appoint a Company Secretary and request for any service" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image & Info */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        {/* Background Image */}
        <Image
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=1600&fit=crop"
          alt="Business meeting"
          fill
          className="object-cover"
          priority
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Logo */}
        <div className="absolute top-8 left-8 z-10">
          <Link href="/" className="text-2xl font-bold text-white tracking-wider">
            ANYCOMP
          </Link>
        </div>

        {/* Floating Card */}
        <div 
          className="absolute top-20 right-12 bg-yellow-400 rounded-lg p-4 z-10 max-w-[280px]"
          style={{
            boxShadow: '6px 8px 0 rgba(120, 120, 120, 0.4), 10px 15px 25px rgba(100, 100, 100, 0.25), 18px 28px 45px rgba(100, 100, 100, 0.2)'
          }}
        >
          <p className="text-sm font-semibold text-slate-800 mb-3">Choose your company secretary with confidence</p>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white bg-gray-300"
                  style={{
                    backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`,
                    backgroundSize: 'cover'
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-800">4.9</span>
              <span className="text-xs text-slate-600">from over 500+ Company Secretaries</span>
            </div>
          </div>
        </div>

        {/* Bottom Features Panel */}
        <div className="absolute bottom-8 left-8 bg-slate-900/80 backdrop-blur-sm p-5 rounded-xl z-10 max-w-[300px]">
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center text-blue-400 flex-shrink-0">
                  {feature.icon}
                </div>
                <p className="text-white text-xs leading-relaxed pt-1">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-8 sm:py-12 bg-white">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-navy">
              <div className="w-6 h-6 bg-navy rounded-md" />
              ANYCOMP
            </Link>
          </div>

          <div className="mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Login</h1>
            <p className="text-slate-500 text-sm sm:text-base">Register and manage your company with ease</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block mb-2 text-sm text-slate-600">Email</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base rounded-lg border border-slate-200 bg-white outline-none transition-all focus:border-navy focus:ring-2 focus:ring-navy/10"
                placeholder="Enter your email or username"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-600">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full py-2.5 sm:py-3 px-3 sm:px-4 pr-12 text-sm sm:text-base rounded-lg border border-slate-200 bg-white outline-none transition-all focus:border-navy focus:ring-2 focus:ring-navy/10"
                  placeholder="••••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-3.5 px-4 text-sm sm:text-base font-semibold mt-2 sm:mt-4 bg-navy text-white border-none rounded-lg cursor-pointer hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={20} />}
              {loading ? 'Logging in...' : 'Log In'}
            </button>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-2 text-sm">
              <p className="text-slate-500">
                No account? <Link href="/signup" className="text-navy font-medium no-underline hover:underline">Register here</Link>
              </p>
              <Link href="#" className="text-navy font-medium no-underline hover:underline">Reset Password</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
