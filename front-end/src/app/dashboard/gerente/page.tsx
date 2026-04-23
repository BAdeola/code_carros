'use client';

import { useState } from 'react';
import { CarCard, CarType } from '../../../components/shared/CarCard'; 
import { AdminSidebar } from '../../../components/layout/AdminSidebar'; 
import { VehicleModal } from '@/src/components/shared/VehicleModal';

// 🗄️ MOCK DATA: Dados Relacionais
const concessionarias = [
  { id: 1, nome: "Saga Motors", local: "São Paulo, SP", totalCarros: 2 },
  { id: 2, nome: "Eurobike", local: "Brasília, DF", totalCarros: 1 },
  { id: 3, nome: "Localiza Seminovos", local: "Belo Horizonte, MG", totalCarros: 0 }, // Coloquei zero aqui para testarmos o estado vazio
];

const carrosMock = [
  { id: 1, concessionariaId: 1, nome: "Volkswagen Nivus Highline", cor: "Cinza Platinum", ano: "2024", foto: "/volkswagen-grey.jpg" },
  { id: 2, concessionariaId: 1, nome: "Volvo XC90 Recharge", cor: "Prata Metálico", ano: "2023", foto: "/volvo-silver.jpg" },
  { id: 3, concessionariaId: 2, nome: "Toyota RAV4 Hybrid", cor: "Branco Lunar", ano: "2024", foto: "/aperto-mao.jpg" },
  { id: 4, concessionariaId: 3, nome: "Mini Cooper S", cor: "Cinza Escuro", ano: "2022", foto: "/header.png" },
];

export default function DashboardGerente() {
  const [activeView, setActiveView] = useState<'automoveis' | 'concessionarias'>('automoveis');
  const [filtroConcessionaria, setFiltroConcessionaria] = useState<number>(0);
  
  // 🔹 2. Estados do Modal de Carros
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<any>(null);

  const carrosFiltrados = filtroConcessionaria === 0 
    ? carrosMock 
    : carrosMock.filter(c => c.concessionariaId === filtroConcessionaria);

  // 🔹 3. Funções do Modal
  const openCreateCarModal = () => {
    setSelectedCar(null);
    setIsCarModalOpen(true);
  };

  const openEditCarModal = (carro: any) => {
    setSelectedCar(carro);
    setIsCarModalOpen(true);
  };

  const handleSaveCar = (data: any) => {
    console.log("Salvar pelo Gerente (com concessionariaId):", data);
    setIsCarModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#F3F3F2] flex">
      <AdminSidebar activeView={activeView} setActiveView={setActiveView} />

      <section className="flex-1 overflow-y-auto h-screen relative">
        {/* Topbar Mobile... */}

        {/* CONTEÚDO: AUTOMÓVEIS */}
        {activeView === 'automoveis' && (
          <div className="p-8 md:p-12 max-w-7xl mx-auto">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div>
                <h1 className="font-exa text-3xl font-black uppercase text-black">Gestão de Galeria</h1>
                <p className="font-exa text-sm text-gray-500 mt-2 uppercase tracking-[0.2em]">Todos os veículos do sistema</p>
              </div>

              {/* 🔹 4. Botão de Cadastrar e Filtro lado a lado */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                <button 
                  onClick={openCreateCarModal}
                  className="bg-blue-600 text-white font-exa font-bold text-xs px-6 py-4 rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
                >
                  + CADASTRAR AUTOMÓVEL
                </button>

                <div className="flex items-center gap-3">
                  <span className="font-exa text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden md:inline">Filtrar:</span>
                  <select 
                    className="w-full md:w-56 p-4 bg-white border border-gray-200 rounded-xl font-exa text-sm outline-none focus:ring-2 focus:ring-blue-600 shadow-sm cursor-pointer"
                    value={filtroConcessionaria}
                    onChange={(e) => setFiltroConcessionaria(Number(e.target.value))}
                  >
                    <option value={0}>Todas as Lojas</option>
                    {concessionarias.map(c => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Listagem de Carros (Mesma lógica de agrupamento de antes) */}
            <div className="space-y-16">
              {concessionarias
                .filter(conc => filtroConcessionaria === 0 || conc.id === filtroConcessionaria)
                .map((conc) => {
                  const carrosDestaConcessionaria = carrosMock.filter(c => c.concessionariaId === conc.id);
                  if (filtroConcessionaria === 0 && carrosDestaConcessionaria.length === 0) return null; 

                  return (
                    <div key={conc.id} className="bg-white/50 p-6 rounded-4xl border border-gray-100 shadow-sm">
                      {/* ... Header do bloco ... */}
                      <div className="mb-8 flex items-center gap-4 border-b border-gray-200/60 pb-6">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-zetta font-black text-xl shadow-md">
                          {conc.nome.charAt(0)}
                        </div>
                        <div>
                          <h2 className="font-zetta text-2xl font-black uppercase text-black">{conc.nome}</h2>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                        {carrosDestaConcessionaria.map((carro) => (
                          <CarCard key={carro.id} car={carro as any}>
                            <div className="flex gap-2">
                                <button 
                                  onClick={() => openEditCarModal(carro)}
                                  className="flex-1 border border-blue-200 text-blue-600 font-exa text-[10px] font-bold uppercase py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                                >
                                  Editar (Admin)
                                </button>
                                {/* ... Botão remover ... */}
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

        {/* 🏢 CONTEÚDO: CONCESSIONÁRIAS (MANTIDO IGUAL) */}
        {activeView === 'concessionarias' && (
          <div className="p-8 md:p-12 max-w-7xl mx-auto">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <div>
                <h1 className="font-exa text-3xl font-black uppercase text-black">Concessionárias</h1>
                <p className="font-exa text-sm text-gray-500 mt-2 uppercase tracking-[0.2em]">Gestão de Clientes B2B</p>
              </div>

              {/* Botão de Cadastro de Concessionária */}
              <button className="bg-blue-600 text-white font-exa font-bold text-sm px-8 py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all cursor-pointer">
                + NOVA CONCESSIONÁRIA
              </button>
            </div>

            {/* Lista de Concessionárias (Cards Horizontais) */}
            <div className="space-y-4">
              {concessionarias.map((conc) => (
                <div key={conc.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-all">
                  
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-zetta font-black text-xl">
                      {conc.nome.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-zetta font-black uppercase text-lg text-black">{conc.nome}</h3>
                      <p className="font-exa text-xs text-gray-500 uppercase tracking-widest mt-1">{conc.local}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-center">
                      <span className="block font-zetta font-black text-2xl text-blue-600">{conc.totalCarros}</span>
                      <span className="font-exa text-[9px] uppercase tracking-widest text-gray-400">Veículos</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="px-6 py-3 border border-gray-200 text-gray-600 font-exa text-[10px] font-bold uppercase rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                        Editar
                      </button>
                      <button className="px-6 py-3 bg-red-50 text-red-600 font-exa text-[10px] font-bold uppercase rounded-xl hover:bg-red-100 transition-colors cursor-pointer">
                        Remover
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        <VehicleModal 
          isOpen={isCarModalOpen}
          onClose={() => setIsCarModalOpen(false)}
          onSave={handleSaveCar}
          initialData={selectedCar}
          dealerships={concessionarias} // <-- Passando a lista para o modal habilitar o select!
        />

      </section>
    </main>
  );
}