'use client';
import { useState, useEffect } from 'react';
import { cadastrarGerenteAction, atualizarGerenteAction } from '../../actions/usuarios';
import { AlertModal } from './AlertModal';

interface UserModalProps {
  isOpen: boolean; onClose: () => void; onSuccess: () => void;
  dealerships: { id: string; nome: string }[];
  initialData?: any; // 🔹 Nova propriedade
}

export function UserModal({ isOpen, onClose, onSuccess, dealerships, initialData }: UserModalProps) {
  const [nome, setNome] = useState(''); const [email, setEmail] = useState('');
  const [senha, setSenha] = useState(''); const [concessionariaId, setConcessionariaId] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'error' as 'error' | 'success' });

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome || ''); setEmail(initialData.email || '');
      setConcessionariaId(initialData.concessionaria_id || ''); setSenha(''); // Senha sempre em branco na edição
    } else {
      setNome(''); setEmail(''); setSenha(''); setConcessionariaId('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      let response;
      if (initialData) {
        response = await atualizarGerenteAction(initialData.id, { nome, email, concessionariaId, senha });
      } else {
        response = await cadastrarGerenteAction({ nome, email, senha, concessionariaId });
      }

      if (!response.success) throw new Error(response.message);

      setAlertModal({ isOpen: true, title: 'Sucesso!', message: initialData ? 'Usuário atualizado!' : 'Usuário cadastrado!', type: 'success' });
    } catch (error: any) {
      setAlertModal({ isOpen: true, title: 'Erro', message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">✕</button>
        <h2 className="font-zetta text-xl font-black uppercase text-black mb-6">{initialData ? 'Editar' : 'Cadastrar'} <span className="text-blue-600">Usuário</span></h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="font-exa text-[10px] uppercase font-bold text-gray-500">Nome</label>
            <input required type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-exa text-[10px] uppercase font-bold text-gray-500">E-mail</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-exa text-[10px] uppercase font-bold text-gray-500">
              {initialData ? 'Nova Senha (deixe em branco para não alterar)' : 'Senha'}
            </label>
            <input required={!initialData} type="password" minLength={6} value={senha} onChange={(e) => setSenha(e.target.value)} className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder={initialData ? '••••••' : ''} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-exa text-[10px] uppercase font-bold text-gray-500">Concessionária</label>
            <select required value={concessionariaId} onChange={(e) => setConcessionariaId(e.target.value)} className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm">
              <option value="">Selecione uma loja</option>
              {dealerships.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
            </select>
          </div>
          <button disabled={loading} type="submit" className="w-full mt-4 py-4 bg-blue-600 text-white font-exa font-bold text-xs rounded-xl hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'SALVANDO...' : 'SALVAR USUÁRIO'}
          </button>
        </form>
      </div>
      <AlertModal isOpen={alertModal.isOpen} title={alertModal.title} message={alertModal.message} type={alertModal.type} onClose={() => { setAlertModal({ ...alertModal, isOpen: false }); if (alertModal.type === 'success') { onSuccess(); onClose(); } }} />
    </div>
  );
}