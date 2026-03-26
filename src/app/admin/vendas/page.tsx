"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DataTable } from "@/components/admin/DataTable";
import { Loader2, Trash2, CheckCircle, PackageSearch } from "lucide-react";

export default function AdminVendasPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Sale details modal
  const [detailsModal, setDetailsModal] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    // Fetch sales and their related items
    const { data: rows } = await supabase
      .from('sales')
      .select(`
        *,
        order_items (
          id, quantity, size, price_at_time,
          products (name, code)
        )
      `)
      .order('created_at', { ascending: false });

    // Try to fetch customers/profiles manually to safely associate names bypassing strict FK issues if schema changed
    const { data: profiles } = await supabase.from('profiles').select('id, full_name');
    const { data: customers } = await supabase.from('customers').select('id, name');

    const mappedRows = (rows || []).map(sale => {
      // Find name in profiles or customers
      let customerName = 'Cliente Desconhecido';
      const p = profiles?.find(pr => pr.id === sale.customer_id);
      if (p) customerName = p.full_name;
      else {
        const c = customers?.find(cu => cu.id === sale.customer_id);
        if (c) customerName = c.name;
      }
      return { ...sale, customerName };
    });

    setData(mappedRows);
    setIsLoading(false);
  }

  const approveSaleAndDeductStock = async (sale: any) => {
    if (!confirm("Deseja marcar como PAGO e baixar o estoque automaticamente?")) return;
    
    // 1. Mark as PAGO
    const { error } = await supabase.from('sales').update({ status: 'PAGO' }).eq('id', sale.id);
    if (error) {
      alert("Erro ao aprovar venda: " + error.message);
      return;
    }

    // 2. Deduct inventory for each order_item
    if (sale.order_items && sale.order_items.length > 0) {
      for (const item of sale.order_items) {
        if (!item.products) continue;
        
        // Let's find inventory record to reduce
        // product id is in order_items
        // wait, we fetch order_items, let's get product_id manually
        const { data: orderItemWithPID } = await supabase.from('order_items').select('product_id').eq('id', item.id).single();
        if(!orderItemWithPID) continue;

        const { data: inv } = await supabase.from('inventory')
          .select('id, quantity')
          .eq('product_id', orderItemWithPID.product_id)
          .eq('size', item.size)
          .single();

        if (inv) {
          const newQty = Math.max(0, inv.quantity - item.quantity);
          await supabase.from('inventory').update({ quantity: newQty }).eq('id', inv.id);
        }
      }
      alert("Venda aprovada e estoque atualizado!");
    } else {
      alert("Venda aprovada! (Mas não haviam produtos atrelados para baixar estoque)");
    }
    fetchData();
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from('sales').update({ status: newStatus }).eq('id', id);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja realmente excluir este registro de venda?")) {
      await supabase.from('sales').delete().eq('id', id);
      fetchData();
    }
  };

  const filteredData = data.filter(item => 
    item.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    item.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <DataTable 
        title="Vendas / Faturamento"
        data={filteredData}
        isLoading={isLoading}
        searchFilter={search}
        setSearchFilter={setSearch}
        columns={[
          { key: 'customer', label: 'CLIENTE', render: (row) => <span className="font-semibold">{row.customerName}</span> },
          { key: 'status', label: 'STATUS', render: (row) => (
             <select 
               value={row.status}
               onChange={(e) => updateStatus(row.id, e.target.value)}
               className={`px-2 py-1 text-xs font-semibold rounded-full outline-none border border-transparent hover:border-gray-300 cursor-pointer
                 ${row.status === 'PAGO' || row.status === 'ENTREGUE' ? 'bg-green-100 text-green-700' 
                 : row.status === 'CANCELADO' ? 'bg-red-100 text-red-700' 
                 : 'bg-yellow-100 text-yellow-700'}`}
             >
               <option value="AGUARDANDO PAGAMENTO">AGUARDANDO PAGAMENTO</option>
               <option value="PENDENTE">PENDENTE</option>
               <option value="PAGO">PAGO</option>
               <option value="ENTREGUE">ENTREGUE</option>
               <option value="CANCELADO">CANCELADO</option>
             </select>
          )},
          { key: 'total_amount', label: 'VALOR', render: (row) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row.total_amount) },
          { key: 'created_at', label: 'DATA', render: (row) => new Date(row.created_at).toLocaleDateString('pt-BR') },
          { key: 'actions', label: 'AÇÕES', render: (row) => (
            <div className="flex gap-3 text-gray-400">
               {row.status !== 'PAGO' && row.status !== 'ENTREGUE' && (
                 <button onClick={() => approveSaleAndDeductStock(row)} className="hover:text-green-600 transition-colors" title="Aprovar e Baixar Estoque">
                   <CheckCircle className="w-5 h-5" />
                 </button>
               )}
               <button onClick={() => setDetailsModal(row)} className="hover:text-blue-600 transition-colors" title="Ver Produtos">
                 <PackageSearch className="w-5 h-5" />
               </button>
               <button onClick={() => handleDelete(row.id)} className="hover:text-red-600 transition-colors" title="Excluir Venda">
                 <Trash2 className="w-5 h-5" />
               </button>
            </div>
          )}
        ]}
      />

      {/* Sale Details Modal */}
      {detailsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 font-sans">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Itens da Venda - {detailsModal.customerName}
              </h2>
              <button onClick={() => setDetailsModal(null)} className="text-gray-400 hover:text-gray-900">
                <span className="text-xl">&times;</span>
              </button>
            </div>
            
            <div className="p-6">
              {detailsModal.order_items && detailsModal.order_items.length > 0 ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                      <tr>
                        <th className="p-3">PRODUTO</th>
                        <th className="p-3">TAMANHO</th>
                        <th className="p-3">QTD</th>
                        <th className="p-3">PREÇO UND.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailsModal.order_items.map((item: any) => (
                        <tr key={item.id} className="border-t border-gray-100">
                          <td className="p-3 font-medium text-gray-900">
                            {item.products ? `${item.products.name} (${item.products.code})` : 'Produto Apagado'}
                          </td>
                          <td className="p-3 text-gray-600">{item.size}</td>
                          <td className="p-3 text-gray-600">{item.quantity} un</td>
                          <td className="p-3 text-gray-600">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price_at_time)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">Nenhum produto atrelado a esta venda.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
