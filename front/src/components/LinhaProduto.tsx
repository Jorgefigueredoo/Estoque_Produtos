import type { Produto, TipoMovimento } from "../types/produto";

interface Props {
  produto: Produto;
  onEditar: (produto: Produto) => void;
  onExcluir: (produto: Produto) => void;
  onMovimentar: (produto: Produto, tipo: TipoMovimento) => void;
}

export function LinhaProduto({
  produto,
  onEditar,
  onExcluir,
  onMovimentar,
}: Props) {
  return (
    <tr>
      <td>
        <span className="produto-nome">{produto.nome}</span>
        <span className="produto-descricao">{produto.descricao ?? ""}</span>
      </td>
      <td>
        <span className="badge">{produto.categoria}</span>
      </td>
      <td className="col-numero">R$ {produto.preco.toFixed(2)}</td>
      <td className="col-numero">{produto.quantidade}</td>
      <td className="col-acoes">
        <div className="linha-acoes">
          <button
            type="button"
            className="btn btn--linha"
            onClick={() => onEditar(produto)}
          >
            Editar
          </button>
          <button
            type="button"
            className="btn btn--linha btn--excluir"
            onClick={() => onExcluir(produto)}
          >
            Excluir
          </button>
          <button
            type="button"
            className="btn btn--linha btn--entrada"
            onClick={() => onMovimentar(produto, "entrada")}
          >
            Entrada
          </button>
          <button
            type="button"
            className="btn btn--linha btn--saida"
            onClick={() => onMovimentar(produto, "saida")}
          >
            Saída
          </button>
        </div>
      </td>
    </tr>
  );
}
