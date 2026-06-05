'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { CarCard } from '../../../components/shared/CarCard'; 
import { AdminSidebar } from '../../../components/layout/AdminSidebar'; 
import { VehicleModal } from '@/src/components/shared/VehicleModal';
import { ConcessionariaModal } from '../../../components/shared/ConcessionariaModal';
import { ConfirmModal } from '../../../components/shared/ConfirmModal'; 
import { useAdminData } from '../../../hooks/useAdminData';
import { UserModal } from '@/src/components/shared/UserModal';
import { deletarGerenteAction, logoutAbsolutoAction } from '../../../actions/usuarios';

export default function DashboardGerente() {
  const [activeView, setActiveView] = useState<'automoveis' | 'concessionarias' | 'usuarios'>('automoveis');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const [filtroConcessionaria, setFiltroConcessionaria] = useState<string>('0');

  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<any>(null);

  const [isConcModalOpen, setIsConcModalOpen] = useState(false);
  const [selectedConc, setSelectedConc] = useState<any>(null);

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { concessionarias, carros, usuarios, loading, refetch } = useAdminData();

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, 
    title: '', 
    message: '', 
    confirmText: 'Confirmar', 
    onConfirm: () => {} 
  });

  const openCreateCarModal = () => { setSelectedCar(null); setIsCarModalOpen(true); };
  const openEditCarModal = (carro: any) => { setSelectedCar(carro); setIsCarModalOpen(true); };
  const handleSaveCar = () => { setIsCarModalOpen(false); refetch(); };

  const openCreateConcModal = () => { setSelectedConc(null); setIsConcModalOpen(true); };
  const openEditConcModal = (conc: any) => { setSelectedConc(conc); setIsConcModalOpen(true); };
  
  const handleLogout = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Sair do Sistema',
      message: 'Deseja realmente encerrar sua sessão e voltar para a página de login?',
      confirmText: 'Sim, Sair',
      onConfirm: async () => {
        await logoutAbsolutoAction();
        window.location.replace('/login');
      }
    });
  };

  const handleDeleteConc = (id: string, nome: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Excluir Concessionária',
      message: `Tem certeza que deseja apagar a concessionária ${nome}? TODOS os carros atrelados a ela poderão ser afetados.`,
      confirmText: 'Sim, Excluir',
      onConfirm: async () => {
        try {
          const { error } = await supabase.from('concessionarias').delete().eq('id', id);
          if (error) throw error;
          refetch();
          setConfirmModal({ ...confirmModal, isOpen: false });
        } catch (error: any) {
          alert('Erro ao apagar: ' + error.message);
        }
      }
    });
  };

  // 🔹 NOVA FUNÇÃO: Deletar Carro com o ConfirmModal
  const handleDeleteCar = (id: string, modelo: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remover Veículo',
      message: `Tem certeza que deseja apagar o veículo ${modelo} do sistema? Esta ação não pode ser desfeita.`,
      confirmText: 'Sim, Remover',
      onConfirm: async () => {
        try {
          const { error } = await supabase.from('automoveis').delete().eq('id', id);
          if (error) throw error;
          refetch(); // Atualiza a tela
          setConfirmModal({ ...confirmModal, isOpen: false }); // Fecha o modal
        } catch (error: any) {
          alert('Erro ao apagar veículo: ' + error.message);
        }
      }
    });
  };

  const handleDeleteUser = (id: string, nome: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remover Usuário',
      message: `Tem certeza que deseja apagar o acesso do gerente ${nome}?`,
      confirmText: 'Sim, Remover',
      onConfirm: async () => {
        const response = await deletarGerenteAction(id);
        if(response.success) refetch();
        else alert('Erro: ' + response.message);
        setConfirmModal({ ...confirmModal, isOpen: false });
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F3F2] flex items-center justify-center font-exa text-blue-600 font-bold uppercase tracking-widest p-10">
        Carregando Sistema Admin...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F3F2] flex">
      {/* Sidebar Original */}
      <AdminSidebar activeView={activeView} setActiveView={setActiveView} />

      <section className="flex-1 overflow-y-auto h-screen relative">
        
        {/* 📱 CABEÇALHO MOBILE UNIFICADO */}
        <div className="md:hidden flex flex-col bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100/60 bg-gray-50/50">
            <span className="font-exa font-black text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-gray-400">
              Painel Restrito • Admin
            </span>
            <button
              onClick={handleLogout}
              className="font-exa font-bold text-[10px] text-red-500 hover:underline tracking-widest uppercase cursor-pointer bg-transparent border-none"
            >
              Sair
            </button>
          </div>
          
          <div className="flex">
            <button
              onClick={() => setActiveView('automoveis')}
              className={`flex-1 py-3.5 font-exa text-[10px] sm:text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeView === 'automoveis' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}
            >
              Automóveis
            </button>
            <button
              onClick={() => setActiveView('concessionarias')}
              className={`flex-1 py-3.5 font-exa text-[10px] sm:text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeView === 'concessionarias' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}
            >
              Lojas
            </button>
            <button
              onClick={() => setActiveView('usuarios')}
              className={`flex-1 py-3.5 font-exa text-[10px] sm:text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeView === 'usuarios' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}
            >
              Usuários
            </button>
          </div>
        </div>

        {/* CONTEÚDO: AUTOMÓVEIS */}
        {activeView === 'automoveis' && (
          <div className="p-4 sm:p-8 md:p-12 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div>
                <h1 className="font-exa text-2xl md:text-3xl font-black uppercase text-black">Gestão de Galeria</h1>
                <p className="font-exa text-xs md:text-sm text-gray-500 mt-2 uppercase tracking-[0.2em]">Todos os veículos do sistema</p>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                <button onClick={openCreateCarModal} className="w-full md:w-auto bg-blue-600 text-white font-exa font-bold text-xs px-6 py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all">
                  + CADASTRAR AUTOMÓVEL
                </button>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <span className="font-exa text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden md:inline">Filtrar:</span>
                  <select className="w-full md:w-56 p-4 bg-white border border-gray-200 rounded-xl font-exa text-sm outline-none" value={filtroConcessionaria} onChange={(e) => setFiltroConcessionaria(e.target.value)}>
                    <option value="0">Todas as Lojas</option>
                    {concessionarias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-16">
              {concessionarias.filter(conc => filtroConcessionaria === '0' || conc.id === filtroConcessionaria).map((conc) => {
                  const carrosDestaConcessionaria = carros.filter(c => c.concessionaria_id === conc.id);
                  if (filtroConcessionaria === '0' && carrosDestaConcessionaria.length === 0) return null; 

                  return (
                    <div key={conc.id} className="bg-white/50 p-4 md:p-6 rounded-4xl border border-gray-100 shadow-sm">
                      <div className="mb-8 flex items-center gap-4 border-b border-gray-200/60 pb-6">
                        <div className="w-12 h-12 shrink-0 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-zetta font-black text-xl shadow-md">
                          {conc.nome.charAt(0)}
                        </div>
                        <h2 className="font-zetta text-xl md:text-2xl font-black uppercase text-black truncate">{conc.nome}</h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                        {carrosDestaConcessionaria.map((carro) => (
                          <CarCard key={carro.id} car={carro}>
                            {/* 🔹 ADICIONADO O BOTÃO DE REMOVER AQUI */}
                            <div className="flex gap-2 mt-4">
                                <button onClick={() => openEditCarModal(carro)} className="flex-1 border border-blue-200 text-blue-600 font-exa text-[10px] font-bold uppercase py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                                  Editar (Admin)
                                </button>
                                <button onClick={() => handleDeleteCar(carro.id, carro.modelo)} className="flex-1 bg-red-50 text-red-600 font-exa text-[10px] font-bold uppercase py-2 rounded-lg hover:bg-red-100 transition-colors cursor-pointer">
                                  Remover
                                </button>
                            </div>
                          </CarCard>
                        ))}
                      </div>
                    </div>
                  );
              })}
            </div>
          </div>
        )}

        {/* 🏢 CONTEÚDO: CONCESSIONÁRIAS */}
        {activeView === 'concessionarias' && (
          <div className="p-4 sm:p-8 md:p-12 max-w-7xl mx-auto">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <div>
                <h1 className="font-exa text-2xl md:text-3xl font-black uppercase text-black">Concessionárias</h1>
                <p className="font-exa text-xs md:text-sm text-gray-500 mt-2 uppercase tracking-[0.2em]">Gestão de Clientes B2B</p>
              </div>

              <button onClick={openCreateConcModal} className="w-full md:w-auto bg-blue-600 text-white font-exa font-bold text-sm px-8 py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all">
                + NOVA CONCESSIONÁRIA
              </button>
            </div>

            <div className="space-y-4">
              {concessionarias.map((conc) => {
                const totalCarros = carros.filter(c => c.concessionaria_id === conc.id).length;

                return (
                  <div key={conc.id} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-all">
                    
                    <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                      {conc.logo_url ? (
                         <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden relative border border-gray-200">
                           <img src={conc.logo_url} alt={conc.nome} className="object-cover w-full h-full" />
                         </div>
                      ) : (
                        <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-zetta font-black text-xl">
                          {conc.nome.charAt(0)}
                        </div>
                      )}
                      
                      <div className="min-w-0 flex-1">
                        <h3 className="font-zetta font-black uppercase text-base md:text-lg text-black truncate">{conc.nome}</h3>
                        <p className="font-exa text-[10px] md:text-xs text-gray-500 uppercase tracking-widest mt-1 truncate">
                          {conc.endereco || 'Endereço não definido'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                      <div className="text-center shrink-0">
                        <span className="block font-zetta font-black text-xl md:text-2xl text-blue-600">{totalCarros}</span>
                        <span className="font-exa text-[8px] md:text-[9px] uppercase tracking-widest text-gray-400">Veículos</span>
                      </div>
                      
                      <div className="flex gap-2 flex-1 md:flex-none justify-end">
                        <button onClick={() => openEditConcModal(conc)} className="w-full md:w-auto px-4 md:px-6 py-3 border border-gray-200 text-gray-600 font-exa text-[9px] md:text-[10px] font-bold uppercase rounded-xl hover:bg-gray-50 transition-colors">
                          Editar
                        </button>
                        <button onClick={() => handleDeleteConc(conc.id, conc.nome)} className="w-full md:w-auto px-4 md:px-6 py-3 bg-red-50 text-red-600 font-exa text-[9px] md:text-[10px] font-bold uppercase rounded-xl hover:bg-red-100 transition-colors">
                          Remover
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 👤 CONTEÚDO: GESTÃO DE USUÁRIOS */}
        {activeView === 'usuarios' && (
          <div className="p-4 sm:p-8 md:p-12 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <div>
                <h1 className="font-exa text-2xl md:text-3xl font-black uppercase text-black">Usuários do Sistema</h1>
                <p className="font-exa text-xs md:text-sm text-gray-500 mt-2 uppercase tracking-[0.2em]">Controle de Acessos dos Gerentes</p>
              </div>

              <button onClick={() => { setSelectedUser(null); setIsUserModalOpen(true); }} className="w-full md:w-auto bg-blue-600 text-white font-exa font-bold text-sm px-8 py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all">
                + NOVO USUÁRIO
              </button>
            </div>

            <div className="space-y-4">
              {usuarios && usuarios.length > 0 ? usuarios.map((user) => {
                const lojaDoUsuario = concessionarias.find(c => c.id === user.concessionaria_id);
                
                return (
                  <div key={user.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-all">
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-zetta font-black">
                        {user.nome.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-zetta font-black uppercase text-base text-black">{user.nome}</h3>
                        <p className="font-exa text-[10px] text-gray-500 uppercase tracking-widest">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 w-full md:w-auto">
                      <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                        <span className="font-exa text-[9px] text-gray-400 uppercase block mb-1">Vinculado à loja</span>
                        <span className="font-exa text-xs font-bold text-gray-800">{lojaDoUsuario?.nome || 'Nenhuma loja'}</span>
                      </div>
                      
                      <div className="flex gap-2 w-full md:w-auto">
                        <button onClick={() => { setSelectedUser(user); setIsUserModalOpen(true); }} className="flex-1 md:flex-none px-4 py-3 border border-gray-200 text-gray-600 font-exa text-[10px] font-bold uppercase rounded-xl hover:bg-gray-50 transition-colors">
                          Editar
                        </button>
                        <button onClick={() => handleDeleteUser(user.id, user.nome)} className="flex-1 md:flex-none px-4 py-3 bg-red-50 text-red-600 font-exa text-[10px] font-bold uppercase rounded-xl hover:bg-red-100 transition-colors">
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                )
              }) : (
                <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
                  <p className="font-exa text-sm text-gray-400 uppercase tracking-wider">Nenhum gerente cadastrado.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAIS INSERIDOS NO FINAL DA PÁGINA */}
        <UserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onSuccess={refetch} dealerships={concessionarias} initialData={selectedUser} />
        <VehicleModal isOpen={isCarModalOpen} onClose={() => setIsCarModalOpen(false)} onSave={handleSaveCar} initialData={selectedCar} dealerships={concessionarias} />
        <ConcessionariaModal isOpen={isConcModalOpen} onClose={() => setIsConcModalOpen(false)} onSuccess={refetch} initialData={selectedConc} />

        <ConfirmModal 
          isOpen={confirmModal.isOpen} 
          title={confirmModal.title} 
          message={confirmModal.message} 
          confirmText={confirmModal.confirmText}
          onConfirm={confirmModal.onConfirm} 
          onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })} 
        />

      </section>
    </main>
  );
}