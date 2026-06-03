import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean; // Para deixar o botão vermelho em ações destrutivas
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDanger = true,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative text-center">
        
        {/* Ícone de Alerta */}
        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${isDanger ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h2 className="font-zetta font-black text-xl uppercase mb-4 text-gray-900">
          {title}
        </h2>
        
        <p className="font-exa text-sm text-gray-500 mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-4 w-full">
          <button 
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-600 font-exa font-bold text-xs uppercase py-4 rounded-xl hover:bg-gray-200 transition-colors"
          >
            {cancelText}
          </button>
          
          <button 
            onClick={onConfirm}
            className={`flex-1 font-exa font-bold text-xs uppercase py-4 rounded-xl text-white transition-all shadow-lg hover:scale-105 active:scale-95 ${
              isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}