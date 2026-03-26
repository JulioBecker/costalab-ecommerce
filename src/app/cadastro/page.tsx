"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Sign up user Auth with metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.name,
          phone: formData.phone
        }
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // O Supabase criará automaticamente a tabela do perfil via Trigger 
      // Não precisamos mais inserir manualmente aqui e violar o RLS!
      router.push("/meus-pedidos");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-6 py-24 flex flex-col pt-24">
      <div className="border-2 border-foreground bg-background p-8 font-mono shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#FFF]">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 border-b-2 border-foreground pb-4 text-center">
          Cadastro
        </h1>
        
        {error && (
          <div className="mb-6 p-4 border-2 border-red-500 text-red-500 bg-red-50 font-bold text-xs uppercase text-center">
             {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-6 uppercase font-bold text-xs tracking-widest">
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Nome Completo</label>
            <input 
              type="text" 
              id="name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="border-2 border-foreground bg-background p-4 outline-none focus:ring-2 ring-foreground ring-offset-2 ring-offset-background" 
              required 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email">E-mail</label>
            <input 
              type="email" 
              id="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="border-2 border-foreground bg-background p-4 outline-none focus:ring-2 ring-foreground ring-offset-2 ring-offset-background" 
              required 
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Senha</label>
            <input 
              type="password" 
              id="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="border-2 border-foreground bg-background p-4 outline-none focus:ring-2 ring-foreground ring-offset-2 ring-offset-background" 
              required 
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 border-2 border-foreground bg-foreground text-background p-4 hover:bg-background hover:text-foreground transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 font-bold tracking-widest uppercase"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Criar Conta <ArrowRight className="w-4 h-4 stroke-[3px]" /></>}
          </button>

          <p className="text-[10px] opacity-50 mt-2 text-center leading-relaxed">
            AO CRIAR UMA CONTA, VOCÊ CONCORDA COM OS NOSSOS TERMOS E POLÍTICA DE PRIVACIDADE.
          </p>
        </form>
      </div>

      <div className="mt-8 text-center font-mono text-xs uppercase font-bold tracking-widest flex flex-col items-center gap-4">
        <span className="opacity-50">Já possui conta?</span>
        <Link 
          href="/login" 
          className="w-full border-2 border-foreground py-4 hover:bg-foreground hover:text-background transition-all"
        >
          Fazer Login
        </Link>
      </div>
    </div>
  );
}
