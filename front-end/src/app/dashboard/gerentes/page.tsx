'use client';

import { useState } from 'react'; 
import Image from 'next/image';
import { CarCard } from '../../../components/shared/CarCard'; 
import { VehicleModal } from '../../../components/shared/VehicleModal'; 
import { useGerenteData } from '../../../hooks/useGerenteData'; 
import { supabase } from '../../../lib/supabase';
import { ConfirmModal } from '../../../components/shared/ConfirmModal';
import { useRouter } from 'next/navigation';

import logoC from '../../../../assets/logo_c.png'; 
import { logoutAbsolutoAction } from '../../../actions/usuarios';

export default function DashboardCliente() {
  const router = useRouter();
  const { concessionaria, carros, gerente, loading, refetch } = useGerenteData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<any | null>(null);

  // 🔹 Bônus: Estado para o Modal de Exclusão de Carro
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, title: '', message: '', confirmText: '', onConfirm: () => {}
  });

  const handleLogout = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Sair do Sistema',
      message: 'Deseja realmente encerrar sua sessão e voltar para a página de login?',
      confirmText: 'Sim, Sair',
      onConfirm: async () => {
        await logoutAbsolutoAction();
        router.refresh(); // middleware detecta sessão nula e redireciona pro /login
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
              {/* 🔹 Aplicando a saudação dinâmica com o nome do Gerente */}
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
            
            {/* CABEÇALHO DA LOJA */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div className="w-full md:w-auto text-center md:text-left">
                <h1 className="font-exa text-2xl md:text-4xl font-black uppercase text-black leading-tight">
                  {concessionaria?.nome || 'Minha Loja'}
                </h1>
                <p className="font-exa text-xs text-gray-500 mt-2 uppercase tracking-[0.2em]">
                  Galeria de Veículos • <span className="font-bold text-blue-600 block md:inline">{carros.length} cadastrados</span>
                </p>
              </div>

              {/* Botão de Cadastro */}
              <button 
                onClick={openCreateModal}
                className="w-full md:w-auto bg-blue-600 text-white font-exa font-bold text-xs px-8 py-4 rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="text-xs leading-none">+</span> CADASTRAR AUTOMÓVEL
              </button>
            </div>

            {/* GALERIA DE CARROS */}
            {carros.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm max-w-2xl mx-auto">
                <h3 className="font-exa font-bold text-gray-400 uppercase tracking-wider">Seu estoque está vazio.</h3>
                <p className="font-exa text-xs text-gray-400 mt-2">Clique no botão superior para cadastrar o seu primeiro veículo!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {carros.map((carro) => (
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