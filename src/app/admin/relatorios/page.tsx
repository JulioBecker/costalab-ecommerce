"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Download, FileText, Loader2 } from "lucide-react";

export default function AdminReportsPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const downloadCSV = (data: any[], filename: string) => {
    if (!data || !data.length) {
      alert("Não há dados para exportar neste relatório.");
      return;
    }
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(row => 
      Object.values(row).map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportVendas = async () => {
    setLoading('vendas');
    const { data } = await supabase.from('sales').select('*, customers(name)');
    const parsed = data?.map(d => ({
      ID: d.id,
      Data: new Date(d.created_at).toLocaleDateString('pt-BR'),
      Cliente: d.customers?.name || 'Vazio',
      Status: d.status,
      Valor_Total: d.total_amount,
      Lucro: d.profit
    }));
    downloadCSV(parsed || [], "relatorio_vendas");
    setLoading(null);
  };

  const handleExportEstoque = async () => {
    setLoading('estoque');
    const { data } = await supabase.from('inventory').select('*, products(name, code, team)');
    const parsed = data?.map(d => ({
      Produto: d.products?.name,
      Codigo: d.products?.code,
      Time: d.products?.team,
      Tamanho: d.size,
      Quantidade: d.quantity,
      Status: d.status
    }));
    downloadCSV(parsed || [], "relatorio_estoque");
    setLoading(null);
  };

  const handleExportClientes = async () => {
    setLoading('clientes');
    const { data } = await supabase.from('customers').select('*');
    const parsed = data?.map(d => ({
      Nome: d.name,
      Telefone: d.phone,
      Origem: d.origin,
      Data_Cadastro: new Date(d.created_at).toLocaleDateString('pt-BR')
    }));
    downloadCSV(parsed || [], "relatorio_clientes");
    setLoading(null);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 font-sans text-gray-900 w-full">
      <h1 className="text-3xl font-semibold tracking-tight border-b border-gray-200 pb-4">
        Extração de Relatórios
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        
        {/* Vendas */}
        <div className="border border-gray-200 bg-white p-6 rounded-xl flex flex-col gap-4 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg"><FileText className="w-6 h-6 text-blue-600" /></div>
            <div className="flex flex-col">
               <h2 className="font-semibold text-lg text-gray-900 leading-tight">Vendas e Faturamento</h2>
               <p className="text-sm text-gray-500 mt-1">Extração completa de todas as vendas, separadas por status, cliente e lucratividade.</p>
            </div>
          </div>
          <button onClick={handleExportVendas} disabled={loading === 'vendas'} className="mt-auto flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-200 shadow-sm w-full py-2.5 font-medium text-sm rounded-md hover:bg-gray-50 transition-colors disabled:opacity-70">
            {loading === 'vendas' ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Download className="w-4 h-4" /> Exportar CSV</>}
          </button>
        </div>

        {/* Estoque */}
        <div className="border border-gray-200 bg-white p-6 rounded-xl flex flex-col gap-4 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-indigo-50 rounded-lg"><FileText className="w-6 h-6 text-indigo-600" /></div>
            <div className="flex flex-col">
               <h2 className="font-semibold text-lg text-gray-900 leading-tight">Posição de Estoque</h2>
               <p className="text-sm text-gray-500 mt-1">Gere a tabela atualizada de todo o inventário físico, segmentado por produto e tamanho.</p>
            </div>
          </div>
          <button onClick={handleExportEstoque} disabled={loading === 'estoque'} className="mt-auto flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-200 shadow-sm w-full py-2.5 font-medium text-sm rounded-md hover:bg-gray-50 transition-colors disabled:opacity-70">
            {loading === 'estoque' ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Download className="w-4 h-4" /> Exportar CSV</>}
          </button>
        </div>

        {/* Clientes */}
        <div className="border border-gray-200 bg-white p-6 rounded-xl flex flex-col gap-4 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-emerald-50 rounded-lg"><FileText className="w-6 h-6 text-emerald-600" /></div>
            <div className="flex flex-col">
               <h2 className="font-semibold text-lg text-gray-900 leading-tight">Base de Clientes (CRM)</h2>
               <p className="text-sm text-gray-500 mt-1">Download de todos os leads cadastrados para importação em outros sistemas ou Excel.</p>
            </div>
          </div>
          <button onClick={handleExportClientes} disabled={loading === 'clientes'} className="mt-auto flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-200 shadow-sm w-full py-2.5 font-medium text-sm rounded-md hover:bg-gray-50 transition-colors disabled:opacity-70">
            {loading === 'clientes' ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Download className="w-4 h-4" /> Exportar CSV</>}
          </button>
        </div>

      </div>
    </div>
  );
}
