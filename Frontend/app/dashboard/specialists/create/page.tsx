'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CreateSpecialistPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createSpecialist = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Create with default values
        const response = await fetch(`${API_URL}/api/specialists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: 'Register a new company',
            description: '',
            base_price: 1800,
            duration_days: 7,
            service_category: 'Incorporation of a new company',
            supported_company_types: ['sdn_bhd'],
            serviceOfferings: [],
          }),
        });

        const data = await response.json();

        if (response.ok && data.data?.id) {
          // Redirect to preview/edit page
          router.replace(`/dashboard/specialists/${data.data.id}`);
        } else {
          setError(data.message || 'Failed to create service');
        }
      } catch (err) {
        console.error('Create error:', err);
        setError('Failed to create service');
      }
    };

    createSpecialist();
  }, [router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => router.push('/dashboard/specialists')}
          className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
      <p className="text-gray-600">Creating new service...</p>
    </div>
  );
}
