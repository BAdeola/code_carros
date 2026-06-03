import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface ConcessionariaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export function ConcessionariaModal({ isOpen, onClose, onSuccess, initialData }: ConcessionariaModalProps) {
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [nomeGerente, setNomeGerente] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome || '');
      setCnpj(initialData.cnpj || '');
      setEndereco(initialData.endereco || '');
      setNomeGerente(initialData.nome_gerente || '');
      setLogoFile(null);
    } else {
      setNome('');
      setCnpj('');
      setEndereco('');
      setNomeGerente('');
      setLogoFile(null);
    }
  }, [initialData, isOpen]);

  // 🔹 Função de Máscara do CNPJ
  const formatCNPJ = (value: string) => {
    let v = value.replace(/\D/g, ""); 
    if (v.length > 14) v = v.slice(0, 14); 
    v = v.replace(/^(\d{2})(\d)/, "$1.$2");
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
    v = v.replace(/(\d{4})(\d)/, "$1-$2");
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let logo_url = initialData?.logo_url || '';

      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `concessionarias/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('logos')
          .upload(filePath, logoFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('logos')
          .getPublicUrl(filePath);

        logo_url = publicUrlData.publicUrl;
      }

      const concessionariaData = {
        nome,
        cnpj,
        endereco,
        nome_gerente: nomeGerente,
        logo_url,
      };

      if (initialData) {
        const { error } = await supabase
          .from('concessionarias')
          .update(concessionariaData)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('concessionarias')
          .insert([concessionariaData]);
        if (error) throw error;
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar concessionária:', error);
      alert('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-6 md:p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* 🔹 Botão de Fechar (Ajustado) */}
        <button onClick={onClose} className="absolute top-5 right-5 md:top-6 md:right-6 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 hover:text-black transition-colors font-zetta text-sm">
          ✕
        </button>

        {/* 🔹 Título Responsivo com Padding Seguro (pr-12) para não invadir o X */}
        <h2 className="font-zetta font-black text-xl md:text-2xl uppercase mb-6 md:mb-8 pr-12 leading-snug text-black">
          {initialData ? 'Editar' : 'Cadastrar'} <span className="text-blue-600">Concessionária</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="font-exa text-[10px] uppercase tracking-widest font-bold text-gray-500">Nome da Loja</label>
              <input required type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl font-exa text-sm outline-none focus:ring-2 focus:ring-blue-600" />
            </div>

            <div className="space-y-2">
              <label className="font-exa text-[10px] uppercase tracking-widest font-bold text-gray-500">CNPJ</label>
              <input required type="text" value={cnpj} onChange={(e) => setCnpj(formatCNPJ(e.target.value))} maxLength={18} placeholder="00.000.000/0001-00" className="w-full p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl font-exa text-sm outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-exa text-[10px] uppercase tracking-widest font-bold text-gray-500">Endereço Completo</label>
            <input required type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} className="w-full p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl font-exa text-sm outline-none focus:ring-2 focus:ring-blue-600" />
          </div>

          <div className="space-y-2">
            <label className="font-exa text-[10px] uppercase tracking-widest font-bold text-gray-500">Nome do Gerente Responsável</label>
            <input required type="text" value={nomeGerente} onChange={(e) => setNomeGerente(e.target.value)} className="w-full p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl font-exa text-sm outline-none focus:ring-2 focus:ring-blue-600" />
          </div>

          <div className="space-y-2">
            <label className="font-exa text-[10px] uppercase tracking-widest font-bold text-gray-500">Logotipo (Upload)</label>
            {/* 🔹 Input de Arquivo Responsivo */}
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)} 
              className="w-full p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl font-exa text-[10px] md:text-sm outline-none focus:ring-2 focus:ring-blue-600 file:mr-2 md:file:mr-4 file:py-2 file:px-3 md:file:px-4 file:rounded-full file:border-0 file:text-[9px] md:file:text-xs file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 file:cursor-pointer cursor-pointer" 
            />
            
            {/* 🔹 Mensagem de Sucesso Isolada e Bem Visível */}
            {initialData?.logo_url && !logoFile && (
              <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2">
                <span className="text-green-500 text-lg leading-none">✓</span>
                <p className="text-[10px] md:text-xs text-green-700 font-exa font-bold uppercase tracking-wider">
                  Imagem atual já salva no banco de dados.
                </p>
              </div>
            )}
          </div>

          {/* 🔹 Botão de Salvar com Padding Menor no Mobile */}
          <button disabled={loading} type="submit" className="w-full mt-6 md:mt-8 bg-blue-600 text-white font-exa font-bold text-xs md:text-sm py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50">
            {loading ? 'SALVANDO DADOS...' : 'SALVAR CONCESSIONÁRIA'}
          </button>
        </form>

      </div>
    </div>
  );
}