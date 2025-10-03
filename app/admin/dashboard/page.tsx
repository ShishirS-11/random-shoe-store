'use client';
import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);

  const handleAddShoe = async (event: React.FormEvent<HTMLFormElement>) => {
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

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-extrabold uppercase tracking-widest">Admin Dashboard</h1>
          <button onClick={() => supabase.auth.signOut()} className="text-gray-400 hover:text-white">Log Out</button>
        </header>

        <div className="bg-brand-gray p-8 rounded-lg shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">Add New Shoe to Inventory</h2>
          <form onSubmit={handleAddShoe} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="name" placeholder="Shoe Name" className="p-3 bg-gray-700 rounded border-2 border-transparent focus:outline-none focus:border-brand-purple" required />
            <input name="brand" placeholder="Brand" className="p-3 bg-gray-700 rounded border-2 border-transparent focus:outline-none focus:border-brand-purple" required />
            <input name="price" type="number" placeholder="Price" className="p-3 bg-gray-700 rounded border-2 border-transparent focus:outline-none focus:border-brand-purple" required />
            <input name="image" type="file" className="md:col-span-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-purple file:text-white hover:file:bg-opacity-80" required />
            <textarea name="description" placeholder="Description" rows={4} className="md:col-span-2 p-3 bg-gray-700 rounded border-2 border-transparent focus:outline-none focus:border-brand-purple" required />
            <button 
              type="submit" 
              disabled={loading}
              className="md:col-span-2 w-full p-4 bg-green-600 rounded font-bold text-white hover:bg-green-500 transition-all disabled:bg-gray-500"
            >
              {loading ? 'Adding Shoe...' : 'Add Shoe to Store'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}