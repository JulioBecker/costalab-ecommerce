"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DataTable } from "@/components/admin/DataTable";
import { X, Loader2, Trash2 } from "lucide-react";

export default function AdminRastreioPage() {
  const [data, setData] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  
  const [formData, setFormData] = useState({ 
    sale_id: '', 
    tracking_number: '', 
    carrier: 'Correios'
  });

  useEffect(() => {
    fetchData();
    fetchRelations();
  }, []);

  async function fetchRelations() {
    const { data: s } = await supabase.from('sales').select('id, customer_id, created_at, total_amount');
    const { data: profiles } = await supabase.from('profiles').select('id, full_name');
    const { data: customers } = await supabase.from('customers').select('id, name');

    const mappedSales = (s || []).map(sale => {
      let customerName = 'Cliente Desconhecido';
      const p = profiles?.find(pr => pr.id === sale.customer_id);
      if (p) customerName = p.full_name;
      else {
        const c = customers?.find(cu => cu.id === sale.customer_id);
        if (c) customerName = c.name;
      }
      return { ...sale, customerName };
    });

    setSales(mappedSales);
  }

  async function fetchData() {
    setIsLoading(true);
    const { data: rows } = await supabase
      .from('tracking')
      .select('*')
      .order('created_at', { ascending: false });

    // Manually map to sales and customerName
    const { data: s } = await supabase.from('sales').select('id, customer_id, total_amount');
    const { data: profiles } = await supabase.from('profiles').select('id, full_name');
    const { data: customers } = await supabase.from('customers').select('id, name');

    const mappedRows = (rows || []).map(trk => {
      let customerName = 'Desconhecido';
      let saleAmount = 0;
      const sale = s?.find(sale => sale.id === trk.sale_id);
      
      if (sale) {
        saleAmount = sale.total_amount;
        const p = profiles?.find(pr => pr.id === sale.customer_id);
        if (p) customerName = p.full_name;
        else {
          const c = customers?.find(cu => cu.id === sale.customer_id);
          if (c) customerName = c.name;
        }
      }
      return { ...trk, customerName, saleAmount };
    });

    setData(mappedRows);
    setIsLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.from('tracking').insert([
      { ...formData, shipped_date: new Date().toISOString() }
    ]);
    setIsSubmitting(false);
    
    if (!error) {
      setIsModalOpen(false);
      setFormData({ sale_id: '', tracking_number: '', carrier: 'Correios' });
      fetchData();
    } else {
      alert("Erro ao salvar: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Excluir este código de rastreio?")) {
      await supabase.from('tracking').delete().eq('id', id);
      fetchData();
    }
  };

  const filteredData = data.filter(item => 
    item.tracking_number?.toLowerCase().includes(search.toLowerCase()) ||
    item.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <DataTable 
        title="Rastreio / Logística"
        data={filteredData}
        isLoading={isLoading}
        searchFilter={search}
        setSearchFilter={setSearch}
        onAdd={() => setIsModalOpen(true)}
        columns={[
          { key: 'customer', label: 'PEDIDO (CLIENTE)', render: (row) => <span className="font-semibold">{row.customerName}</span> },
          { key: 'tracking', label: 'CÓDIGO DE RASTREIO', render: (row) => <span className="font-mono font-bold text-blue-600">{row.tracking_number}</span> },
          { key: 'carrier', label: 'TRANSPORTADORA', render: (row) => row.carrier },
          { key: 'shipped_date', label: 'DATA DE ENVIO', render: (row) => row.shipped_date ? new Date(row.shipped_date).toLocaleDateString('pt-BR') : 'Pendente' },
          { key: 'actions', label: 'AÇÕES', render: (row) => (
            <div className="flex gap-3 text-gray-400">
               <button onClick={() => handleDelete(row.id)} className="hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          )}
        ]}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 font-sans">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Vincular Rastreio</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
               
               <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                 Venda Correspondente *
                 <select required value={formData.sale_id} onChange={e=>setFormData({...formData, sale_id: e.target.value})} className="border border-gray-300 rounded-md p-2 outline-none">
                   <option value="">Selecione Venda/Pedido</option>
                   {sales.map(s => <option key={s.id} value={s.id}>{s.customerName} ({new Date(s.created_at).toLocaleDateString('pt-BR')}) - R$ {s.total_amount}</option>)}
                 </select>
               </label>
               
               <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                 Código de Rastreio *
                 <input required type="text" value={formData.tracking_number} onChange={e=>setFormData({...formData, tracking_number: e.target.value})} className="border border-gray-300 rounded-md p-2 outline-none font-mono" placeholder="Ex: QA123456789BR" />
               </label>
               
               <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                 Transportadora *
                 <input required type="text" value={formData.carrier} onChange={e=>setFormData({...formData, carrier: e.target.value})} className="border border-gray-300 rounded-md p-2 outline-none" placeholder="Ex: Correios, Loggi" />
               </label>

               <button type="submit" disabled={isSubmitting} className="mt-4 w-full bg-white text-gray-900 border border-gray-200 shadow-sm py-2 rounded-md font-medium text-sm hover:bg-gray-50 flex justify-center gap-2">
                 {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Código'}
               </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
