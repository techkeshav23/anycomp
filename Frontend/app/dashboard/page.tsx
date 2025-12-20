'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      router.push('/signin');
      return;
    }

    try {
      const user = JSON.parse(userData);
      
      // Redirect based on role
      if (user.role === 'admin') {
        router.push('/dashboard/specialists'); // Admin sees all specialists
      } else {
        router.push('/dashboard/services'); // Specialist sees their ONE service
      }
    } catch {
      router.push('/signin');
    } finally {
      setLoading(false);
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
    </div>
  );
}
