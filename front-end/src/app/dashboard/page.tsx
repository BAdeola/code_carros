'use client';

import { useState } from 'react'; 
import Link from 'next/link';
import Image from 'next/image';
import { CarCard, CarType } from '../../components/shared/CarCard'; 
import { VehicleModal } from '../../components/shared/VehicleModal'; 

import nivus from '../../../assets/mock_carros/vw-nivus-highline-2020-superteste.jpg';
import volvo from '../../../assets/mock_carros/Volvo-XC90-Recharge-Plus-2023-2.jpg';
import rava from '../../../assets/mock_carros/Toyota-RAV4-SX-AWD-12.jpg';
import cooper from '../../../assets/mock_carros/images.jpg';
import logoC from '../../../assets/logo_c.png'; 

// Nossos dados mockados
const concessionaria = { nome: "Saga Motors", totalCarros: 12 };

const carros: CarType[] = [
  { id: 1, nome: "Volkswagen Nivus Highline", cor: "Cinza Platinum", ano: "2024", foto: nivus },
  { id: 2, nome: "Volvo XC90 Recharge", cor: "Prata Metálico", ano: "2023", foto: volvo },
  { id: 3, nome: "Toyota RAV4 Hybrid", cor: "Branco Lunar", ano: "2024", foto: rava },
  { id: 4, nome: "Mini Cooper S", cor: "Cinza Escuro", ano: "2022", foto: cooper },
];

export default function DashboardCliente() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);

  const handleSave = (data: any) => {
    console.log("Dados recebidos do modal para salvar:", data);
    setIsModalOpen(false);
  };

  const openEditModal = (carro: CarType) => {
    setSelectedCar(carro); 
    setIsModalOpen(true);  
  };

  const openCreateModal = () => {
    setSelectedCar(null); 
    setIsModalOpen(true); 
  };

  return (
    <main className="min-h-screen bg-[#F3F3F2] pb-20 relative">
      
        {/* NAVBAR */}
        {/* Mantive o py-6 padrão, apenas reduzi o padding lateral no mobile para px-6 */}
        <nav className="bg-white px-6 md:px-10 py-6 flex justify-between items-center shadow-sm sticky top-0 z-40">
            <div className="w-full flex justify-left">
               {/* Tamanhos originais mantidos */}
               <Image src={logoC} alt="Logo C" width={90} height={40} className="opacity-80" />
            </div>
            
            {/* Mantive o gap-16, apenas reduzi para gap-4 no mobile */}
            <div className="flex items-center gap-4 md:gap-16">
                <span className="font-exa font-bold text-xs md:text-sm text-gray-500 whitespace-nowrap">
                  Olá, {concessionaria.nome}
                </span>
                <Link href="/" className="font-exa font-bold text-[10px] md:text-xs text-red-500 hover:underline tracking-widest uppercase">
                  Sair
                </Link>
            </div>
        </nav>

        {/* CONTAINER PRINCIPAL */}
        {/* Mantive px-10 para desktop, px-6 para mobile */}
        <div className="px-6 md:px-10 mt-12 max-w-7xl mx-auto">
            
            {/* CABEÇALHO */}
            {/* Mantive o flex-col md:flex-row idêntico ao seu */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div className="w-full md:w-auto text-center md:text-left">
                <h1 className="font-exa text-3xl md:text-4xl font-black uppercase text-black leading-tight">
                  {concessionaria.nome}
                </h1>
                <p className="font-exa text-sm text-gray-500 mt-2 uppercase tracking-[0.2em]">
                  Galeria de Veículos • <span className="font-bold text-blue-600 block md:inline">{concessionaria.totalCarros} cadastrados</span>
                </p>
              </div>

              {/* Botão de Cadastro */}
              {/* Adicionei apenas w-full no mobile, no desktop continua igual px-8 py-4 */}
              <button 
                onClick={openCreateModal}
                className="w-full md:w-auto bg-blue-600 text-white font-exa font-bold text-sm px-8 py-4 rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="text-xl leading-none">+</span> CADASTRAR AUTOMÓVEL
              </button>
            </div>

            {/* GALERIA DE CARROS */}
            {/* A Grid original sua já cuidava da responsividade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {carros.map((carro) => (
                  <CarCard key={carro.id} car={carro}>
                    <div className="flex gap-2">
                        <button 
                          onClick={() => openEditModal(carro)}
                          className="flex-1 border border-gray-200 text-gray-600 font-exa text-[10px] font-bold uppercase py-3 md:py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          Editar
                        </button>
                        <button className="flex-1 bg-red-50 text-red-600 font-exa text-[10px] font-bold uppercase py-3 md:py-2 rounded-lg hover:bg-red-100 transition-colors cursor-pointer">
                          Remover
                        </button>
                    </div>
                  </CarCard>
              ))}
            </div>

        </div>

        {/* Modal renderizado no final da página */}
        <VehicleModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          initialData={selectedCar}
        />

    </main>
  );
}