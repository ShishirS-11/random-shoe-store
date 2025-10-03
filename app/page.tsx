import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export const revalidate = 60;

export default async function HomePage() {
  const { data: shoes } = await supabase.from('shoes').select('*');

  return (
    <div className="min-h-screen">
      <header className="absolute top-0 left-0 w-full z-10 p-8">
        <h1 className="text-2xl font-extrabold uppercase tracking-widest">RANDOM</h1>
      </header>
      <section 
        className="h-screen flex flex-col justify-center items-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2912&auto=format&fit=crop')" }}
      >
        <div className="bg-black bg-opacity-50 p-12 rounded-lg">
          <h2 className="text-6xl font-extrabold uppercase tracking-tighter">Step Into The Future</h2>
          <p className="text-xl mt-4 text-gray-300">Unmatched style. Unbeatable performance.</p>
        </div>
      </section>
      <main className="max-w-7xl mx-auto p-8 md:p-12">
        <h3 className="text-4xl font-bold mb-10 text-center uppercase tracking-wider">Latest Drops</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shoes?.map((shoe) => (
            <Link href={`/product/${shoe.id}`} key={shoe.id}>
              <div className="bg-brand-gray group rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-brand-purple/20">
                <div className="w-full h-80 overflow-hidden">
                  <img src={shoe.image_url} alt={shoe.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="p-6">
                  <p className="text-sm uppercase text-gray-400">{shoe.brand}</p>
                  <h2 className="text-2xl font-bold truncate">{shoe.name}</h2>
                  <p className="text-3xl font-semibold mt-2 text-brand-light">${shoe.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}