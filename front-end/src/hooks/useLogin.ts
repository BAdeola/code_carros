import { useState } from 'react';
import { loginAbsolutoAction } from '../actions/usuarios'; 

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

    const emailLimpo = email.trim().toLowerCase();
    const senhaLimpa = senha.trim();

    // 🚨 Chama a Server Action! O Servidor faz o login e já crava o Cookie.
    const resposta = await loginAbsolutoAction(emailLimpo, senhaLimpa);

    if (!resposta.success) {
      if (resposta.message === 'Invalid login credentials') {
        setErrorMsg('E-mail ou senha errado. Verifique e tente novamente.');
      } else {
        setErrorMsg(`Erro ao entrar: ${resposta.message}`);
      }
      setLoading(false);
      return;
    }

    // Se chegou aqui, o Cookie JÁ ESTÁ GRAVADO e validado! 
    // Basta olhar o cargo e mandar para a tela certa.
    if (resposta.cargo === 'super_admin' || resposta.cargo === 'admin') {
      window.location.href = '/dashboard/admins'; 
    } else {
      window.location.href = '/dashboard/gerentes'; // 🔹 Ajuste se a rota do seu gerente for diferente
    }
  };

  return { login, loading, errorMsg };
}