"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items } = useCart();
  const cartItemsCount = items.reduce((acc, item) => acc + item.qty, 0);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-foreground text-background border-b-2 border-foreground flex items-center justify-between px-6 py-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <img src="/logo-branca.png" alt="CostaLAB" className="h-6 md:h-8 w-auto object-contain scale-[1.7] md:scale-[2] origin-left dark:invert" />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-sm uppercase tracking-widest font-bold">
          <Link href="/produtos" className="hover:underline underline-offset-4">Catálogo</Link>
          <Link href="/sobre" className="hover:underline underline-offset-4">A Marca</Link>
          <Link href="/contato" className="hover:underline underline-offset-4">Contato</Link>
        </nav>

        {/* ICONS */}
        <div className="flex items-center gap-4">
          <Link href="/meus-pedidos" className="hidden md:block">
            <User className="w-6 h-6 stroke-[2px]" />
          </Link>
          <Link href="/carrinho" className="relative">
            <ShoppingBag className="w-6 h-6 stroke-[2px]" />
            <span className="absolute -top-2 -right-2 bg-background text-foreground text-xs font-mono font-bold w-5 h-5 flex items-center justify-center border-2 border-foreground">
              {cartItemsCount}
            </span>
          </Link>
          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6 stroke-[2px]" />
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-background text-foreground flex flex-col pt-20 px-6 uppercase font-mono tracking-widest font-bold">
          <button 
            className="absolute top-4 right-6"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-8 h-8 stroke-[3px]" />
          </button>
          <nav className="flex flex-col gap-6 text-3xl mt-12">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Início</Link>
            <Link href="/produtos" onClick={() => setIsMobileMenuOpen(false)}>Catálogo</Link>
            <Link href="/sobre" onClick={() => setIsMobileMenuOpen(false)}>A Marca</Link>
            <Link href="/contato" onClick={() => setIsMobileMenuOpen(false)}>Contato</Link>
          </nav>

          <div className="mt-auto mb-12 flex flex-col gap-4 border-t-2 border-foreground pt-8">
            <Link href="/meus-pedidos" className="text-xl flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
              <User className="w-6 h-6 stroke-[2px]" /> Minha Conta
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
