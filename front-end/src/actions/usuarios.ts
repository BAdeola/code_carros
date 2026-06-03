'use server';

import { createClient } from '@supabase/supabase-js';

// 1. Instanciamos o cliente com a chave secreta de Admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function cadastrarGerenteAction(dados: {
  nome: string;
  email: string;
  senha: string;
  concessionariaId: string;
}) {
  try {
    // 2. Usamos auth.admin.createUser (isso NÃO desloga o Super Admin atual!)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: dados.email,
      password: dados.senha,
      email_confirm: true, // Já confirma o e-mail automaticamente
      user_metadata: { nome: dados.nome },
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error("Erro ao gerar ID do usuário.");

    // 3. Inserimos o perfil na nossa tabela pública
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

export async function atualizarGerenteAction(uid: string, dados: { nome: string; email: string; concessionariaId: string; senha?: string }) {
  try {
    // 1. Atualiza dados de autenticação (e a senha, SE o admin digitou uma nova)
    const authUpdate: any = { email: dados.email, user_metadata: { nome: dados.nome } };
    if (dados.senha && dados.senha.trim() !== '') {
      authUpdate.password = dados.senha; // Atualiza a senha forçadamente
    }
    
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(uid, authUpdate);
    if (authError) throw new Error(authError.message);

    // 2. Atualiza a tabela pública
    const { error: perfilError } = await supabaseAdmin.from('perfis').update({
      nome: dados.nome,
      email: dados.email,
      concessionaria_id: dados.concessionariaId || null
    }).eq('id', uid);

    if (perfilError) throw new Error(perfilError.message);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deletarGerenteAction(uid: string) {
  try {
    // O auth.admin.deleteUser geralmente já deleta o perfil em cascata se a FK estiver configurada
    const { error } = await supabaseAdmin.auth.admin.deleteUser(uid);
    if (error) throw new Error(error.message);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}