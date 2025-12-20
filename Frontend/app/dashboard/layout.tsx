'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  FileSignature,
  Mail,
  Receipt,
  HelpCircle,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  Search,
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Admin sidebar - full access to manage specialists and platform
const adminSidebarItems = [
  { name: 'Specialists', href: '/dashboard/specialists', icon: Users },
  { name: 'Clients', href: '/dashboard/clients', icon: Users },
  { name: 'Service Orders', href: '/dashboard/orders', icon: ShoppingCart },
  { name: 'eSignature', href: '/dashboard/esignature', icon: FileSignature },
  { name: 'Messages', href: '/dashboard/messages', icon: Mail },
  { name: 'Invoices & Receipts', href: '/dashboard/invoices', icon: Receipt },
];

// Specialist sidebar - manage their own service (ONE service only)
const specialistSidebarItems = [
  { name: 'Services', href: '/dashboard/services', icon: Users },
  { name: 'Clients', href: '/dashboard/clients', icon: Users },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
  { name: 'eSignature', href: '/dashboard/esignature', icon: FileSignature },
  { name: 'Messages', href: '/dashboard/messages', icon: Mail },
  { name: 'Invoices & Receipts', href: '/dashboard/invoices', icon: Receipt },
];

const bottomItems = [
  { name: 'Help', href: '/dashboard/help', icon: HelpCircle },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/signin');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch {
      router.push('/signin');
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/signin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        {/* Profile Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="text-sm text-gray-500 mb-2">Profile</div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="font-medium text-gray-900">{user?.name || 'User'}</div>
              <div className="text-xs text-blue-600">{user?.role || 'user'}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-4">
            {user?.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
          </div>
          <ul className="space-y-1">
            {(user?.role === 'admin' ? adminSidebarItems : specialistSidebarItems).map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-900 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200">
          <ul className="space-y-1">
            {bottomItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Header - Only show for admin */}
        {user?.role === 'admin' && (
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Mail className="w-5 h-5" />
              </button>
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-white text-sm font-semibold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </header>
        )}

        {/* Page Content */}
        <div className={user?.role === 'admin' ? 'p-6' : ''}>{children}</div>
      </main>
    </div>
  );
}
