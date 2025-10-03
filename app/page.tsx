import { supabase } from '../lib/supabaseClient';

export const revalidate = 60; // Re-fetch data every 60 seconds

export default async function HomePage() {
  const { data: shoes } = await supabase.from('shoes').select('*');

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <main className="max-w-7xl mx-auto p-8">
        <h1 className="text-5xl font-bold mb-8 tracking-tighter">RANDOM</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shoes?.map((shoe) => (
            <div key={shoe.id} className="bg-gray-800 rounded-lg overflow-hidden">
              <img src={shoe.image_url} alt={shoe.name} className="w-full h-80 object-cover" />
              <div className="p-6">
                <h2 className="text-2xl font-bold">{shoe.name}</h2>
                <p className="text-gray-400">{shoe.brand}</p>
                <p className="text-3xl font-semibold mt-4">${shoe.price}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}