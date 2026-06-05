import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAdminData() {
  const [concessionarias, setConcessionarias] = useState<any[]>([]);
  const [carros, setCarros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    const { data: perfisData } = await supabase.from('perfis').select('*').eq('cargo', 'gerente');
    setUsuarios(perfisData || []);

    try {
      // 1. Busca todas as concessionárias
      const { data: concData, error: concError } = await supabase
        .from('concessionarias')
        .select('*')
        .order('nome', { ascending: true });
      
      if (concError) throw concError;

      // 2. Busca todos os automóveis
      const { data: carData, error: carError } = await supabase
        .from('automoveis')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (carError) throw carError;

      setConcessionarias(concData || []);
      setCarros(carData || []);
    } catch (error: any) {
      console.error('Erro ao buscar dados do Admin:', error);
      alert('Erro ao carregar o painel: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Verificação Estrita ao carregar a página (inclusive ao usar o botão 'Voltar')
    const verificarSessao = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.replace('/login'); // 🔹 Expulsa imediatamente
      }
    };
    
    verificarSessao();

    // 2. Escuta ativa: Se a sessão for destruída enquanto a pessoa está na tela
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        window.location.replace('/login'); // 🔹 Expulsa imediatamente
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Executa automaticamente quando a página carrega
  useEffect(() => {
    fetchData();
  }, []);
  
  return { concessionarias, carros, usuarios, loading, refetch: fetchData };
}