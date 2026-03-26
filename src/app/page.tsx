"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/ui/ProductCard";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatest() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchLatest();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <section className="h-screen w-full flex flex-col justify-center items-center border-b-2 border-foreground relative overflow-hidden bg-background text-foreground pt-16">
        <div className="z-10 text-center px-4 flex flex-col items-center w-full max-w-5xl">
          <img 
            src="/logo-preta.png" 
            alt="CostaLAB" 
            className="w-full px-4 md:px-12 h-auto object-contain drop-shadow-xl select-none dark:invert" 
            draggable={false}
          />
          <p className="font-mono text-sm md:text-xl tracking-widest uppercase font-bold max-w-2xl mt-8">
            Raw Aesthetics. High Contrast. Brutal Minimalism.
          </p>
          <Link 
            href="/produtos" 
            className="mt-12 border-2 border-foreground px-8 py-4 font-mono font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors flex items-center gap-4"
          >
            Ver Coleção <ArrowRight className="w-5 h-5 stroke-[3px]" />
          </Link>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 w-full max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12 border-b-2 border-foreground pb-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">Lançamentos</h2>
          <Link href="/produtos" className="font-mono font-bold tracking-widest uppercase text-sm hover:underline underline-offset-4 hidden md:block">
            Ver Todos
          </Link>
        </div>

        {loading ? (
           <div className="w-full py-24 flex justify-center items-center"><Loader2 className="w-12 h-12 stroke-[3px] animate-spin" /></div>
        ) : products.length === 0 ? (
           <div className="w-full py-24 flex justify-center items-center font-mono font-bold uppercase text-2xl opacity-30">Nenhum lançamento no momento.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                name={product.name}
                price={product.price}
                category={product.category}
                imageUrl={product.image_url}
              />
            ))}
          </div>
        )}
      </section>

      <section className="border-t-2 border-foreground py-24 px-6 bg-foreground text-background mt-12">
        <div className="max-w-4xl mx-auto flex flex-col gap-8 text-center items-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Manifesto</h2>
          <p className="text-lg md:text-2xl font-mono uppercase font-bold leading-relaxed">
            Nós removemos as cores para revelar a estrutura. Sem distrações. Apenas cortes precisos, materiais pesados e silhuetas que falam por si. Mais do que roupa, um statement.
          </p>
          <Link href="/sobre" className="mt-4 px-8 py-4 border-2 border-background font-mono font-bold uppercase tracking-widest hover:bg-background hover:text-foreground transition-colors">
            Conheça o Lab
          </Link>
        </div>
      </section>
    </div>
  );
}
