'use server';

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function loginAbsolutoAction(email: string, senha: string) {
  try {
    const cookieStore = await cookies();

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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) throw new Error(error.message);

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

export async function deletarGerenteAction(uid: string) {
  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(uid);
    if (error) throw new Error(error.message);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function logoutAbsolutoAction() {
  try {
    const cookieStore = await cookies();

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

    await supabase.auth.signOut();

    // Apaga todos os cookies do Supabase de forma explícita
    const todosCookies = cookieStore.getAll();
    for (const cookie of todosCookies) {
      if (cookie.name.startsWith('sb-')) {
        cookieStore.set({
          name: cookie.name,
          value: '',
          maxAge: 0,
          path: '/',
          expires: new Date(0),
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao destruir sessão:', error);
    return { success: false };
  }
}