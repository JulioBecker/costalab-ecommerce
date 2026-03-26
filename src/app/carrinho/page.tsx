"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, ShoppingBag, Truck, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();
  
  const [cep, setCep] = useState("");
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<number>(0); // 0 means not selected

  const handleCalculateShipping = async () => {
    if (cep.length < 8) return;
    setShippingLoading(true);
    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cep, items })
      });
      const data = await res.json();
      
      if (data.rates && Array.isArray(data.rates)) {
        setShippingOptions(data.rates);
        if (data.rates.length > 0) {
          setSelectedShipping(data.rates[0].price);
        }
      } else {
        alert(data.error || "Erro ao calcular o frete.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de comunicação com o servidor de fretes.");
    } finally {
      setShippingLoading(false);
    }
  };

  const cleanCep = (val: string) => val.replace(/\D/g, '').slice(0, 8);

  const total = subtotal + selectedShipping;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 flex flex-col pt-12">
      <div className="border-b-2 border-foreground pb-8 mb-8 flex items-center gap-4">
        <ShoppingBag className="w-10 h-10 stroke-[3px]" />
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Carrinho</h1>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6 font-mono font-bold uppercase text-center">
          <p className="text-2xl opacity-50">Seu carrinho está vazio.</p>
          <Link href="/produtos" className="border-2 border-foreground bg-foreground text-background px-8 py-4 hover:bg-background hover:text-foreground transition-all">
            Explorar Catálogo
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
           {/* ITEMS LIST (Left) */}
           <div className="w-full lg:w-2/3 flex flex-col gap-6">
              <div className="hidden sm:grid grid-cols-12 gap-4 font-mono font-bold uppercase text-xs tracking-widest border-b-2 border-foreground pb-4 opacity-50">
                <div className="col-span-6">Produto</div>
                <div className="col-span-2 text-center">Tamanho</div>
                <div className="col-span-2 text-center">Qtd</div>
                <div className="col-span-2 text-right">Preço</div>
              </div>

              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center border-b-2 border-foreground py-6 font-mono font-bold uppercase">
                  {/* Product Info */}
                  <div className="col-span-1 border-2 border-foreground sm:col-span-6 flex gap-4 h-full relative">
                    <div className="w-24 h-32 shrink-0 bg-foreground/5 flex items-center justify-center border-r-2 border-foreground overflow-hidden">
                       {item.image && item.image !== 'SEM IMG' ? (
                         <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                       ) : (
                         <span className="text-[10px] opacity-50 mix-blend-difference px-2 text-center">{item.image}</span>
                       )}
                    </div>
                    <div className="flex flex-col justify-center gap-2 p-2">
                      <Link href={`/produtos/${item.productId}`} className="hover:underline underline-offset-4 line-clamp-2 leading-tight">
                        {item.name}
                      </Link>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-2 text-xs opacity-50 hover:opacity-100 hover:text-red-500 mt-2 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Remover
                      </button>
                    </div>
                  </div>
                  
                  {/* Size */}
                  <div className="col-span-1 sm:col-span-2 flex justify-between sm:justify-center items-center">
                    <span className="sm:hidden opacity-50 text-xs">Tamanho:</span>
                    <span className="text-lg bg-foreground text-background px-3 py-1">{item.size}</span>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-1 sm:col-span-2 flex justify-between sm:justify-center items-center">
                    <span className="sm:hidden opacity-50 text-xs">Qtd:</span>
                    <div className="flex items-center border-2 border-foreground">
                      <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="px-3 py-1 hover:bg-foreground hover:text-background transition-colors">-</button>
                      <span className="px-4 py-1 border-x-2 border-foreground">{item.qty}</span>
                      <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="px-3 py-1 hover:bg-foreground hover:text-background transition-colors">+</button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-1 sm:col-span-2 flex justify-between sm:justify-end items-center text-lg">
                    <span className="sm:hidden opacity-50 text-xs">Total:</span>
                    <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.qty)}</span>
                  </div>
                </div>
              ))}
           </div>

           {/* ORDER SUMMARY (Right) */}
           <div className="w-full lg:w-1/3">
             <div className="border-2 border-foreground bg-foreground/5 p-8 flex flex-col font-mono font-bold uppercase sticky top-32">
               <h2 className="text-2xl tracking-tighter mb-8 border-b-2 border-foreground pb-4">Resumo do Pedido</h2>
               
               <div className="flex justify-between mb-4 text-sm opacity-80">
                 <span>Subtotal</span>
                 <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</span>
               </div>
               
               {/* Shipping Calculator */}
               <div className="border-y-2 border-foreground py-6 my-4 flex flex-col gap-4">
                  <span className="flex items-center gap-2 text-sm"><Truck className="w-4 h-4" /> Calcular Frete</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="00000-000" 
                      maxLength={9}
                      value={cep}
                      onChange={(e) => setCep(cleanCep(e.target.value))}
                      className="border-2 border-foreground bg-background p-2 w-full outline-none focus:ring-2 ring-foreground"
                    />
                    <button 
                      onClick={handleCalculateShipping}
                      className="bg-foreground text-background px-4 hover:opacity-80 transition-all flex items-center justify-center shrink-0"
                    >
                      {shippingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'OK'}
                    </button>
                  </div>
                  
                  {shippingOptions.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2">
                      {shippingOptions.map((opt: any, i: number) => {
                         const val = opt.price;
                         if (isNaN(val)) return null;
                         const isSelected = selectedShipping === val;
                         return (
                           <label key={i} className={`flex justify-between items-center text-xs p-2 border-2 cursor-pointer transition-colors ${isSelected ? 'border-foreground bg-foreground/10' : 'border-transparent hover:bg-foreground/5'}`}>
                             <div className="flex items-center gap-2">
                               <input 
                                 type="radio" 
                                 name="shipping" 
                                 checked={isSelected} 
                                 onChange={() => setSelectedShipping(val)} 
                                 className="accent-foreground shrink-0"
                               />
                               <span className="line-clamp-2 leading-tight">{opt.name} ({opt.deadline} dias)</span>
                             </div>
                             <span className="shrink-0">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)}</span>
                           </label>
                         );
                      })}
                    </div>
                  )}
               </div>

               <div className="flex justify-between mb-8 text-2xl tracking-tight mt-4">
                 <span>Total</span>
                 <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
               </div>

               <Link href="/checkout" className="w-full border-2 border-foreground bg-foreground text-background py-5 tracking-widest hover:bg-background hover:text-foreground transition-all flex items-center justify-center text-lg mb-4">
                 Finalizar Compra
               </Link>

               <div className="text-[10px] text-center opacity-50 leading-relaxed mt-4">
                 PAGAMENTO SEGURO VIA STRIPE/MERCADOPAGO. AO PROSSEGUIR, VOCÊ CONCORDA COM OS NOSSOS TERMOS E POLÍTICAS DE DEVOLUÇÃO.
               </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}

