'use client';

// 🔹 Importado o useMemo para a filtragem em tempo real de alta performance
import { useState, useMemo } from 'react'; 
import Image from 'next/image';
import { CarCard } from '../../../components/shared/CarCard'; 
import { VehicleModal } from '../../../components/shared/VehicleModal'; 
import { useGerenteData } from '../../../hooks/useGerenteData'; 
import { supabase } from '../../../lib/supabase';
import { ConfirmModal } from '../../../components/shared/ConfirmModal';

import logoC from '../../../../assets/logo_c.png'; 
import { logoutAbsolutoAction } from '../../../actions/usuarios';

export default function DashboardCliente() {
  const { concessionaria, carros, gerente, loading, refetch } = useGerenteData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<any | null>(null);

  // 🚨 NOVO ESTADO: Armazena o termo digitado na pesquisa
  const [searchTerm, setSearchTerm] = useState('');

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, title: '', message: '', confirmText: '', onConfirm: () => {}
  });

  const handleLogout = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Sair do Sistema',
      message: 'Deseja realmente encerrar sua sessão and voltar para a página de login?',
      confirmText: 'Sim, Sair',
      onConfirm: async () => {
        await logoutAbsolutoAction();
        window.location.href = '/login';
      }
    });
  };

  const handleDeleteCar = (id: string, modelo: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remover Veículo',
      message: `Tem certeza que deseja apagar o ${modelo} do estoque? Esta ação não pode ser desfeita.`,
      confirmText: 'Sim, Remover',
      onConfirm: async () => {
        try {
          await supabase.from('automoveis').delete().eq('id', id);
          refetch();
          setConfirmModal({ ...confirmModal, isOpen: false });
        } catch (error) {
          console.error("Erro ao deletar", error);
        }
      }
    });
  };

  const handleSave = () => {
    setIsModalOpen(false);
    refetch(); 
  };

  const openEditModal = (carro: any) => { setSelectedCar(carro); setIsModalOpen(true); };
  const openCreateModal = () => { setSelectedCar(null); setIsModalOpen(true); };

  // 🚨 LÓGICA DE FILTRAGEM AUTOMÁTICA (Padrão Sênior)
  const carrosFiltrados = useMemo(() => {
    if (!carros || carros.length === 0) return [];
    
    return carros.filter((carro) => {
      const term = searchTerm.trim().toLowerCase();
      
      const modeloMatch = carro.modelo && carro.modelo.toLowerCase().includes(term);
      const fabricanteMatch = carro.fabricante && carro.fabricante.toLowerCase().includes(term);
      
      return modeloMatch || fabricanteMatch;
    });
  }, [carros, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F3F2] flex items-center justify-center font-exa text-blue-600 font-bold uppercase tracking-widest">
        Carregando seu estoque...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F3F2] pb-20 relative">
      
        {/* NAVBAR */}
        <nav className="bg-white px-6 md:px-10 py-3 flex justify-between items-center shadow-sm sticky top-0 z-40">
          <div className="flex items-center">
            <Image src={logoC} alt="Logo C" width={40} height={40} className="opacity-80 w-auto h-auto" />
          </div>
          
          <div className="flex items-center gap-6 md:gap-10">
            <span className="font-exa font-bold text-xs md:text-sm text-gray-500 whitespace-nowrap">
              Olá, <span className="text-blue-600">{gerente?.nome || 'Gerente'}</span>
            </span>
            <button 
              onClick={handleLogout} 
              className="font-exa font-bold text-[10px] md:text-xs text-red-500 hover:underline tracking-widest uppercase cursor-pointer bg-transparent border-none"
            >
              Sair
            </button>
          </div>
        </nav>

        {/* CONTAINER PRINCIPAL */}
        <div className="px-6 md:px-10 mt-12 max-w-7xl mx-auto">
            
            {/* CABEÇALHO DA LOJA REESTRUTURADO COM BARRA DE BUSCA */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-gray-200/60 pb-8">
              <div className="w-full md:w-auto space-y-4 text-center md:text-left">
                <div>
                  <h1 className="font-exa text-2xl md:text-4xl font-black uppercase text-black leading-tight">
                    {concessionaria?.nome || 'Minha Loja'}
                  </h1>
                  <p className="font-exa text-xs text-gray-500 mt-2 uppercase tracking-[0.2em]">
                    Galeria de Veículos • <span className="font-bold text-blue-600 block md:inline">{carrosFiltrados.length} visíveis</span>
                  </p>
                </div>

                {/* 🚨 NOVA BARRA DE PESQUISA INTEGRADA (Exibida apenas se a loja possuir estoque real) */}
                {carros.length > 0 && (
                  <div className="relative w-full md:w-80 mx-auto md:mx-0">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input 
                      type="search" 
                      placeholder="Buscar no meu estoque..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white border border-gray-200 p-4 pl-12 rounded-xl font-exa text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all text-left"
                    />
                  </div>
                )}
              </div>

              {/* Botão de Cadastro */}
              <button 
                onClick={openCreateModal}
                className="w-full md:w-auto bg-blue-600 text-white font-exa font-bold text-xs px-8 py-4 rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span className="text-xs leading-none">+</span> CADASTRAR AUTOMÓVEL
              </button>
            </div>

            {/* GALERIA DE CARROS OU ESTADOS VAZIOS */}
            {carros.length === 0 ? (
              // Estado Vazio 1: A loja realmente não tem nenhum carro na base
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm max-w-2xl mx-auto">
                <h3 className="font-exa font-bold text-gray-400 uppercase tracking-wider">Seu estoque está vazio.</h3>
                <p className="font-exa text-xs text-gray-400 mt-2">Clique no botão superior para cadastrar o seu primeiro veículo!</p>
              </div>
            ) : carrosFiltrados.length === 0 ? (
              // 🚨 Estado Vazio 2: O gerente digitou um nome que não existe no estoque atual
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm max-w-2xl mx-auto">
                <h3 className="font-exa font-bold text-gray-400 uppercase tracking-wider">Nenhum veículo encontrado.</h3>
                <p className="font-exa text-xs text-gray-400 mt-2">Não encontramos nenhum carro correspondente a "{searchTerm}".</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-blue-600 font-exa text-xs font-bold uppercase tracking-wider hover:underline bg-transparent border-none cursor-pointer"
                >
                  Limpar Pesquisa
                </button>
              </div>
            ) : (
              // Grid ativo exibindo os resultados filtrados
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {carrosFiltrados.map((carro) => (
                    <CarCard key={carro.id} car={carro}>
                      <div className="flex gap-2 mt-4">
                          <button 
                            onClick={() => openEditModal(carro)}
                            className="flex-1 border border-gray-200 text-gray-600 font-exa text-[10px] font-bold uppercase py-3 md:py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => handleDeleteCar(carro.id, carro.modelo)}
                            className="flex-1 bg-red-50 text-red-600 font-exa text-[10px] font-bold uppercase py-3 md:py-2 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                          >
                            Remover
                          </button>
                      </div>
                    </CarCard>
                ))}
              </div>
            )}

        </div>

        {/* Modal de Veículo */}
        <VehicleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} initialData={selectedCar} />
        
        {/* Modal Genérico de Confirmação (Sair/Excluir) */}
        <ConfirmModal 
          isOpen={confirmModal.isOpen} title={confirmModal.title} message={confirmModal.message} 
          confirmText={confirmModal.confirmText} onConfirm={confirmModal.onConfirm} 
          onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })} 
        />

    </main>
  );
}