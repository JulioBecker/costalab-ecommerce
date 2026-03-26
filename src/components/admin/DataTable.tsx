"use client";

import { useState } from "react";
import { Search, Plus, Loader2 } from "lucide-react";

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface DataTableProps {
  title: string;
  columns: Column[];
  data: any[];
  searchPlaceholder?: string;
  searchFilter: string;
  setSearchFilter: (value: string) => void;
  onAdd?: () => void;
  isLoading?: boolean;
}

export function DataTable({ 
  title, 
  columns, 
  data, 
  searchPlaceholder = "Buscar...", 
  searchFilter,
  setSearchFilter,
  onAdd,
  isLoading = false 
}: DataTableProps) {

  return (
    <div className="flex flex-col gap-6 text-gray-900 font-sans w-full max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        
        <div className="flex flex-col w-full md:w-auto md:flex-row gap-3">
          <div className="flex items-center border border-gray-300 rounded-md bg-white px-3 py-2 focus-within:ring-2 ring-blue-500 transition-shadow">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder={searchPlaceholder}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-transparent outline-none w-full md:w-64 text-sm font-medium"
            />
          </div>
          
          {onAdd && (
            <button 
              onClick={onAdd}
              className="flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-200 shadow-sm px-4 py-2 hover:bg-gray-50 transition-colors rounded-md font-medium text-sm whitespace-nowrap"
            >
              <Plus className="w-5 h-5" /> Adicionar
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
              {columns.map((col) => (
                <th key={col.key} className="p-4 whitespace-nowrap">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-12 text-center text-gray-400">
                  <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-12 text-center text-gray-500 font-medium">
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={row.id || idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 font-medium text-gray-700">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
