"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, Package, LogOut } from "lucide-react";

export default function MyOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }

      // Check role
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      
      // Se for admin, manda pro dashboard de admin real
      if (data && data.role === 'admin') {
         router.push("/admin");
         return;
      }

      setProfile(data);
      setLoading(false);
    }
    
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return <div className="min-h-[70vh] flex items-center justify-center"><Loader2 className="w-12 h-12 stroke-[3px] animate-spin" /></div>
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-24 flex flex-col pt-12 md:flex-row gap-12">
      
      {/* SIDEBAR CLIENTE */}
      <aside className="w-full md:w-1/4 flex flex-col gap-8">
        <div className="border-2 border-foreground bg-background p-6 font-mono uppercase">
           <span className="opacity-50 text-xs font-bold tracking-widest block mb-2">MINHA CONTA</span>
           <h2 className="text-xl font-bold tracking-tighter truncate">{profile?.full_name || 'CLIENTE RAW'}</h2>
           <p className="text-xs opacity-60 mt-1 lowercase">{profile?.id ? 'Autenticado' : ''}</p>
        </div>

        <nav className="flex flex-col font-mono text-sm uppercase font-bold tracking-widest">
           <button className="border-2 border-foreground bg-foreground text-background p-4 flex items-center justify-between hover:bg-background hover:text-foreground transition-all text-left">
             Meus Pedidos <Package className="w-4 h-4" />
           </button>
           <button onClick={handleLogout} className="border-x-2 border-b-2 border-foreground bg-background text-foreground p-4 flex items-center justify-between hover:bg-foreground hover:text-background transition-all text-left">
             Sair <LogOut className="w-4 h-4" />
           </button>
        </nav>
      </aside>

      {/* HISTÓRICO DE PEDIDOS */}
      <main className="w-full md:w-3/4 flex flex-col">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-8 border-b-2 border-foreground pb-4">
          Meus Pedidos
        </h1>

        <div className="border-2 border-foreground bg-background p-12 flex flex-col items-center justify-center text-center font-mono uppercase">
           <Package className="w-16 h-16 stroke-[1px] mb-6 opacity-30" />
           <h3 className="text-xl font-bold tracking-widest mb-2">Nenhum pedido encontrado</h3>
           <p className="opacity-50 text-sm max-w-sm leading-relaxed">SEU HISTÓRICO DE COMPRAS APARECERÁ AQUI ASSIM QUE VOCÊ FINALIZAR O PRIMEIRO PEDIDO.</p>
        </div>
      </main>
    </div>
  );
}
