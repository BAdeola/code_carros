import Image from 'next/image';
import logoC from '../../../assets/logo_c.png';

interface AdminSidebarProps {
  activeView: 'automoveis' | 'concessionarias' | 'usuarios';
  setActiveView: (view: 'automoveis' | 'concessionarias' | 'usuarios') => void;
  onLogout: () => void; // 👈 nova prop
}

export function AdminSidebar({ activeView, setActiveView, onLogout }: AdminSidebarProps) {
  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex-col hidden md:flex sticky top-0 h-screen">
      
      {/* Logo e Branding */}
      <div className="p-8 border-b border-gray-100 flex items-center gap-4">
         <Image src={logoC} alt="Logo" width={40} height={40} />
         <div>
           <h2 className="font-zetta text-sm font-black italic uppercase leading-none">CODE <span className="text-blue-600">CARROS</span></h2>
           <p className="font-exa text-[9px] uppercase tracking-widest text-gray-400 mt-1">Admin Panel</p>
         </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-6 space-y-2">
        <button 
          onClick={() => setActiveView('automoveis')}
          className={`w-full text-left font-exa text-xs font-bold uppercase tracking-widest p-4 rounded-xl transition-all cursor-pointer ${
            activeView === 'automoveis' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          Automóveis
        </button>
        <button 
          onClick={() => setActiveView('concessionarias')}
          className={`w-full text-left font-exa text-xs font-bold uppercase tracking-widest p-4 rounded-xl transition-all cursor-pointer ${
            activeView === 'concessionarias' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          Concessionárias
        </button>
        
        <button
          onClick={() => setActiveView('usuarios')}
          className={`w-full flex items-center gap-4 px-6 py-4 font-exa text-xs font-bold uppercase tracking-widest transition-all rounded-xl ${
            activeView === 'usuarios' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          Usuários
        </button>
      </nav>

      {/* User Info & Logout */}
      <div className="p-6 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="font-exa font-bold text-xs text-gray-800">Administrador Geral</span>
          {/* 👇 Era Link href="/", agora chama o modal de confirmação */}
          <button
            onClick={onLogout}
            className="font-exa font-bold text-[12px] text-red-500 hover:underline uppercase cursor-pointer bg-transparent border-none"
          >
            Sair
          </button>
        </div>
      </div>
    </aside>
  );
}