import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // 🔹 Novo estado de erro
  const router = useRouter();

  const login = async (email: string, senha: string) => {
    setLoading(true);

    if (!email || !senha) {
      setErrorMsg('Por favor, preencha o e-mail e a senha.');
      setLoading(false);
      return;
    }

    setErrorMsg(null); // Limpa o erro anterior ao tentar logar de novo

    try {
      // 1. Autenticação
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
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

      if (cargo === 'super_admin' || cargo === 'admin') {
        router.push('/dashboard/admins'); 
      } else {
        router.push('/dashboard'); 
      }

    } catch (error: any) {
      console.error('Erro de Login:', error);
      // 🔹 Se as credenciais não baterem, define a frase que você pediu
      if (error.message === 'Invalid login credentials') {
        setErrorMsg('E-mail ou senha errado. Verifique e tente novamente.');
      } else {
        setErrorMsg(`Erro ao entrar: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Devolvemos o errorMsg para a tela poder usar
  return { login, loading, errorMsg };
}