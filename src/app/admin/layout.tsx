"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, Users, Truck, PackageSearch, 
  ArrowDownToLine, Map, DollarSign, Archive, 
  FileText, LogOut, Menu, Loader2
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // AUTH GUARD
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login?redirect=/admin");
        return;
      }
      // Aqui poderíamos checar se o role do usuário é 'admin' na tabela profiles.
      // Por enquanto, quem logar cai aqui (ideal para o dono testar primeiro).
      setIsLoading(false);
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const NAV_ITEMS = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/clientes", label: "Clientes", icon: Users },
    { href: "/admin/produtos", label: "Catálogo", icon: PackageSearch },
    { href: "/admin/rastreio", label: "Logística", icon: Map },
    { href: "/admin/vendas", label: "Vendas", icon: DollarSign },
    { href: "/admin/relatorios", label: "Relatórios", icon: FileText },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-black animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex font-sans !pt-0">
      {/* SIDEBAR CLEAN WHITE */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} shrink-0 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed h-screen z-50 shadow-sm`}
      >
        <div className="h-[72px] border-b border-gray-200 flex items-center px-4 shrink-0 overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? (
             <span className="font-bold text-xl tracking-tight text-gray-900 flex items-center w-full justify-between">
               CostaLAB
               <Menu className="w-5 h-5 text-gray-400" />
             </span>
          ) : (
             <Menu className="w-6 h-6 text-gray-500 mx-auto" />
          )}
        </div>

        <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-4 p-3 rounded-md transition-all text-sm font-medium ${
                  isActive 
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200' 
                    : 'text-gray-600 hover:bg-white hover:text-gray-900'
                }`}
                title={item.label}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-black' : 'text-gray-400'}`} />
                {isSidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-3 rounded-md text-red-600 hover:bg-red-50 transition-all font-medium text-sm"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">Sair do Sistema</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
