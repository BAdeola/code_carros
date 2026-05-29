'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLogin } from '../../hooks/useLogin';

import logoC from '../../../assets/logo_c.png'; 
import carroFundo from '../../../assets/login.png'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  // 🔹 Puxamos o errorMsg de dentro do nosso Hook
  const { login, loading, errorMsg } = useLogin(); 

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); 
    login(email, senha);
  };

  return (
    <main className="min-h-screen w-full relative flex overflow-hidden bg-white md:bg-[#F3F3F2]">
      {/* IMAGEM DE FUNDO */}
      <div className="absolute inset-0 z-0 hidden md:block">
        <Image src={carroFundo} alt="Volkswagen prata de cima" fill priority className="object-cover object-center" />
      </div>

      {/* CONTEÚDO */}
      <div className="relative z-10 w-full flex h-screen">
        <div className="bg-white h-full overflow-y-auto w-full md:max-w-lg p-8 sm:p-12 md:p-16 flex flex-col justify-between items-center rounded-none md:rounded-r-[40px] md:shadow-2xl">
          
          <div className="w-full flex flex-col items-center mt-1 md:mt-0">
            <div className="mb-10 w-full flex justify-start md:justify-left">
              <Image src={logoC} alt="Logo C" width={90} height={40} className="opacity-80 w-auto h-auto" />
            </div>

            <div className="mb-12 w-full text-left">
               <h1 className="font-zetta text-3xl sm:text-4xl font-normal uppercase leading-tight text-black">
                 SUA<br /><span className="font-bold tracking-tight">PLATAFORMA</span>
               </h1>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="font-exa text-[11px] uppercase tracking-[0.2em] font-medium text-black">E-mail</label>
                <input 
                  id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading}
                  className="w-full p-4 bg-[#E5E7EB] rounded-2xl font-exa text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-gray-400 disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="senha" className="font-exa text-[11px] uppercase tracking-[0.2em] font-medium text-black">Senha</label>
                <input 
                  id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} disabled={loading}
                  className="w-full p-4 bg-[#E5E7EB] rounded-2xl font-exa text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-gray-400 disabled:opacity-50"
                />
              </div>

              {/* 🚨 MENSAGEM VERMELHA DE ERRO DINÂMICA */}
              {errorMsg && (
                <div className="text-red-500 font-exa text-xs uppercase tracking-wider font-semibold bg-red-50 p-3 rounded-xl border border-red-100 text-left w-full animate-fade-in mt-4">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Reduzi a margem superior de mt-10 para mt-6 para compensar o espaço caso o erro apareça */}
              <button type="submit" disabled={loading} className="mt-6 mb-10 w-full bg-blue-600 text-white font-exa font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition-all disabled:opacity-70 disabled:hover:scale-100 cursor-pointer disabled:cursor-not-allowed">
                {loading ? 'ENTRANDO...' : 'LOGIN'}
              </button>
            </form>
          </div>
        </div>
        <div className="hidden md:block grow" />
      </div>
    </main>
  );
}