"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CartProvider } from "@/contexts/CartContext";

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Verifica se a rota atual é do painel administrativo
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <main className="flex-1 flex w-full min-h-screen bg-gray-50">
        {children}
      </main>
    );
  }

  // Rotas Públicas do E-commerce (exibe Navbar, Footer e WhatsApp)
  return (
    <CartProvider>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-start w-full pt-[72px]">
        {children}
      </main>
      <WhatsAppButton />
      <Footer />
    </CartProvider>
  );
}
