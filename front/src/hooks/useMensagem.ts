import { useCallback, useEffect, useRef, useState } from "react";
import { type TipoMensagem } from "../types/produto";

export interface Mensagem {
  texto: string;
  tipo: TipoMensagem;
}

const DURACAO_MS = 4000;

/** Mensagem de feedback que some sozinha depois de alguns segundos. */
export function useMensagem() {
  const [mensagem, setMensagem] = useState<Mensagem | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  const mostrarMensagem = useCallback((texto: string, tipo: TipoMensagem) => {
    clearTimeout(timerRef.current);
    setMensagem({ texto, tipo });
    timerRef.current = setTimeout(() => setMensagem(null), DURACAO_MS);
  }, []);

  // Evita o setState em componente desmontado se a página trocar antes do timeout.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { mensagem, mostrarMensagem };
}
