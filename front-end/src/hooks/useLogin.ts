import { useState } from 'react';
import { supabase } from '../lib/supabase'; // 🔹 Certifique-se que o lib/supabase.ts já usa createBrowserClient

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const login = async (email: string, senha: string) => {
    setLoading(true);

    if (!email || !senha) {
      setErrorMsg('Por favor, preencha o e-mail e a senha.');
      setLoading(false);
      return;
    }

    setErrorMsg(null);

    // 🔹 HIGIENE DE DADOS: Remove espaços extras do celular e deixa minúsculo
    const emailLimpo = email.trim().toLowerCase();
    const senhaLimpa = senha.trim();

    try {
      // 1. Autenticação
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: emailLimpo,
        password: senhaLimpa,
      });

      if (authError) throw authError;

      // 2. Autorização
      const { data: perfilData, error: perfilError } = await supabase
        .from('perfis')
        .select('cargo')
        .eq('id', authData.user.id)
        .single();

      if (perfilError) throw perfilError;

      // 3. Roteamento
      const cargo = perfilData.cargo;

      // 🚨 MUDANÇA DE OURO: window.location.href força o envio dos Cookies para o Middleware
      if (cargo === 'super_admin' || cargo === 'admin') {
        window.location.href = '/dashboard/admins'; 
      } else {
        window.location.href = '/dashboard/gerentes'; // 🔹 Coloque aqui a rota exata da tela do gerente
      }

    } catch (error: any) {
      console.error('Erro de Login:', error);
      if (error.message === 'Invalid login credentials') {
        setErrorMsg('E-mail ou senha errado. Verifique e tente novamente.');
      } else {
        setErrorMsg(`Erro ao entrar: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, errorMsg };
}