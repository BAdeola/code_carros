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
  // Checa se a foto_url existe e não é uma string vazia
  const temFoto = car.foto_url && car.foto_url !== '';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group border border-gray-100 flex flex-col h-full">
      
      {/* Imagem */}
      <div className="relative w-full h-56 bg-gray-100 overflow-hidden cursor-pointer">
        {temFoto ? (
          <Image 
            src={car.foto_url as string} // 🔹 Usando o nome correto da coluna
            alt={car.modelo || 'Automóvel'} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700" 
            unoptimized // 🔹 OBRIGATÓRIO: Desliga o cache rígido do Next para imagens do Supabase Storage
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-exa text-[10px] uppercase tracking-widest bg-gray-200">
            Sem Foto
          </div>
        )}
      </div>

      {/* Informações */}
      <div className="p-6 flex flex-col grow">
        <h2 className="font-zetta text-sm font-black uppercase leading-snug text-black mb-3 line-clamp-2">
          {car.modelo} {/* 🔹 Usando 'modelo' em vez de 'nome' */}
        </h2>
        
        <div className="flex flex-col gap-1 mb-6">
          {car.cor && (
            <p className="font-exa text-xs text-gray-500 uppercase tracking-wider flex justify-between">
              <span>Cor:</span> 
              <span className="font-bold text-gray-800">{car.cor}</span>
            </p>
          )}
          <p className="font-exa text-xs text-gray-500 uppercase tracking-wider flex justify-between">
            <span>Ano:</span> 
            <span className="font-bold text-gray-800">{car.ano}</span>
          </p>
        </div>

        {/* COMPOSIÇÃO */}
        <div className="mt-auto">
          {children}
        </div>
      </div>

    </div>
  );
}