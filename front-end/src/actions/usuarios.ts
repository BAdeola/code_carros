'use server';

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// 1. Instanciamos o cliente Admin com a Service Role Key (exclusivo para bypassar RLS e gerenciar Auth)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * 🚀 NOVA FUNÇÃO: Realiza o Login diretamente no Servidor
 * Garante que os Cookies HTTP-Only sejam gravados instantaneamente antes de responder ao cliente.
 */
export async function loginAbsolutoAction(email: string, senha: string) {
  try {
    const cookieStore = await cookies();

    // Cria o cliente Supabase do servidor usando a nova especificação getAll/setAll recomendada para Next.js 15
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set({ name, value, ...options });
              });
            } catch (error) {}
          },
        },
      }
    );

    // Executa a autenticação no back-end
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) throw new Error(error.message);

    // Busca o cargo do perfil recém-logado para orientar o roteamento no front-end
    const { data: perfil } = await supabase
      .from('perfis')
      .select('cargo')
      .eq('id', data.user.id)
      .single();

    return { success: true, cargo: perfil?.cargo };
  } catch (error: any) {
    console.error('Erro no loginAbsolutoAction:', error.message);
    return { success: false, message: error.message };
  }
}

/**
 * 🔐 Cadastra um novo Gerente via Auth Admin (Não desloga o administrador)
 */
export async function cadastrarGerenteAction(dados: {
  nome: string;
  email: string;
  senha: string;
  concessionariaId: string;
}) {
  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: dados.email,
      password: dados.senha,
      email_confirm: true,
      user_metadata: { nome: dados.nome },
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error('Erro ao gerar ID único do usuário.');

    const { error: perfilError } = await supabaseAdmin.from('perfis').insert([
      {
        id: authData.user.id,
        email: dados.email,
        nome: dados.nome,
        cargo: 'gerente',
        concessionaria_id: dados.concessionariaId || null,
      },
    ]);

    if (perfilError) throw new Error(perfilError.message);

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/**
 * ✏️ Atualiza os dados cadastrais e/ou senha forçada de um Gerente existente
 */
export async function atualizarGerenteAction(
  uid: string,
  dados: { nome: string; email: string; concessionariaId: string; senha?: string }
) {
  try {
    const authUpdate: any = { email: dados.email, user_metadata: { nome: dados.nome } };
    
    if (dados.senha && dados.senha.trim() !== '') {
      authUpdate.password = dados.senha;
    }

    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(uid, authUpdate);
    if (authError) throw new Error(authError.message);

    const { error: perfilError } = await supabaseAdmin
      .from('perfis')
      .update({
        nome: dados.nome,
        email: dados.email,
        concessionaria_id: dados.concessionariaId || null,
      })
      .eq('id', uid);

    if (perfilError) throw new Error(perfilError.message);

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/**
 * 🗑️ Remove permanentemente um usuário do banco de dados (Auth e Cascade Perfil)
 */
export async function deletarGerenteAction(uid: string) {
  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(uid);
    if (error) throw new Error(error.message);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/**
 * 🛑 Destrói de forma atômica e limpa os cookies de sessão e revoga o token JWT
 */
export async function logoutAbsolutoAction() {
  try {
    const cookieStore = await cookies();

    const supabaseCookies = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set({ name, value, ...options });
              });
            } catch (error) {}
          },
        },
      }
    );

    // Informa o servidor do Supabase para invalidar a sessão
    await supabaseCookies.auth.signOut();

    // Expira manualmente qualquer cookie remanescente do Supabase no navegador
    const todosCookies = cookieStore.getAll();
    todosCookies.forEach((cookie: any) => {
      if (cookie.name.includes('sb-') || cookie.name.includes('auth')) {
        try {
          cookieStore.set({
            name: cookie.name,
            value: '',
            maxAge: -1,
            path: '/',
          });
        } catch (e) {}
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao destruir sessão:', error);
    return { success: false };
  }
}