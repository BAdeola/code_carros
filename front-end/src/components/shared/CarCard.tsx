import Image from 'next/image';

// 1. Tipagem (Interface): Atualizada para bater EXATAMENTE com o banco do Supabase!
export interface CarType {
  id: number | string;
  modelo: string;       // 🔹 Antes era 'nome'
  fabricante?: string;
  cor?: string;         // 🔹 Se você tiver 'cor' no banco
  ano: number | string;
  foto_url?: string;    // 🔹 Antes era 'foto'. Tornamos opcional (?) para evitar quebras
  preco?: number;
  quilometragem?: number;
}

// 2. Props do Componente
interface CarCardProps {
  car: CarType;
  children?: React.ReactNode; 
}

export function CarCard({ car, children }: CarCardProps) {
  // 🔹 Verificação de Segurança (Graceful Degradation)
  const temFoto = car.foto_url && car.foto_url !== '';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group border border-gray-100 flex flex-col h-full">
      
      {/* 🖼️ IMAGEM E ETIQUETA */}
      <div className="relative w-full h-56 bg-gray-100 overflow-hidden cursor-pointer">
        {temFoto ? (
          <Image 
            src={car.foto_url as string} 
            alt={car.modelo || 'Automóvel'} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700" 
            unoptimized 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-exa text-[10px] uppercase tracking-widest bg-gray-200">
            Sem Foto
          </div>
        )}
        
        {/* 🔹 ETIQUETA PREMIUM DO FABRICANTE SOBRE A FOTO */}
        {car.fabricante && (
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full z-10">
            {car.fabricante}
          </div>
        )}
      </div>

      {/* 📝 INFORMAÇÕES DO CARRO */}
      <div className="p-6 flex flex-col grow">
        
        {/* 🔹 FABRICANTE DISCRETO ACIMA DO MODELO */}
        {car.fabricante && (
          <span className="font-exa text-[9px] text-blue-600 font-bold uppercase tracking-widest mb-1 block">
            {car.fabricante}
          </span>
        )}

        <h2 className="font-zetta text-sm font-black uppercase leading-snug text-black mb-4 line-clamp-2">
          {car.modelo} 
        </h2>
        
        {/* 📋 LISTA DE ESPECIFICAÇÕES (Refinada com bordas suaves) */}
        <div className="flex flex-col gap-1.5 mb-6">
          {car.cor && (
            <p className="font-exa text-xs text-gray-500 uppercase tracking-wider flex justify-between items-center border-b border-gray-50 pb-1.5">
              <span>Cor</span> 
              <span className="font-bold text-gray-800">{car.cor}</span>
            </p>
          )}
          <p className="font-exa text-xs text-gray-500 uppercase tracking-wider flex justify-between items-center border-b border-gray-50 pb-1.5">
            <span>Ano</span> 
            <span className="font-bold text-gray-800">{car.ano}</span>
          </p>
          {car.quilometragem !== undefined && (
            <p className="font-exa text-xs text-gray-500 uppercase tracking-wider flex justify-between items-center border-b border-gray-50 pb-1.5">
              <span>KM</span> 
              <span className="font-bold text-gray-800">{car.quilometragem.toLocaleString('pt-BR')}</span>
            </p>
          )}
        </div>

        {/* 💰 COMPOSIÇÃO: PREÇO + BOTÕES (Jogados para a base do card) */}
        <div className="mt-auto pt-2">
          
          {/* 🔹 BLOCO DE PREÇO FORMATADO */}
          {car.preco !== undefined && (
            <div className="mb-5">
              <span className="text-[9px] font-zetta text-gray-400 uppercase block mb-0.5">Valor do Veículo</span>
              <span className="font-exa font-bold text-2xl text-blue-600 tracking-tight">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(car.preco)}
              </span>
            </div>
          )}

          {/* Botões renderizados pelo 'children' */}
          {children}
        </div>
      </div>

    </div>
  );
}