'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logoC from '../../../assets/logo_c.png'; 
import { useCarros } from '../../hooks/useCarros';

export default function AutomoveisPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { carros, loading } = useCarros();

  // 🔹 1. ESTADOS DOS FILTROS
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [selectedMarcas, setSelectedMarcas] = useState<string[]>([]);
  
  // Estados para os preços (Iniciamos com valores temporários que serão atualizados)
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);

  // 🔹 2. EXTRAÇÃO DINÂMICA (O Segredo do Arquiteto)
  // Usamos useMemo para o React não recalcular isso à toa. 'Set' remove as duplicatas!
  const marcasDisponiveis = useMemo(() => {
    return Array.from(new Set(carros.map((c) => c.fabricante))).sort();
  }, [carros]);

  const precoMinimoDB = useMemo(() => {
    return carros.length > 0 ? Math.min(...carros.map((c) => c.preco)) : 0;
  }, [carros]);

  const precoMaximoDB = useMemo(() => {
    return carros.length > 0 ? Math.max(...carros.map((c) => c.preco)) : 1000000;
  }, [carros]);

  // Atualiza o slider quando os dados chegarem do banco
  useEffect(() => {
    if (carros.length > 0) {
      setMinPrice(precoMinimoDB);
      setMaxPrice(precoMaximoDB);
    }
  }, [carros, precoMinimoDB, precoMaximoDB]);

  // 🔹 3. LÓGICA DE FILTRAGEM (Estado Derivado)
  const carrosFiltrados = useMemo(() => {
    return carros
      .filter((carro) => {
        // Filtro de Busca (Texto)
        const matchBusca = 
          carro.modelo.toLowerCase().includes(searchTerm.toLowerCase()) || 
          carro.fabricante.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filtro de Marcas
        const matchMarca = selectedMarcas.length === 0 || selectedMarcas.includes(carro.fabricante);
        
        // Filtro de Preço
        const matchPreco = carro.preco >= minPrice && carro.preco <= maxPrice;

        return matchBusca && matchMarca && matchPreco;
      })
      .sort((a, b) => {
        // Ordenação
        if (sortOrder === 'asc') return a.preco - b.preco;
        if (sortOrder === 'desc') return b.preco - a.preco;
        return 0; // Recentes (ordem que veio do banco)
      });
  }, [carros, searchTerm, selectedMarcas, minPrice, maxPrice, sortOrder]);

  // Função auxiliar para marcar/desmarcar o checkbox da marca
  const toggleMarca = (marca: string) => {
    setSelectedMarcas((prev) => 
      prev.includes(marca) ? prev.filter((m) => m !== marca) : [...prev, marca]
    );
  };

  return (
    <div className="min-h-screen bg-[#F3F3F2]">
      
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 md:px-10 py-4 bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
        <Link href="/">
          <Image src={logoC} alt="Logo" width={60} height={60} className='opacity-80 md:w-17.5 md:h-17.5' />
        </Link>
        <div className="flex gap-4 md:gap-8 text-xs md:text-sm font-medium uppercase tracking-widest font-zetta text-black">
          <Link href="/" className="hover:opacity-70 transition-colors">Início</Link>
          <Link href="/login" className="border-b-2 border-black pb-1 hover:opacity-70 transition-all">Login</Link>
        </div>
      </nav>

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 py-10 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-exa font-bold uppercase tracking-tighter text-black">Catálogo de <span className="text-blue-600">Veículos</span></h1>
            <p className="font-zetta text-xs text-gray-500 uppercase tracking-[0.2em] mt-2">Encontre o carro ideal para você</p>
          </div>
          
          <div className="w-full md:w-96 relative">
            <input 
              type="text" 
              placeholder="Buscar modelo ou marca..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // 🔹 Liga a barra de pesquisa ao estado
              className="w-full bg-[#F3F3F2] p-4 rounded-xl font-exa text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all pl-7"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-12 flex flex-col md:flex-row gap-10">
        
        {/* SIDEBAR DE FILTROS */}
        <div className="w-full md:w-64 shrink-0">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden w-full bg-white border border-gray-200 p-4 rounded-xl flex justify-between items-center shadow-sm cursor-pointer mb-4"
          >
            <span className="font-exa font-bold text-xs uppercase tracking-widest text-gray-800">Filtros de Busca</span>
            <span className="text-gray-500 font-bold text-lg leading-none">{isFilterOpen ? '−' : '+'}</span>
          </button>

          <aside className={`${isFilterOpen ? 'block' : 'hidden'} md:block space-y-10 bg-white md:bg-transparent p-6 md:p-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-gray-100 md:border-none`}>
            
            {/* Ordenação */}
            <div>
              <h3 className="font-exa font-bold text-xs uppercase tracking-widest text-gray-800 mb-4 border-b border-gray-200 pb-2">Ordenar</h3>
              <select 
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value)} // 🔹 Liga a ordenação ao estado
                className="w-full bg-[#F3F3F2] md:bg-white p-3 rounded-xl border border-gray-200 font-exa text-sm outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                <option value="">Recentes</option>
                <option value="asc">Menor Preço</option>
                <option value="desc">Maior Preço</option>
              </select>
            </div>

            {/* Faixa de Preço */}
            <div>
              <h3 className="font-exa font-bold text-xs uppercase tracking-widest text-gray-800 mb-4 border-b border-gray-200 pb-2">Faixa de Preço</h3>
              <div className="flex gap-2 mb-4">
                <div className="flex-1">
                  <label className="text-[9px] font-zetta uppercase text-gray-400">Min (R$)</label>
                  <input 
                    type="number" 
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))} // 🔹 Input mínimo
                    className="w-full bg-[#F3F3F2] md:bg-white border border-gray-200 p-2 rounded-lg text-xs font-exa" 
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[9px] font-zetta uppercase text-gray-400">Max (R$)</label>
                  <input 
                    type="number" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))} // 🔹 Input máximo
                    className="w-full bg-[#F3F3F2] md:bg-white border border-gray-200 p-2 rounded-lg text-xs font-exa" 
                  />
                </div>
              </div>

              {/* Slider Visual */}
              <input 
                type="range" 
                min={precoMinimoDB} 
                max={precoMaximoDB} 
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))} // 🔹 Slider altera o preço máximo
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Filtro de Marcas Dinâmico */}
            <div>
              <h3 className="font-exa font-bold text-xs uppercase tracking-widest text-gray-800 mb-4 border-b border-gray-200 pb-2">Marcas</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {/* 🔹 Renderiza as marcas vindas do banco! */}
                {marcasDisponiveis.map((marca, index) => (
                  <label key={index} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedMarcas.includes(marca)}
                      onChange={() => toggleMarca(marca)} // 🔹 Checkbox dinâmico
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-600 cursor-pointer"
                    />
                    <span className="font-exa text-sm text-gray-600 group-hover:text-black transition-colors">{marca}</span>
                  </label>
                ))}
              </div>
            </div>

          </aside>
        </div>

        {/* 🚗 GRID DE VEÍCULOS */}
        <section className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <span className="font-exa text-xs text-gray-500 uppercase tracking-widest">
              {/* 🔹 Mostramos o tamanho da lista filtrada */}
              {loading ? 'Carregando estoque...' : `Mostrando ${carrosFiltrados.length} resultados`}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50">
              {[1, 2, 3].map((i) => <div key={i} className="bg-gray-200 h-95 rounded-2xl animate-pulse" />)}
            </div>
          ) : carrosFiltrados.length === 0 ? (
            // 🔹 Feedback quando o filtro não encontra nada
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
              <h3 className="font-exa font-bold text-gray-400">Nenhum veículo encontrado com estes filtros.</h3>
              <button onClick={() => { setSearchTerm(''); setSelectedMarcas([]); setMinPrice(precoMinimoDB); setMaxPrice(precoMaximoDB); }} className="mt-4 text-blue-600 font-bold text-sm hover:underline">
                Limpar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 🔹 Iteramos sobre a variável 'carrosFiltrados' */}
              {carrosFiltrados.map((carro) => (
                <div key={carro.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-blue-100 flex flex-col">
                  
                  {/* Imagem do Carro */}
                  <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                    {carro.foto_url ? (
                      <Image 
                        src={carro.foto_url} alt={carro.modelo} fill unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-exa text-[10px]">SEM FOTO</div>
                    )}
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full z-10">
                      {carro.fabricante}
                    </div>
                  </div>

                  {/* Informações */}
                  <div className="p-6 flex flex-col grow">
                    <h3 className="font-exa font-bold text-lg text-black leading-tight uppercase mb-1 line-clamp-1">{carro.modelo}</h3>
                    
                    <div className="flex gap-2 mb-4">
                        <span className="font-zetta text-[9px] text-gray-400 uppercase">{carro.ano}</span>
                        <span className="font-zetta text-[9px] text-gray-400 uppercase">•</span>
                        <span className="font-zetta text-[9px] text-gray-400 uppercase">{carro.quilometragem.toLocaleString()} KM</span>
                    </div>
                    
                    <div className="mt-auto">
                      <span className="text-xs font-zetta text-gray-500 block mb-1">A partir de</span>
                      <span className="font-exa font-semibold text-2xl text-blue-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(carro.preco)}
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}