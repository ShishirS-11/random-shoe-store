'use client';
import { supabase } from '../../../lib/supabaseClient';

export default function AdminDashboard() {
  const handleAddShoe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const imageFile = formData.get('image') as File;

    if (!imageFile || imageFile.size === 0) {
      alert('Please select an image file.');
      return;
    }

    const fileName = `${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage.from('shoe-images').upload(fileName, imageFile);

    if (uploadError) {
      alert('Error uploading image: ' + uploadError.message);
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
      window.location.reload(); // Refresh to see the new shoe
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <form onSubmit={handleAddShoe} className="bg-gray-800 p-6 rounded-lg max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">Add New Shoe</h2>
        <input name="name" placeholder="Name" className="w-full p-2 mb-3 bg-gray-700 rounded" required />
        <input name="brand" placeholder="Brand" className="w-full p-2 mb-3 bg-gray-700 rounded" required />
        <input name="price" type="number" placeholder="Price" className="w-full p-2 mb-3 bg-gray-700 rounded" required />
        <textarea name="description" placeholder="Description" className="w-full p-2 mb-3 bg-gray-700 rounded" required />
        <input name="image" type="file" className="w-full p-2 mb-4 bg-gray-700 rounded" required />
        <button type="submit" className="w-full p-3 bg-green-600 rounded font-bold hover:bg-green-500">
          Add Shoe
        </button>
      </form>
    </div>
  );
}