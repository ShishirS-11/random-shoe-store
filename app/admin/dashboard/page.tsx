'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import Link from 'next/link';

// Define the type for a shoe object for better code quality
type Shoe = {
  id: number;
  name: string;
  brand: string;
  price: number;
  image_url: string;
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [shoes, setShoes] = useState<Shoe[]>([]);

  // Fetch all shoes from the database when the page loads
  useEffect(() => {
    const fetchShoes = async () => {
      const { data, error } = await supabase.from('shoes').select('*');
      if (data) {
        setShoes(data);
      }
    };
    fetchShoes();
  }, []);

  const handleAddShoe = async (event: React.FormEvent<HTMLFormElement>) => {
    // ... (This function remains the same as before)
    event.preventDefault();
    setLoading(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const imageFile = formData.get('image') as File;
    
    if (!imageFile || imageFile.size === 0) {
      alert('Please select an image file.');
      setLoading(false);
      return;
    }

    const fileName = `${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage.from('shoe-images').upload(fileName, imageFile);

    if (uploadError) {
      alert('Error uploading image: ' + uploadError.message);
      setLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('shoe-images').getPublicUrl(fileName);
    const publicUrl = urlData.publicUrl;

    const { error: insertError } = await supabase.from('shoes').insert({
      name: formData.get('name'),
      brand: formData.get('brand'),
      price: formData.get('price'),
      description: formData.get('description'),
      image_url: publicUrl,
    });

    if (insertError) {
      alert('Error saving shoe: ' + insertError.message);
    } else {
      alert('Shoe added successfully!');
      form.reset();
      window.location.reload();
    }
    setLoading(false);
  };

  const handleDelete = async (shoeId: number, imageUrl: string) => {
    // Ask for confirmation before deleting
    if (window.confirm('Are you sure you want to delete this shoe?')) {
      // 1. Delete the database record
      const { error: deleteError } = await supabase.from('shoes').delete().eq('id', shoeId);

      if (deleteError) {
        alert('Error deleting shoe: ' + deleteError.message);
      } else {
        // 2. Optional: Delete the image from storage to save space
        const fileName = imageUrl.split('/').pop();
        if (fileName) {
          await supabase.storage.from('shoe-images').remove([fileName]);
        }
        
        alert('Shoe deleted successfully.');
        window.location.reload(); // Refresh the page
      }
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-extrabold uppercase tracking-widest">Admin Dashboard</h1>
          <button onClick={() => { supabase.auth.signOut(); window.location.href = '/'; }} className="text-gray-400 hover:text-white">Log Out</button>
        </header>

        {/* Add Shoe Form */}
        <div className="bg-brand-gray p-8 rounded-lg shadow-2xl mb-12">
          <h2 className="text-2xl font-bold mb-6">Add New Shoe to Inventory</h2>
          <form onSubmit={handleAddShoe} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="name" placeholder="Shoe Name" className="p-3 bg-gray-700 rounded border-2 border-transparent focus:outline-none focus:border-brand-purple" required />
            <input name="brand" placeholder="Brand" className="p-3 bg-gray-700 rounded border-2 border-transparent focus:outline-none focus:border-brand-purple" required />
            <input name="price" type="number" placeholder="Price" className="p-3 bg-gray-700 rounded border-2 border-transparent focus:outline-none focus:border-brand-purple" required />
            <input name="image" type="file" className="md:col-span-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-purple file:text-white hover:file:bg-opacity-80" required />
            <textarea name="description" placeholder="Description" rows={4} className="md:col-span-2 p-3 bg-gray-700 rounded border-2 border-transparent focus:outline-none focus:border-brand-purple" required />
            <button type="submit" disabled={loading} className="md:col-span-2 w-full p-4 bg-green-600 rounded font-bold text-white hover:bg-green-500 transition-all disabled:bg-gray-500">
              {loading ? 'Adding Shoe...' : 'Add Shoe to Store'}
            </button>
          </form>
        </div>

        {/* Shoe List */}
        <div className="bg-brand-gray p-8 rounded-lg shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">Current Inventory</h2>
          <div className="space-y-4">
            {shoes.map((shoe) => (
              <div key={shoe.id} className="flex items-center justify-between bg-gray-700 p-4 rounded-md">
                <div className="flex items-center gap-4">
                  <img src={shoe.image_url} alt={shoe.name} className="w-16 h-16 object-cover rounded-md"/>
                  <div>
                    <p className="font-bold text-lg">{shoe.name}</p>
                    <p className="text-sm text-gray-400">{shoe.brand} - ${shoe.price}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link href={`/admin/edit/${shoe.id}`} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors">Edit</Link>
                  <button onClick={() => handleDelete(shoe.id, shoe.image_url)} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}