"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  PackageOpen, 
  TrendingUp, 
  AlertTriangle,
  CircleDollarSign,
  Loader2,
  Trophy
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalSalesCount: 0,
    totalRevenue: 0,
    totalProfit: 0,
  });
  
  const [chartData, setChartData] = useState<any[]>([]);
  const [topClients, setTopClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      // Products
      const { count: prodCount } = await supabase.from('products').select('*', { count: 'exact', head: true });

      // Inventory
      const { count: lowStockCount } = await supabase.from('inventory').select('*', { count: 'exact', head: true }).lte('quantity', 5);

      // Sales
      const { data: sales } = await supabase.from('sales').select('*, customers(name)');
      
      let revenue = 0;
      let profit = 0;
      let salesCount = sales?.length || 0;
      
      const clientMap: Record<string, {name: string, spent: number}> = {};
      const monthlyData: Record<string, { faturamento: number, custo: number }> = {};

      if (sales) {
        sales.forEach(sale => {
          revenue += Number(sale.total_amount) || 0;
          profit += Number(sale.profit) || 0;
          
          // Top Clients
          if (sale.customers?.name) {
            const cName = sale.customers.name;
            if(!clientMap[cName]) clientMap[cName] = { name: cName, spent: 0 };
            clientMap[cName].spent += Number(sale.total_amount);
          }

          // Monthly Chart (Simple Aggregation)
          const date = new Date(sale.created_at);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { faturamento: 0, custo: 0 };
          }
          monthlyData[monthKey].faturamento += Number(sale.total_amount);
          // Custo = Faturamento - Lucro
          monthlyData[monthKey].custo += (Number(sale.total_amount) - Number(sale.profit));
        });
      }

      const formattedChart = Object.keys(monthlyData).sort().map(key => ({
        name: key.split('-').reverse().join('/'), // MM/YYYY
        faturamento: monthlyData[key].faturamento,
        custo: monthlyData[key].custo
      })).slice(-6); // Last 6 months

      // Se não tiver dados suficientes, mostra um placeholder vazio pro gráfico não quebrar
      if (formattedChart.length === 0) {
        const thisMonth = new Date();
        formattedChart.push({ 
          name: `${String(thisMonth.getMonth() + 1).padStart(2, '0')}/${thisMonth.getFullYear()}`, 
          faturamento: 0, 
          custo: 0 
        });
      }

      setStats({
        totalProducts: prodCount || 0,
        lowStock: lowStockCount || 0,
        totalSalesCount: salesCount,
        totalRevenue: revenue,
        totalProfit: profit
      });

      setChartData(formattedChart);

      const sortedClients = Object.values(clientMap).sort((a,b) => b.spent - a.spent).slice(0, 5);
      setTopClients(sortedClients);

      setLoading(false);
    }

    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-8 w-full text-gray-900 font-sans">
      <h1 className="text-3xl font-semibold tracking-tight border-b border-gray-200 pb-4">
        Visão Geral do Sistema
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <span className="font-medium text-sm text-gray-500">Vendas (Qtd)</span>
            <div className="p-2 bg-blue-50 rounded-lg"><TrendingUp className="w-5 h-5 text-blue-600 stroke-[2px]" /></div>
          </div>
          <span className="text-4xl font-semibold tracking-tight z-10">
            {loading ? <Loader2 className="w-6 h-6 animate-spin mt-2" /> : stats.totalSalesCount}
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <span className="font-medium text-sm text-gray-500">Faturamento Bruto</span>
            <div className="p-2 bg-green-50 rounded-lg"><CircleDollarSign className="w-5 h-5 text-green-600 stroke-[2px]" /></div>
          </div>
          <span className="text-2xl lg:text-3xl font-semibold tracking-tight z-10 text-green-700">
            {loading ? <Loader2 className="w-6 h-6 animate-spin mt-2" /> : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalRevenue)}
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <span className="font-medium text-sm text-gray-500">Lucro Estimado</span>
            <div className="p-2 bg-emerald-50 rounded-lg"><CircleDollarSign className="w-5 h-5 text-emerald-600 stroke-[2px]" /></div>
          </div>
          <span className="text-2xl lg:text-3xl font-semibold tracking-tight z-10 text-emerald-700">
            {loading ? <Loader2 className="w-6 h-6 animate-spin mt-2" /> : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalProfit)}
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <span className="font-medium text-sm text-red-500">Alertas de Estoque</span>
            <div className="p-2 bg-red-50 rounded-lg"><AlertTriangle className="w-5 h-5 text-red-500 stroke-[2px]" /></div>
          </div>
          <span className="text-4xl font-semibold tracking-tight text-gray-900 z-10">
            {loading ? <Loader2 className="w-6 h-6 animate-spin mt-2" /> : stats.lowStock}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 flex flex-col shadow-sm">
          <h2 className="font-semibold text-sm text-gray-700 tracking-wide mb-8 border-b border-gray-100 pb-4 uppercase">
            Faturamento X Custo (Mensal)
          </h2>
          <div className="h-[300px] w-full text-xs">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#9ca3af" tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
                  <Tooltip 
                    cursor={{fill: '#f3f4f6'}}
                    contentStyle={{ backgroundColor: '#fff', color: '#111827', border: '1px solid #e5e7eb', borderRadius: '8px', fontWeight: '500', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="faturamento" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Faturamento" />
                  <Bar dataKey="custo" fill="#9ca3af" radius={[4, 4, 0, 0]} name="Custo/Despesa" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col shadow-sm">
          <h2 className="font-semibold text-sm text-gray-700 tracking-wide mb-8 border-b border-gray-100 pb-4 flex items-center gap-2 uppercase">
            <Trophy className="w-4 h-4 text-yellow-500" /> Melhores Clientes
          </h2>
          <div className="flex flex-col gap-4 font-medium text-sm flex-1">
             {loading ? (
               <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
             ) : topClients.length === 0 ? (
               <div className="text-gray-400 text-center py-8 border-2 border-dashed border-gray-100 rounded-lg">
                 Nenhuma venda vinculada a clientes ainda.
               </div>
             ) : (
               topClients.map((c, i) => (
                 <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-colors">
                   <span className="text-gray-700 truncate mr-2">{i+1}. {c.name}</span>
                   <span className="text-green-600 font-semibold whitespace-nowrap">
                     {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(c.spent)}
                   </span>
                 </div>
               ))
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
