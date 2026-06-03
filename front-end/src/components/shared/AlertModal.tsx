import React from 'react';

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  type?: 'error' | 'success' | 'info';
}

export function AlertModal({
  isOpen,
  title,
  message,
  onClose,
  type = 'error',
}: AlertModalProps) {
  if (!isOpen) return null;

  // Configurações de cores dinâmicas baseadas no tipo do alerta
  const config = {
    error: {
      bgIcon: 'bg-red-100 text-red-600',
      btn: 'bg-red-600 hover:bg-red-700 shadow-red-200',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    success: {
      bgIcon: 'bg-green-100 text-green-600',
      btn: 'bg-green-600 hover:bg-green-700 shadow-green-200',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    info: {
      bgIcon: 'bg-blue-100 text-blue-600',
      btn: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const currentConfig = config[type];

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl relative text-center border border-gray-100">
        
        {/* Ícone Dinâmico */}
        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${currentConfig.bgIcon}`}>
          {currentConfig.icon}
        </div>

        <h2 className="font-zetta font-black text-lg uppercase mb-3 text-gray-900 leading-tight">
          {title}
        </h2>
        
        <p className="font-exa text-xs text-gray-500 mb-6 leading-relaxed">
          {message}
        </p>

        <button 
          onClick={onClose}
          className={`w-full font-exa font-bold text-xs uppercase py-4 rounded-xl text-white transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${currentConfig.btn}`}
        >
          Entendido
        </button>

      </div>
    </div>
  );
}