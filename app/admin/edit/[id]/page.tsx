'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

type Shoe = {
  name: string;
  brand: string;
  price: number;
  description: string;
};

export default function EditShoePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [shoe, setShoe] = useState<Shoe | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchShoe = useCallback(async () => {
    if (!id) return;
    const { data } = await supabase.from('shoes').select('*').eq('id', id).single();
    if (data) {
      setShoe(data);
    }
  }, [id]);

  useEffect(() => {
    fetchShoe();
  }, [fetchShoe]);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!shoe) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('shoes')
      .update(shoe)
      .eq('id', id);

    if (error) {
      alert('Error updating shoe: ' + error.message);
    } else {
      alert('Shoe updated successfully!');
      router.push('/admin/dashboard');
    }
    setLoading(false);
  };
  
  if (!shoe) {
    return <p>Loading...</p>
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-lg mx-auto">
        <header className="mb-12">
            <Link href="/admin/dashboard" className="text-gray-400 hover:text-white">&larr; Back to Dashboard</Link>
            <h1 className="text-4xl font-extrabold mt-2">Edit Shoe</h1>
        </header>

        <div className="bg-brand-gray p-8 rounded-lg shadow-2xl">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Name</label>
                <input value={shoe.name} onChange={e => setShoe({...shoe, name: e.target.value})} className="w-full p-3 bg-gray-700 rounded border-2 border-transparent focus:outline-none focus:border-brand-purple" required />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Brand</label>
                <input value={shoe.brand} onChange={e => setShoe({...shoe, brand: e.target.value})} className="w-full p-3 bg-gray-700 rounded border-2 border-transparent focus:outline-none focus:border-brand-purple" required />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Price</label>
                <input type="number" value={shoe.price} onChange={e => setShoe({...shoe, price: Number(e.target.value)})} className="w-full p-3 bg-gray-700 rounded border-2 border-transparent focus:outline-none focus:border-brand-purple" required />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Description</label>
                <textarea value={shoe.description} onChange={e => setShoe({...shoe, description: e.target.value})} rows={4} className="w-full p-3 bg-gray-700 rounded border-2 border-transparent focus:outline-none focus:border-brand-purple" required />
            </div>
            <button type="submit" disabled={loading} className="w-full p-4 bg-green-600 rounded font-bold text-white hover:bg-green-500 transition-all disabled:bg-gray-500">
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}