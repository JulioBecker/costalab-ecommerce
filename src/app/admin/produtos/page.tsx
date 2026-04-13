"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { X, Upload, Loader2, Plus, Edit, Trash2, Box } from "lucide-react";

type Inventory = {
  id: string;
  size: string;
  quantity: number;
}

type Product = {
  id: string;
  code: string;
  name: string;
  collection: string;
  category: string;
  year: number;
  price: number;
  image_url: string;
  is_active: boolean;
  description: string;
  inventory?: Inventory[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false); // Add / Edit Product
  const [isStockModalOpen, setIsStockModalOpen] = useState(false); // Reduce/Manage Stock

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '', code: '', collection: 'DROP 01', category: 'MASC', price: '', description: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Stock Form State
  const [stockSize, setStockSize] = useState("");
  const [stockQty, setStockQty] = useState("");
  const [stockAction, setStockAction] = useState<"ADD" | "REMOVE">("REMOVE");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setIsLoading(true);
    // Fetch products with their inventory
    const { data: prods, error } = await supabase
      .from('products')
      .select('*, inventory(*)')
      .order('created_at', { ascending: false });
      
    if (!error && prods) {
      setProducts(prods);
    }
    setIsLoading(false);
  }

  const handleToggleStatus = async (item: Product) => {
    const { error } = await supabase.from('products').update({ is_active: !item.is_active }).eq('id', item.id);
    if (!error) fetchProducts();
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', code: '', collection: 'DROP 01', category: 'MASC', price: '', description: '' });
    setImageFile(null);
    setIsModalOpen(true);
  }

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      code: p.code,
      collection: p.collection || '',
      category: p.category,
      price: p.price.toString(),
      description: p.description || ''
    });
    setImageFile(null);
    setIsModalOpen(true);
  }

  const openStockModal = (p: Product) => {
    setStockProduct(p);
    setStockSize(p.inventory && p.inventory.length > 0 ? p.inventory[0].size : "M");
    setStockQty("");
    setStockAction("REMOVE");
    setIsStockModalOpen(true);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let image_url = editingProduct ? editingProduct.image_url : null;

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage.from('products').upload(filePath, imageFile);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(filePath);
        image_url = publicUrlData.publicUrl;
      }

      if (editingProduct) {
        // UPDATE
        const { error: updateError } = await supabase.from('products').update({
          name: formData.name,
          code: formData.code,
          collection: formData.collection,
          category: formData.category,
          price: parseFloat(formData.price),
          description: formData.description,
          image_url: image_url
        }).eq('id', editingProduct.id);
        if (updateError) throw updateError;
      } else {
        // INSERT
        const { error: insertError } = await supabase.from('products').insert([{
          name: formData.name,
          code: formData.code,
          collection: formData.collection,
          category: formData.category,
          price: parseFloat(formData.price),
          description: formData.description,
          image_url: image_url
        }]);
        if (insertError) throw insertError;
      }
      
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      alert("Erro ao salvar produto: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockProduct || !stockSize || !stockQty) return;
    setIsSubmitting(true);

    try {
      const qtyToChange = parseInt(stockQty, 10);
      if (isNaN(qtyToChange) || qtyToChange <= 0) throw new Error("Quantidade inválida");

      // Check existing inventory for this size
      const existingInv = stockProduct.inventory?.find(inv => inv.size === stockSize);
      
      let newTotal = qtyToChange;

      if (existingInv) {
        if (stockAction === "REMOVE") {
          newTotal = existingInv.quantity - qtyToChange;
          if (newTotal < 0) newTotal = 0; // Prevent negative stock
        } else {
          newTotal = existingInv.quantity + qtyToChange;
        }

        const { error } = await supabase
          .from('inventory')
          .update({ quantity: newTotal })
          .eq('id', existingInv.id);
        if (error) throw error;
      } else {
        // No existing record for this size
        if (stockAction === "REMOVE") {
           throw new Error("Não é possível remover de um tamanho sem estoque anterior.");
        }
        const { error } = await supabase
          .from('inventory')
          .insert([{ product_id: stockProduct.id, size: stockSize, quantity: qtyToChange }]);
        if (error) throw error;
      }

      alert("Estoque atualizado com sucesso!");
      setIsStockModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      alert("Erro ao atualizar estoque: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-gray-900 font-sans w-full">
      
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight">Catálogo de Produtos</h1>
        <button 
          onClick={openAddModal}
          className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Novo Produto
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
           <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                <th className="p-4">IMAGEM</th>
                <th className="p-4">CÓDIGO</th>
                <th className="p-4">PRODUTO</th>
                <th className="p-4">PREÇO</th>
                <th className="p-4 text-center">ESTOQUE TOTAL</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">Nenhum produto cadastrado.</td>
                </tr>
              ) : (
                products.map((p) => {
                  const totalStock = p.inventory?.reduce((acc, inv) => acc + inv.quantity, 0) || 0;

                  return (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        {p.image_url ? 
                          <img src={p.image_url} alt={p.name} className="w-10 h-10 object-cover rounded bg-gray-100" /> 
                          : <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs text-center leading-tight">SEM IMG</div>
                        }
                      </td>
                      <td className="p-4 font-medium text-gray-600">{p.code}</td>
                      <td className="p-4 font-semibold text-gray-900">{p.name}</td>
                      <td className="p-4 font-medium text-gray-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${totalStock > 0 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                          {totalStock} un
                        </span>
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => handleToggleStatus(p)}
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        >
                          {p.is_active ? 'ATIVO' : 'INATIVO'}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-3 text-gray-400">
                          <button onClick={() => openEditModal(p)} className="hover:text-blue-600 transition-colors" title="Editar"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => openStockModal(p)} className="hover:text-green-600 transition-colors text-gray-400" title="Gerenciar Estoque"><Box className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL NOVO/EDITAR PRODUTO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 font-sans">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    Nome do Produto *
                    <input required type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="border border-gray-300 rounded-md p-2 focus:ring-2 ring-black outline-none font-normal" placeholder="Ex: T-Shirt Void" />
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    Código SKU *
                    <input required type="text" value={formData.code} onChange={e=>setFormData({...formData, code: e.target.value})} className="border border-gray-300 rounded-md p-2 focus:ring-2 ring-black outline-none font-normal" placeholder="Ex: TS-VOID-01" />
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    Preço (R$) *
                    <input required type="number" step="0.01" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} className="border border-gray-300 rounded-md p-2 focus:ring-2 ring-black outline-none font-normal" placeholder="99.90" />
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    Categoria *
                    <select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="border border-gray-300 rounded-md p-2 focus:ring-2 ring-black outline-none font-normal">
                      <option value="MASC">Masculino</option>
                      <option value="FEM">Feminino</option>
                      <option value="UNISSEX">Unissex</option>
                      <option value="ACCESSORIES">Acessórios</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    Coleção
                    <input type="text" value={formData.collection} onChange={e=>setFormData({...formData, collection: e.target.value})} className="border border-gray-300 rounded-md p-2 focus:ring-2 ring-black outline-none font-normal" />
                  </label>
                </div>

                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                  Descrição
                  <textarea rows={3} value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="border border-gray-300 rounded-md p-2 focus:ring-2 ring-black outline-none font-normal resize-none" />
                </label>

                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-700">Imagem do Produto</span>
                  <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden">
                    {imageFile ? (
                      <span className="text-sm text-gray-900 font-medium z-10">{imageFile.name} (Pronto para Upload)</span>
                    ) : editingProduct?.image_url ? (
                      <div className="flex flex-col items-center gap-2 z-10">
                        <img src={editingProduct.image_url} alt="Current" className="w-16 h-16 object-cover rounded" />
                        <span className="text-sm text-gray-500 font-medium">Clique para trocar a imagem atual</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 z-10">
                        <Upload className="w-6 h-6 text-gray-400" />
                        <span className="text-sm text-gray-500 font-medium">Clique para enviar uma foto</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
                    }} />
                  </label>
                </div>
              </div>

              <div className="pt-4 mt-auto flex justify-end gap-3 border-t border-gray-200 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-black text-white border border-transparent shadow-sm font-medium text-sm rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-70">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Produto'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL ESTOQUE (REMOVER / ADICIONAR) */}
      {isStockModalOpen && stockProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 font-sans">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-200 gap-4">
              <h2 className="text-xl font-semibold tracking-tight text-gray-900 flex items-center gap-2">
                <Box className="w-5 h-5 text-gray-500" />
                Gerenciar Estoque
              </h2>
              <button onClick={() => setIsStockModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStockSubmit} className="p-6 flex flex-col gap-6">
              
              <div className="text-sm text-gray-600">
                Modificando o estoque do produto: <strong className="text-gray-900">{stockProduct.name}</strong>
              </div>

              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                  type="button"
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${stockAction === 'REMOVE' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500 hover:text-gray-900'}`}
                  onClick={() => setStockAction('REMOVE')}
                >
                  Remover (Lixo)
                </button>
                <button 
                   type="button"
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${stockAction === 'ADD' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-900'}`}
                   onClick={() => setStockAction('ADD')}
                >
                  Adicionar
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                  Tamanho
                  <select 
                    value={stockSize} 
                    onChange={e => setStockSize(e.target.value)} 
                    className="border border-gray-300 rounded-md p-2.5 focus:ring-2 ring-black outline-none font-normal"
                    required
                  >
                    <option value="" disabled>Selecione...</option>
                    <option value="P">P</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="GG">GG</option>
                    <option value="XG">XG</option>
                    <option value="UNICO">TAMANHO ÚNICO</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                  Quantidade
                  <input 
                    type="number" 
                    min="1"
                    placeholder="Ex: 5"
                    required 
                    value={stockQty} 
                    onChange={e => setStockQty(e.target.value)} 
                    className="border border-gray-300 rounded-md p-2.5 focus:ring-2 ring-black outline-none font-normal" 
                  />
                </label>
              </div>

              {/* Show current stock for selected size */}
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md border border-gray-100">
                Estoque atual do tamanho {stockSize || '?'}: 
                <strong className="text-gray-900 ml-1">
                  {stockProduct.inventory?.find(i => i.size === stockSize)?.quantity || 0} un
                </strong>
                {stockAction === 'REMOVE' && (
                  <p className="mt-1 text-red-500">Ao reduzir para 0, o produto continuará no catálogo com estoque esgotado.</p>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className={`w-full py-2.5 shadow-sm font-medium text-sm rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-70 text-white ${stockAction === 'REMOVE' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : stockAction === 'REMOVE' ? 'Remover do Estoque' : 'Adicionar ao Estoque'}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
