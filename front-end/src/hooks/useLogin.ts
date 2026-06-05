'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAbsolutoAction } from '../actions/usuarios';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const login = async (email: string, senha: string) => {
    setLoading(true);

    if (!email || !senha) {
      setErrorMsg('Por favor, preencha o e-mail e a senha.');
      setLoading(false);
      return;
    }

    setErrorMsg(null);

    const resposta = await loginAbsolutoAction(email.trim().toLowerCase(), senha.trim());

    if (!resposta.success) {
      setErrorMsg(
        resposta.message === 'Invalid login credentials'
          ? 'E-mail ou senha errado. Verifique e tente novamente.'
          : `Erro ao entrar: ${resposta.message}`
      );
      setLoading(false);
      return;
    }

    // Cookie já está gravado no servidor.
    // Deixa o middleware redirecionar baseado no cargo.
    router.refresh(); // força o Next.js a re-checar os cookies
    router.replace('/login'); // o middleware vai interceptar e redirecionar
  };

  return { login, loading, errorMsg };
}