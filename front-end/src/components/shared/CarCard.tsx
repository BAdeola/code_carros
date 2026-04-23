import Image, { StaticImageData } from 'next/image';
// 1. Tipagem (Interface): O "contrato" de dados que o GKS/Mercado exige
export interface CarType {
  id: number;
  nome: string;
  cor: string;
  ano: string;
  foto: string | StaticImageData;
}

// 2. Props do Componente: Recebe o carro e "children" (elementos filhos)
interface CarCardProps {
  car: CarType;
  children?: React.ReactNode; // Permite injetar botões customizados!
}

export function CarCard({ car, children }: CarCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group border border-gray-100 flex flex-col h-full">
      
      {/* Imagem */}
      <div className="relative w-full h-56 bg-gray-100 overflow-hidden cursor-pointer">
        <Image 
          src={car.foto} 
          alt={car.nome} 
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700" 
        />
      </div>

      {/* Informações */}
      <div className="p-6 flex flex-col grow">
        <h2 className="font-zetta text-sm font-black uppercase leading-snug text-black mb-3 line-clamp-2">
          {car.nome}
        </h2>
        
        <div className="flex flex-col gap-1 mb-6">
          <p className="font-exa text-xs text-gray-500 uppercase tracking-wider flex justify-between">
            <span>Cor:</span> 
            <span className="font-bold text-gray-800">{car.cor}</span>
          </p>
          <p className="font-exa text-xs text-gray-500 uppercase tracking-wider flex justify-between">
            <span>Ano:</span> 
            <span className="font-bold text-gray-800">{car.ano}</span>
          </p>
        </div>

        {/* COMPOSIÇÃO: Aqui é onde a mágica acontece. 
            O espaço reservado para os botões do Cliente ou do Gerente */}
        <div className="mt-auto">
          {children}
        </div>
      </div>

    </div>
  );
}