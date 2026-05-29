// hooks/useCarros.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Carro } from '../models/carro';

export function useCarros() {
  const [carros, setCarros] = useState<Carro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCarros() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('automoveis')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setCarros(data);
        
      } catch (error: any) {
        // 🔥 Vamos estourar um alerta na tela para vermos o erro nu e cru!
        alert(`ERRO DO SUPABASE: ${error.message || error.hint || JSON.stringify(error)}`);
        console.error('Erro detalhado:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCarros();
  }, []);

  // O hook devolve apenas o que a tela precisa saber
  return { carros, loading }; 
}