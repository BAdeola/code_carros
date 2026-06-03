import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useGerenteData() {
  const [concessionaria, setConcessionaria] = useState<any>(null);
  const [carros, setCarros] = useState<any[]>([]);
  const [gerente, setGerente] = useState<any>(null); // 🔹 Novo estado para o perfil
  const [loading, setLoading] = useState(true);

  const fetchDados = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Busca o perfil do gerente (incluindo o NOME)
      const { data: perfilData } = await supabase.from('perfis').select('*').eq('id', user.id).single();
      setGerente(perfilData); // 🔹 Salva o gerente no estado

      if (perfilData?.concessionaria_id) {
        // 2. Busca a concessionária
        const { data: concData } = await supabase.from('concessionarias').select('*').eq('id', perfilData.concessionaria_id).single();
        setConcessionaria(concData);

        // 3. Busca os carros
        const { data: carrosData } = await supabase.from('automoveis').select('*').eq('concessionaria_id', perfilData.concessionaria_id);
        setCarros(carrosData || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDados(); }, []);

  return { concessionaria, carros, gerente, loading, refetch: fetchDados }; 
}