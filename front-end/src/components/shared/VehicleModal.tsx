'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: any;
  dealerships?: { id: string; nome: string }[]; 
}

export function VehicleModal({ isOpen, onClose, onSave, initialData, dealerships }: VehicleModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isAdmin = dealerships && dealerships.length > 0;

  const [formData, setFormData] = useState({
    concessionaria_id: '',
    modelo: '', ano: '', fabricante: '', carroceria: '', preco: '',
    cor: '', combustivel: '', quilometragem: '', placa: '', descricao: '', site: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        concessionaria_id: initialData.concessionaria_id || '',
        modelo: initialData.modelo || '',
        ano: initialData.ano || '',
        fabricante: initialData.fabricante || '',
        carroceria: initialData.carroceria || '',
        preco: initialData.preco || '', // 🔹 Puxa o preço se for edição
        cor: initialData.cor || '',
        combustivel: initialData.combustivel || '',
        quilometragem: initialData.quilometragem || '',
        placa: initialData.placa || '',
        descricao: initialData.descricao || '',
        site: initialData.site || '' 
      });
      setImagePreview(initialData.foto_url || null);
      setImageFile(null);
    } else {
      setFormData({
        concessionaria_id: '',
        modelo: '', ano: '', fabricante: '', carroceria: '', preco: '',
        cor: '', combustivel: '', quilometragem: '', placa: '', descricao: '', site: ''
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [initialData, isOpen]);

  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'error' as 'error' | 'success' | 'info'
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSizeInBytes = 2 * 1024 * 1024; // 2 Megabytes
      
      if (file.size > maxSizeInBytes) {
        setAlertModal({
          isOpen: true,
          title: 'Arquivo muito grande',
          message: 'A imagem selecionada ultrapassa o limite permitido de 2MB. Por favor, escolha uma imagem mais leve.',
          type: 'error'
        });
        if (fileInputRef.current) fileInputRef.current.value = ''; // Limpa o input
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let foto_url = initialData?.foto_url || '';
      let finalConcessionariaId = formData.concessionaria_id;

      if (!finalConcessionariaId && !isAdmin) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: perfil } = await supabase.from('perfis').select('concessionaria_id').eq('id', user.id).single();
          if (perfil) finalConcessionariaId = perfil.concessionaria_id;
        }
      }

      if (!finalConcessionariaId) throw new Error("Erro: Nenhuma concessionária vinculada.");

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `veiculos/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('imagens').upload(filePath, imageFile);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from('imagens').getPublicUrl(filePath);
        foto_url = publicUrlData.publicUrl;
      }

      const veiculoData = {
        concessionaria_id: finalConcessionariaId,
        modelo: formData.modelo,
        fabricante: formData.fabricante,
        ano: Number(formData.ano),
        preco: Number(formData.preco), // 🔹 Garante que o banco receba um número
        cor: formData.cor,
        placa: formData.placa,
        quilometragem: Number(formData.quilometragem),
        carroceria: formData.carroceria,
        combustivel: formData.combustivel,
        descricao: formData.descricao,
        site: formData.site,
        foto_url: foto_url,
      };

      if (initialData) {
        const { error } = await supabase.from('automoveis').update(veiculoData).eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('automoveis').insert([veiculoData]);
        if (error) throw error;
      }

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar veículo:', error);
      setAlertModal({
        isOpen: true,
        title: 'Falha no Cadastro',
        message: error.message || 'Ocorreu um erro ao salvar o veículo no banco de dados.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-6 md:p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        <button onClick={onClose} className="absolute top-5 right-5 md:top-6 md:right-6 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 hover:text-black transition-colors font-zetta text-sm">
          ✕
        </button>

        <h2 className="font-zetta text-xl md:text-2xl font-black uppercase text-black mb-6 md:mb-8 pr-12 leading-snug">
          {initialData ? 'Editar' : 'Cadastrar'} <span className="text-blue-600">Automóvel</span>
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          
          {isAdmin && (
            <div className="md:col-span-2 flex flex-col gap-4 p-5 bg-blue-50/50 border border-blue-100 rounded-2xl mb-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              
              <div className="flex flex-col gap-1">
                <label className="font-exa text-[10px] uppercase tracking-widest font-bold text-blue-800">
                  Vincular a qual Concessionária?
                </label>
                <select 
                  required
                  className="p-3 bg-white rounded-xl font-exa text-sm outline-none focus:ring-2 focus:ring-blue-600 border border-blue-200 shadow-sm"
                  value={formData.concessionaria_id}
                  onChange={(e) => setFormData({...formData, concessionaria_id: e.target.value})}
                >
                  <option value="">Selecione a concessionária</option>
                  {dealerships.map(d => (
                    <option key={d.id} value={d.id}>{d.nome}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-exa text-[10px] uppercase tracking-widest font-bold text-blue-800 flex items-center gap-2">
                  Link de Redirecionamento (Site)
                  <span className="bg-blue-600 text-white text-[8px] px-2 py-0.5 rounded-full">Exclusivo Admin</span>
                </label>
                <input 
                  type="url" 
                  placeholder="https://www.exemplo.com.br"
                  className="p-3 bg-white rounded-xl font-exa text-sm outline-none focus:ring-2 focus:ring-blue-600 border border-blue-200 shadow-sm transition-all"
                  value={formData.site}
                  onChange={(e) => setFormData({...formData, site: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="font-exa text-[10px] uppercase tracking-widest font-bold text-gray-500">Foto do Veículo</label>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
            <div 
              onClick={() => fileInputRef.current?.click()} 
              className={`w-full h-48 md:h-56 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative
                ${imagePreview ? 'border-blue-500 bg-black' : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'}`}
            >
              {imagePreview ? (
                <Image src={imagePreview} alt="Preview" fill className="object-cover opacity-90 hover:opacity-100 transition-opacity" unoptimized />
              ) : (
                <div className="text-center">
                  <div className="bg-blue-100 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 text-lg md:text-xl font-bold">↑</span>
                  </div>
                  <p className="font-exa text-xs md:text-sm text-gray-600 font-bold">Clique para fazer upload</p>
                </div>
              )}
            </div>
            
            {initialData?.foto_url && !imageFile && (
              <div className="mt-2 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2">
                <span className="text-green-500 text-lg leading-none">✓</span>
                <p className="text-[10px] md:text-xs text-green-700 font-exa font-bold uppercase tracking-wider">
                  Foto do veículo já salva no sistema.
                </p>
              </div>
            )}
          </div>

          {/* 🔹 Array de campos atualizado com o Preço */}
          {[
            { label: 'Modelo', name: 'modelo', type: 'text', placeholder: 'Ex: Nivus Highline' },
            { label: 'Fabricante', name: 'fabricante', type: 'text', placeholder: 'Ex: Volkswagen' },
            { label: 'Ano', name: 'ano', type: 'number', placeholder: 'Ex: 2024' },
            { label: 'Preço (R$)', name: 'preco', type: 'number', placeholder: 'Ex: 120000' }, // <- Adicionado aqui
            { label: 'Cor', name: 'cor', type: 'text', placeholder: 'Ex: Cinza Platinum' },
            { label: 'Placa', name: 'placa', type: 'text', placeholder: 'Ex: ABC-1234' },
            { label: 'Quilometragem', name: 'quilometragem', type: 'number', placeholder: 'Ex: 15000' },
          ].map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <label className="font-exa text-[10px] uppercase tracking-widest font-bold text-gray-500">{field.label}</label>
              <input 
                type={field.type} required placeholder={field.placeholder}
                className="p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl font-exa text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                value={(formData as any)[field.name]}
                onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
              />
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <label className="font-exa text-[10px] uppercase tracking-widest font-bold text-gray-500">Carroceria</label>
            <select required className="p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl font-exa text-sm outline-none focus:ring-2 focus:ring-blue-600" value={formData.carroceria} onChange={(e) => setFormData({...formData, carroceria: e.target.value})}>
              <option value="">Selecione</option><option value="sedan">Sedan</option><option value="suv">SUV</option><option value="hatch">Hatch</option><option value="picape">Picape</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-exa text-[10px] uppercase tracking-widest font-bold text-gray-500">Combustível</label>
            <select required className="p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl font-exa text-sm outline-none focus:ring-2 focus:ring-blue-600" value={formData.combustivel} onChange={(e) => setFormData({...formData, combustivel: e.target.value})}>
              <option value="">Selecione</option><option value="flex">Flex</option><option value="gasolina">Gasolina</option><option value="diesel">Diesel</option><option value="eletrico">Elétrico</option><option value="hibrido">Híbrido</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="font-exa text-[10px] uppercase tracking-widest font-bold text-gray-500">Descrição (Opcional)</label>
            <textarea rows={3} className="p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl font-exa text-sm outline-none focus:ring-2 focus:ring-blue-600" value={formData.descricao} onChange={(e) => setFormData({...formData, descricao: e.target.value})} />
          </div>

          <div className="md:col-span-2 mt-4">
            <button disabled={loading} type="submit" className="w-full py-4 bg-blue-600 text-white font-exa font-bold text-sm rounded-xl hover:bg-blue-700 shadow-lg transition-all disabled:opacity-50">
              {loading ? 'SALVANDO VEÍCULO...' : (initialData ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR VEÍCULO')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}