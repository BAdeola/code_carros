'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  // 🔹 NOVA PROP OPCIONAL: Se o gerente passar isso, mostramos o campo de escolha
  dealerships?: { id: number; nome: string }[]; 
}

export function VehicleModal({ isOpen, onClose, onSave, initialData, dealerships }: VehicleModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    concessionariaId: '', // 🔹 Novo campo para o ID da concessionária
    modelo: '', ano: '', fabricante: '', carroceria: '',
    cor: '', combustivel: '', quilometragem: '', placa: '', descricao: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setImagePreview(typeof initialData.foto === 'string' ? initialData.foto : initialData.foto?.src || null);
      setImageFile(null);
    } else {
      setFormData({
        concessionariaId: '',
        modelo: '', ano: '', fabricante: '', carroceria: '',
        cor: '', combustivel: '', quilometragem: '', placa: '', descricao: ''
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [initialData, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, fotoUpload: imageFile, fotoPreview: imagePreview });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-exa text-2xl font-black uppercase text-black">
            {initialData ? 'Editar' : 'Cadastrar'} <span className="text-blue-600">Automóvel</span>
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black font-bold text-xl cursor-pointer">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 🔹 CAMPO CONDICIONAL: Só aparece se a prop dealerships existir (Visão do Gerente) */}
          {dealerships && dealerships.length > 0 && (
            <div className="md:col-span-2 flex flex-col gap-1 p-4 bg-blue-50 border border-blue-100 rounded-xl mb-2">
              <label className="font-exa text-[10px] uppercase tracking-widest font-bold text-blue-800">
                Vincular a qual Concessionária?
              </label>
              <select 
                required
                className="p-3 bg-white rounded-lg font-exa text-sm outline-none focus:ring-2 focus:ring-blue-600 border border-blue-200"
                value={formData.concessionariaId}
                onChange={(e) => setFormData({...formData, concessionariaId: e.target.value})}
              >
                <option value="">Selecione a concessionária</option>
                {dealerships.map(d => (
                  <option key={d.id} value={d.id}>{d.nome}</option>
                ))}
              </select>
            </div>
          )}

          {/* ÁREA DE UPLOAD DE IMAGEM */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="font-exa text-[10px] uppercase tracking-widest font-bold text-gray-500">Foto do Veículo</label>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
            <div 
              onClick={() => fileInputRef.current?.click()} 
              className={`w-full h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative
                ${imagePreview ? 'border-blue-500 bg-black' : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'}`}
            >
              {imagePreview ? (
                <Image src={imagePreview} alt="Preview" fill className="object-cover opacity-90 hover:opacity-100 transition-opacity" />
              ) : (
                <div className="text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 text-xl font-bold">↑</span>
                  </div>
                  <p className="font-exa text-sm text-gray-600 font-bold">Clique para fazer upload</p>
                </div>
              )}
            </div>
          </div>

          {/* Campos de texto */}
          {[
            { label: 'Modelo', name: 'modelo', type: 'text' },
            { label: 'Fabricante', name: 'fabricante', type: 'text' },
            { label: 'Ano', name: 'ano', type: 'number' },
            { label: 'Cor', name: 'cor', type: 'text' },
            { label: 'Placa', name: 'placa', type: 'text' },
            { label: 'Quilometragem', name: 'quilometragem', type: 'number' },
          ].map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <label className="font-exa text-[10px] uppercase tracking-widest font-bold text-gray-500">{field.label}</label>
              <input 
                type={field.type} required
                className="p-3 bg-gray-100 rounded-xl font-exa text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                value={(formData as any)[field.name]}
                onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
              />
            </div>
          ))}

          {/* Estilo e Combustível */}
          <div className="flex flex-col gap-1">
            <label className="font-exa text-[10px] uppercase tracking-widest font-bold text-gray-500">Carroceria</label>
            <select required className="p-3 bg-gray-100 rounded-xl font-exa text-sm outline-none focus:ring-2 focus:ring-blue-600" value={formData.carroceria} onChange={(e) => setFormData({...formData, carroceria: e.target.value})}>
              <option value="">Selecione</option><option value="sedan">Sedan</option><option value="suv">SUV</option><option value="hatch">Hatch</option><option value="picape">Picape</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-exa text-[10px] uppercase tracking-widest font-bold text-gray-500">Combustível</label>
            <select required className="p-3 bg-gray-100 rounded-xl font-exa text-sm outline-none focus:ring-2 focus:ring-blue-600" value={formData.combustivel} onChange={(e) => setFormData({...formData, combustivel: e.target.value})}>
              <option value="">Selecione</option><option value="flex">Flex</option><option value="gasolina">Gasolina</option><option value="diesel">Diesel</option><option value="eletrico">Elétrico</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="font-exa text-[10px] uppercase tracking-widest font-bold text-gray-500">Descrição</label>
            <textarea rows={3} className="p-3 bg-gray-100 rounded-xl font-exa text-sm outline-none focus:ring-2 focus:ring-blue-600" value={formData.descricao} onChange={(e) => setFormData({...formData, descricao: e.target.value})} />
          </div>

          <div className="md:col-span-2 flex gap-4 mt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 border border-gray-200 font-exa font-bold text-sm rounded-xl hover:bg-gray-50 transition-all cursor-pointer">CANCELAR</button>
            <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-exa font-bold text-sm rounded-xl hover:bg-blue-700 shadow-lg transition-all cursor-pointer">
              {initialData ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR VEÍCULO'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}