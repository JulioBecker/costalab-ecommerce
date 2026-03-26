"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/ui/ProductCard";
import { SlidersHorizontal, Search, Loader2 } from "lucide-react";

export default function CatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 flex flex-col pt-12">
      <div className="border-b-2 border-foreground pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2">Catálogo</h1>
          <p className="font-mono text-sm tracking-widest uppercase font-bold opacity-60">
            {products.length} itens disponíveis
          </p>
        </div>

        <div className="flex items-center gap-4 font-mono font-bold text-sm uppercase">
          <div className="flex items-center border-2 border-foreground px-4 py-3 w-full md:w-64 bg-background focus-within:ring-2 ring-foreground ring-offset-2 ring-offset-background transition-all">
            <Search className="w-4 h-4 mr-3" />
            <input 
              type="text" 
              placeholder="PESQUISAR..." 
              className="bg-transparent outline-none w-full placeholder:text-foreground/40"
            />
          </div>
          <button className="flex items-center gap-2 border-2 border-foreground px-4 py-3 hover:bg-foreground hover:text-background transition-colors shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden md:inline">Filtros</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 font-mono text-xs font-bold uppercase tracking-wider">
        <button className="border-2 border-foreground bg-foreground text-background px-4 py-2">
          Todos os Produtos
        </button>
        <button className="border-2 border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors">
          Masculino
        </button>
        <button className="border-2 border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors">
          Feminino
        </button>
      </div>

      {loading ? (
        <div className="w-full py-24 flex justify-center items-center">
          <Loader2 className="w-12 h-12 stroke-[3px] animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="w-full py-24 flex justify-center items-center font-mono font-bold uppercase text-2xl opacity-30 text-center">
          Nenhum produto cadastrado<br/>(Adicione no painel Admin)
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              name={product.name}
              price={product.price}
              category={product.category}
              imageUrl={product.image_url}
              isNew={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
