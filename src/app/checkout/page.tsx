"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { Lock, CreditCard, Box, MapPin, ChevronLeft, QrCode } from "lucide-react";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'boleto'>('credit_card');

  // Hardcoded shipping for the mock, in reality this comes from context or state passed from Cart
  const shippingCost = 15.90; 
  const total = subtotal + shippingCost;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    alert("O Gateway de pagamento ainda será integrado! Este é apenas o frontend visual.");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 flex flex-col pt-12 md:flex-row gap-12 font-mono pb-24">
      
      {/* LEFT COLUMN: FORMS */}
      <div className="w-full md:w-3/5 flex flex-col gap-12">
        
        <div className="flex flex-col gap-4">
          <Link href="/carrinho" className="flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 uppercase transition-opacity w-fit">
            <ChevronLeft className="w-4 h-4" /> Voltar ao Carrinho
          </Link>
          <div className="border-b-2 border-foreground pb-4 flex items-center justify-between">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Checkout</h1>
            <Lock className="w-6 h-6 opacity-50" />
          </div>
        </div>

        <form id="checkout-form" onSubmit={handlePlaceOrder} className="flex flex-col gap-12">
          
          {/* SEC 1: IDENTIFICATION & ADDRESS */}
          <section className="flex flex-col gap-6">
            <h2 className="text-xl font-bold uppercase flex items-center gap-3 border-2 border-foreground bg-foreground text-background p-3">
              <MapPin className="w-5 h-5" /> 1. Endereço de Entrega
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase opacity-70">Nome Completo</label>
                <input required type="text" className="border-2 border-foreground p-3 outline-none focus:ring-2 ring-foreground bg-background" placeholder="João da Silva" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase opacity-70">CPF</label>
                <input required type="text" className="border-2 border-foreground p-3 outline-none focus:ring-2 ring-foreground bg-background" placeholder="000.000.000-00" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase opacity-70">E-mail</label>
                <input required type="email" className="border-2 border-foreground p-3 outline-none focus:ring-2 ring-foreground bg-background" placeholder="joao@email.com" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase opacity-70">Telefone / WhatsApp</label>
                <input required type="tel" className="border-2 border-foreground p-3 outline-none focus:ring-2 ring-foreground bg-background" placeholder="(00) 00000-0000" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div className="flex flex-col gap-1 md:col-span-1">
                <label className="text-xs font-bold uppercase opacity-70">CEP</label>
                <input required type="text" className="border-2 border-foreground p-3 outline-none focus:ring-2 ring-foreground bg-background" placeholder="00000-000" />
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-xs font-bold uppercase opacity-70">Endereço (Rua, Av)</label>
                <input required type="text" className="border-2 border-foreground p-3 outline-none focus:ring-2 ring-foreground bg-background" placeholder="Rua Exemplo" />
              </div>
              <div className="flex flex-col gap-1 md:col-span-1">
                <label className="text-xs font-bold uppercase opacity-70">Número</label>
                <input required type="text" className="border-2 border-foreground p-3 outline-none focus:ring-2 ring-foreground bg-background" placeholder="123" />
              </div>
              <div className="flex flex-col gap-1 md:col-span-1">
                <label className="text-xs font-bold uppercase opacity-70">Complemento</label>
                <input type="text" className="border-2 border-foreground p-3 outline-none focus:ring-2 ring-foreground bg-background" placeholder="Apto 4" />
              </div>
              <div className="flex flex-col gap-1 md:col-span-1">
                <label className="text-xs font-bold uppercase opacity-70">Bairro</label>
                <input required type="text" className="border-2 border-foreground p-3 outline-none focus:ring-2 ring-foreground bg-background" placeholder="Centro" />
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-xs font-bold uppercase opacity-70">Cidade</label>
                <input required type="text" className="border-2 border-foreground p-3 outline-none focus:ring-2 ring-foreground bg-background" placeholder="São Paulo" />
              </div>
              <div className="flex flex-col gap-1 md:col-span-1">
                <label className="text-xs font-bold uppercase opacity-70">UF</label>
                <input required type="text" className="border-2 border-foreground p-3 outline-none focus:ring-2 ring-foreground bg-background" placeholder="SP" maxLength={2} />
              </div>
            </div>
          </section>

          {/* SEC 2: PAYMENT METHOD */}
          <section className="flex flex-col gap-6">
            <h2 className="text-xl font-bold uppercase flex items-center gap-3 border-2 border-foreground bg-foreground text-background p-3">
              <CreditCard className="w-5 h-5" /> 2. Pagamento
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`border-2 p-4 font-bold uppercase flex flex-col items-center gap-3 transition-colors ${paymentMethod === 'credit_card' ? 'border-foreground bg-foreground/10' : 'border-gray-200 hover:border-foreground/50 text-gray-400 hover:text-foreground'}`}
              >
                <CreditCard className="w-8 h-8" /> Cartão
              </button>
              <button 
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`border-2 p-4 font-bold uppercase flex flex-col items-center gap-3 transition-colors ${paymentMethod === 'pix' ? 'border-foreground bg-foreground/10' : 'border-gray-200 hover:border-foreground/50 text-gray-400 hover:text-foreground'}`}
              >
                <QrCode className="w-8 h-8" /> PIX <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full">-5% OFF</span>
              </button>
              <button 
                type="button"
                onClick={() => setPaymentMethod('boleto')}
                className={`border-2 p-4 font-bold uppercase flex flex-col items-center gap-3 transition-colors ${paymentMethod === 'boleto' ? 'border-foreground bg-foreground/10' : 'border-gray-200 hover:border-foreground/50 text-gray-400 hover:text-foreground'}`}
              >
                <Box className="w-8 h-8" /> Boleto
              </button>
            </div>

            {/* Credit Card Form Mock */}
            {paymentMethod === 'credit_card' && (
              <div className="border-2 border-foreground p-6 flex flex-col gap-4 mt-2 bg-foreground/5 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase opacity-70">Número do Cartão</label>
                  <input required placeholder="0000 0000 0000 0000" className="border-2 border-foreground p-3 outline-none focus:ring-2 ring-foreground bg-background font-mono" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase opacity-70">Nome Impresso no Cartão</label>
                  <input required placeholder="JOAO DA SILVA" className="border-2 border-foreground p-3 outline-none focus:ring-2 ring-foreground bg-background uppercase uppercase font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase opacity-70">Validade</label>
                    <input required placeholder="MM/AA" className="border-2 border-foreground p-3 outline-none focus:ring-2 ring-foreground bg-background font-mono" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase opacity-70">CVV</label>
                    <input required placeholder="123" maxLength={4} type="password" className="border-2 border-foreground p-3 outline-none focus:ring-2 ring-foreground bg-background font-mono tracking-widest" />
                  </div>
                </div>
                <div className="flex flex-col gap-1 mt-2">
                    <label className="text-xs font-bold uppercase opacity-70">Parcelamento</label>
                    <select className="border-2 border-foreground p-3 outline-none focus:ring-2 ring-foreground bg-background font-mono cursor-pointer">
                      <option>1x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)} sem juros</option>
                      <option>2x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total / 2)} sem juros</option>
                      <option>3x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total / 3)} sem juros</option>
                    </select>
                </div>
              </div>
            )}

            {/* PIX Form Mock */}
            {paymentMethod === 'pix' && (
              <div className="border-2 border-foreground p-8 flex flex-col items-center justify-center gap-4 mt-2 bg-foreground/5 animate-in fade-in zoom-in-95 duration-200 text-center">
                 <QrCode className="w-16 h-16 opacity-80" />
                 <p className="font-bold uppercase text-sm">O código PIX será gerado na próxima tela após a confirmação do pedido.</p>
                 <p className="text-xs opacity-60">Você terá 15 minutos para efetuar o pagamento.</p>
              </div>
            )}

            {/* Boleto Form Mock */}
            {paymentMethod === 'boleto' && (
              <div className="border-2 border-foreground p-8 flex flex-col items-center justify-center gap-4 mt-2 bg-foreground/5 animate-in fade-in zoom-in-95 duration-200 text-center">
                 <Box className="w-16 h-16 opacity-80" />
                 <p className="font-bold uppercase text-sm">O boleto será gerado na próxima tela e enviado ao seu e-mail.</p>
                 <p className="text-xs opacity-60">Aprovação em até 3 dias úteis após o pagamento.</p>
              </div>
            )}
          </section>

        </form>
      </div>

      {/* RIGHT COLUMN: ORDER SUMMARY */}
      <div className="w-full md:w-2/5">
        <div className="border-2 border-foreground bg-foreground/5 p-6 md:p-8 flex flex-col sticky top-32">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-2 border-foreground pb-4">Seu Pedido</h2>
          
          <div className="flex flex-col gap-4 border-b-2 border-foreground pb-6 mb-6">
            {items.length === 0 ? (
               <div className="text-center opacity-50 text-sm font-bold uppercase py-4">Sem itens no pedido.</div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-20 bg-background border-2 border-foreground shrink-0 flex items-center justify-center overflow-hidden">
                     {item.image && item.image !== 'SEM IMG' ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                     ) : (
                        <span className="text-[8px] opacity-50 mix-blend-difference px-1 text-center">{item.image}</span>
                     )}
                  </div>
                  <div className="flex flex-col flex-1 justify-center">
                     <span className="font-bold uppercase text-xs line-clamp-2 leading-tight">{item.name}</span>
                     <span className="text-[10px] opacity-60 uppercase font-bold mt-1">Tam: {item.size} • Qtd: {item.qty}</span>
                     <span className="font-bold text-sm mt-1">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col gap-3 font-bold uppercase text-sm mb-6 border-b-2 border-foreground pb-6">
            <div className="flex justify-between opacity-80">
              <span>Subtotal</span>
              <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</span>
            </div>
            <div className="flex justify-between opacity-80">
              <span>Frete (Estimativa)</span>
              <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shippingCost)}</span>
            </div>
          </div>

          <div className="flex justify-between text-2xl font-black uppercase tracking-tighter mb-8">
            <span>Total</span>
            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(paymentMethod === 'pix' ? total * 0.95 : total)}</span>
          </div>

          <button 
            type="submit" 
            form="checkout-form"
            className="w-full border-2 border-foreground bg-foreground text-background py-5 font-bold tracking-widest uppercase hover:bg-background hover:text-foreground transition-all flex items-center justify-center text-lg gap-2"
          >
            <Lock className="w-5 h-5" /> Finalizar Pedido
          </button>
          
          <p className="text-[10px] text-center opacity-50 uppercase font-bold mt-4 leading-relaxed">
            Seus dados pessoais serão usados para processar seu pedido, apoiar sua experiência em todo este site e para outros fins descritos em nossa política de privacidade.
          </p>
        </div>
      </div>

    </div>
  );
}
