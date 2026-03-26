"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Ruler, Loader2, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/contexts/CartContext";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const { addToCart } = useCart();

  // Mock available sizes since inventory isn't wired perfectly yet
  const sizes = ["P", "M", "G", "GG"];

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
        
      if (!error && data) {
        setProduct(data);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 stroke-[3px] animate-spin" /></div>
  if (!product) return <div className="min-h-screen flex items-center justify-center font-mono font-bold text-2xl uppercase">Produto não encontrado</div>

  return (
    <>
      <div className="w-full mx-auto px-6 py-12 flex flex-col pt-12 md:flex-row gap-12 max-w-7xl">
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="aspect-[3/4] border-2 border-foreground bg-foreground/5 flex items-center justify-center relative overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
               <span className="font-mono text-2xl opacity-50 font-bold mix-blend-difference uppercase">SEM IMAGEM</span>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col pt-4">
          <div className="flex flex-col border-b-2 border-foreground pb-8 mb-8">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">{product.name}</h1>
            <span className="text-3xl font-mono block font-bold">
               {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
            </span>
            <p className="mt-6 font-mono font-bold opacity-80 uppercase leading-relaxed text-sm whitespace-pre-wrap">
              {product.description || "PRODUTO CLASSIC COSTALAB. ESTRUTURA RAW E ALTO CONTRASTE."}
            </p>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <div className="flex justify-between items-center font-mono font-bold uppercase text-sm">
              <span>Tamanho</span>
              <button 
                onClick={() => setIsSizeGuideOpen(true)}
                className="flex items-center gap-2 border-b border-foreground border-dashed pb-0.5 opacity-60 hover:opacity-100 transition-opacity"
              >
                <Ruler className="w-4 h-4" /> Guia de Medidas
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {sizes.map(size => (
                <button 
                  key={size}
                  className={`border-2 border-foreground py-3 font-mono font-bold text-lg uppercase transition-all ${
                    selectedSize === size 
                      ? 'bg-foreground text-background shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#FFF]' 
                      : 'bg-background text-foreground hover:bg-foreground/10'
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-auto">
            <button 
              className="w-full border-2 border-foreground bg-foreground text-background py-5 font-mono font-bold tracking-widest uppercase hover:bg-background hover:text-foreground transition-all flex items-center justify-center gap-4 text-lg"
              disabled={!selectedSize}
              onClick={() => {
                if (!selectedSize) return;
                addToCart({
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  size: selectedSize,
                  qty: 1,
                  image: product.image_url || 'SEM IMG'
                });
                router.push('/carrinho');
              }}
            >
              {selectedSize ? 'Adicionar ao Carrinho' : 'Selecione um Tamanho'}
            </button>
            <Link href="/produtos" className="w-full border-2 border-foreground bg-background text-foreground py-4 font-mono font-bold tracking-widest uppercase hover:bg-foreground hover:text-background transition-all flex items-center justify-center text-sm">
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>

      {/* GUIA DE MEDIDAS MODAL */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 font-mono">
          <div className="bg-background border-2 border-foreground w-full max-w-lg shadow-[8px_8px_0px_#000] dark:shadow-[8px_8px_0px_#FFF] relative overflow-hidden flex flex-col">
            
            <div className="flex items-center justify-between border-b-2 border-foreground p-4 bg-foreground text-background">
              <h2 className="font-bold uppercase tracking-widest flex items-center gap-2">
                <Ruler className="w-5 h-5" /> Guia de Medidas
              </h2>
              <button onClick={() => setIsSizeGuideOpen(false)} className="hover:opacity-70 transition-opacity">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm font-medium mb-6 uppercase opacity-80 leading-relaxed">
                As medidas podem variar em até 2cm. Recomendamos comparar as medidas com uma peça que você já possui.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border-2 border-foreground text-sm uppercase">
                  <thead>
                    <tr className="bg-foreground text-background">
                      <th className="p-3 border-r-2 border-background">Tamanho</th>
                      <th className="p-3 border-r-2 border-background">Tórax (cm)</th>
                      <th className="p-3 border-r-2 border-background">Comprimento (cm)</th>
                      <th className="p-3">Manga (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b-2 border-foreground hover:bg-foreground/5">
                      <td className="p-3 border-r-2 border-foreground font-bold">P</td>
                      <td className="p-3 border-r-2 border-foreground">50</td>
                      <td className="p-3 border-r-2 border-foreground">70</td>
                      <td className="p-3">20</td>
                    </tr>
                    <tr className="border-b-2 border-foreground hover:bg-foreground/5">
                      <td className="p-3 border-r-2 border-foreground font-bold">M</td>
                      <td className="p-3 border-r-2 border-foreground">52</td>
                      <td className="p-3 border-r-2 border-foreground">72</td>
                      <td className="p-3">21</td>
                    </tr>
                    <tr className="border-b-2 border-foreground hover:bg-foreground/5">
                      <td className="p-3 border-r-2 border-foreground font-bold">G</td>
                      <td className="p-3 border-r-2 border-foreground">54</td>
                      <td className="p-3 border-r-2 border-foreground">74</td>
                      <td className="p-3">22</td>
                    </tr>
                    <tr className="border-b-2 border-foreground hover:bg-foreground/5">
                      <td className="p-3 border-r-2 border-foreground font-bold">GG</td>
                      <td className="p-3 border-r-2 border-foreground">56</td>
                      <td className="p-3 border-r-2 border-foreground">76</td>
                      <td className="p-3">23</td>
                    </tr>
                    <tr className="hover:bg-foreground/5">
                      <td className="p-3 border-r-2 border-foreground font-bold">XG</td>
                      <td className="p-3 border-r-2 border-foreground">58</td>
                      <td className="p-3 border-r-2 border-foreground">78</td>
                      <td className="p-3">24</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
