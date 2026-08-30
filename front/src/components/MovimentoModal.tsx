import { useEffect, useState } from "react";
import type { Produto, TipoMovimento } from "../types/produto";

interface Props {
  produto: Produto;
  tipo: TipoMovimento;
  onConfirmar: (quantidade: number) => Promise<boolean>;
  onFechar: () => void;
  onErroValidacao: (texto: string) => void;
}

export function MovimentoModal({
  produto,
  tipo,
  onConfirmar,
  onFechar,
  onErroValidacao,
}: Props) {
  const [quantidade, setQuantidade] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === "Escape") onFechar();
    }

    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [onFechar]);

  async function aoEnviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const valor = parseInt(quantidade, 10);
    if (Number.isNaN(valor) || valor <= 0) {
      onErroValidacao("Informe uma quantidade maior que zero.");
      return;
    }

    setEnviando(true);
    try {
      await onConfirmar(valor);
    } finally {
      setEnviando(false);
    }
  }

  return (
    // Clique no fundo escuro fecha (mas clique dentro da caixa, não).
    <div
      className="modal"
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) onFechar();
      }}
    >
      <div className="modal__caixa" role="dialog" aria-modal="true">
        <h3>
          {tipo === "entrada" ? "Entrada" : "Saída"} — {produto.nome}
        </h3>
        <form onSubmit={aoEnviar}>
          <div className="campo">
            <label htmlFor="movimento-quantidade">Quantidade</label>
            <input
              type="number"
              id="movimento-quantidade"
              min="1"
              step="1"
              required
              autoFocus
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
            />
          </div>
          <div className="cartao__acoes">
            <button
              type="submit"
              className="btn btn--primario"
              disabled={enviando}
            >
              Confirmar
            </button>
            <button type="button" className="btn btn--texto" onClick={onFechar}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
