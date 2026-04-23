'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import logoC from '../../../assets/logo_c.png'; 
import carroFundo from '../../../assets/login.png'; 

export default function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  
  const router = useRouter(); 

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); 
    console.log('Tentativa de login:', { usuario, senha });
    router.push('/dashboard'); 
  };

  return (
    <main className="min-h-screen w-full relative flex overflow-hidden bg-white md:bg-[#F3F3F2]">
      
      {/* 🚗 CAMADA 1: IMAGEM DE FUNDO - Escondida no celular, visível no desktop */}
      <div className="absolute inset-0 z-0 hidden md:block">
        <Image 
          src={carroFundo} 
          alt="Volkswagen prata de cima" 
          fill
          priority
          className="object-cover object-center" 
        />
      </div>

      {/* 📄 CAMADA 2: CONTEÚDO (FOREGROUND) */}
      <div className="relative z-10 w-full flex h-screen">
        
        {/* ⬜ COLUNA DE LOGIN - Tela cheia no mobile, card com borda no desktop */}
        <div className="bg-white h-full w-full md:max-w-lg p-8 sm:p-12 md:p-16 flex flex-col justify-between items-center rounded-none md:rounded-r-[40px] md:shadow-2xl">
          
          {/* Parte Superior: Logo, Título e Form */}
          <div className="w-full flex flex-col items-center mt-4 md:mt-0">
            {/* Logo 'C' no topo */}
            <div className="mb-10 w-full flex justify-start md:justify-left">
              <Image src={logoC} alt="Logo C" width={90} height={40} className="opacity-80" />
            </div>

            {/* Título Principal */}
            <div className="mb-12 w-full text-left">
               <h1 className="font-zetta text-3xl sm:text-4xl font-normal uppercase leading-tight text-black">
                  SUA<br />
                  <span className="font-bold tracking-tight">PLATAFORMA</span>
               </h1>
            </div>

            {/* 📝 FORMULÁRIO */}
            <form onSubmit={handleLogin} className="w-full space-y-6">
              <div className="space-y-2">
                <label htmlFor="usuario" className="font-exa text-[11px] uppercase tracking-[0.2em] font-medium text-black">
                  Usuário
                </label>
                <input 
                  id="usuario"
                  type="text" 
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="w-full p-4 bg-[#E5E7EB] rounded-2xl font-exa text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="senha" className="font-exa text-[11px] uppercase tracking-[0.2em] font-medium text-black">
                  Senha
                </label>
                <input 
                  id="senha"
                  type="password" 
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full p-4 bg-[#E5E7EB] rounded-2xl font-exa text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-gray-400"
                />
              </div>

              <button type="submit" className="mt-10 w-full bg-blue-600 text-white font-exa font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition-all">
                LOGIN
              </button>
            </form>
          </div>

          {/* Parte Inferior: Suporte */}
          <div className="w-full text-center mt-10 pb-6 md:pb-0">
            <p className="font-exa text-[10px] uppercase tracking-[0.2em] text-gray-400 leading-relaxed">
              Problemas com seu login?<br />
              <span className="text-gray-500 cursor-pointer hover:underline hover:text-blue-600 transition-colors">
                Entre em contato com nosso suporte
              </span>
            </p>
          </div>

        </div>

        {/* Espaço vazio à direita - Escondido no celular, pois o login toma tudo */}
        <div className="hidden md:block grow" />

      </div>
    </main>
  );
}