import { supabase } from '../../../lib/supabaseClient';
import Link from 'next/link';

// This function tells Next.js to fetch data for the page at build time for speed
export async function generateStaticParams() {
  const { data: shoes } = await supabase.from('shoes').select('id');
  return shoes?.map(({ id }) => ({ id: id.toString() })) || [];
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { data: shoe } = await supabase
    .from('shoes')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!shoe) {
    return <p>Shoe not found.</p>;
  }

  return (
    <div className="min-h-screen">
      <header className="absolute top-0 left-0 w-full z-10 p-8">
        <Link href="/" className="text-2xl font-extrabold uppercase tracking-widest hover:text-gray-300">RANDOM</Link>
      </header>
      
      <main className="flex flex-col md:flex-row items-center justify-center min-h-screen p-8 pt-24">
        <div className="md:w-1/2 p-8">
          <img src={shoe.image_url} alt={shoe.name} className="w-full rounded-lg shadow-2xl"/>
        </div>
        <div className="md:w-1/2 p-8">
          <p className="text-lg uppercase text-gray-400">{shoe.brand}</p>
          <h1 className="text-6xl font-extrabold my-2">{shoe.name}</h1>
          <p className="text-5xl font-bold text-brand-light mb-6">${shoe.price}</p>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">{shoe.description}</p>
          <button className="w-full p-4 bg-brand-purple rounded-lg font-bold text-xl hover:bg-opacity-80 transition-all">Add to Cart</button>
        </div>
      </main>
    </div>
  );
}