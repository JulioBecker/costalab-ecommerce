"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DataTable } from "@/components/admin/DataTable";
import { Loader2 } from "lucide-react";

export default function AdminClientesPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    // Fetch registered users
    const { data: rows } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setData(rows || []);
    setIsLoading(false);
  }

  const filteredData = data.filter(item => 
    item.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    item.phone?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between items-end border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Cadastro de Clientes</h1>
      </div>

      <DataTable 
        title="Clientes Registrados"
        data={filteredData}
        isLoading={isLoading}
        searchFilter={search}
        setSearchFilter={setSearch}
        columns={[
          { key: 'full_name', label: 'NOME' },
          { key: 'phone', label: 'TELEFONE', render: (row) => row.phone || '-' },
          { key: 'origin', label: 'ORIGEM', render: (row) => row.origin || 'Site Oficial' },
          { key: 'role', label: 'TIPO', render: (row) => (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${row.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
              {row.role === 'admin' ? 'ADMIN' : 'CLIENTE'}
            </span>
          )},
          { key: 'created_at', label: 'CADASTRADO EM', render: (row) => new Date(row.created_at).toLocaleDateString('pt-BR') }
        ]}
      />
    </>
  );
}
