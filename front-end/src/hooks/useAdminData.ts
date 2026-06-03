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

  // Executa automaticamente quando a página carrega
  useEffect(() => {
    fetchData();
  }, []);

  // Retornamos os dados e a função fetchData para podermos atualizar a tela 
  // automaticamente depois que o admin salvar ou apagar algo!
  return { concessionarias, carros, usuarios, loading, refetch: fetchData };
}