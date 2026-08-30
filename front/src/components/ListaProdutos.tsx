import type { Produto, TipoMovimento } from "../types/produto";
import { LinhaProduto } from "./LinhaProduto";

interface Props {
  produtos: Produto[];
  onRecarregar: () => void;
  onEditar: (produto: Produto) => void;
  onExcluir: (produto: Produto) => void;
  onMovimentar: (produto: Produto, tipo: TipoMovimento) => void;
}

export function ListaProdutos({
  produtos,
  onRecarregar,
  onEditar,
  onExcluir,
  onMovimentar,
}: Props) {
  return (
    <section className="cartao cartao--lista" aria-labelledby="lista-titulo">
      <div className="cartao__cabecalho">
        <h2 id="lista-titulo">Produtos cadastrados</h2>
        <button
          type="button"
          className="btn btn--icone"
          title="Recarregar lista"
          onClick={onRecarregar}
        >
          ↻
        </button>
      </div>

      <div className="tabela-wrap">
        <table className="tabela-ledger">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th className="col-numero">Preço</th>
              <th className="col-numero">Qtd.</th>
              <th className="col-acoes">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.length === 0 ? (
              <tr>
                <td colSpan={5} className="vazio">
                  Nenhum produto cadastrado ainda.
                </td>
              </tr>
            ) : (
              produtos.map((produto) => (
                <LinhaProduto
                  key={produto.id}
                  produto={produto}
                  onEditar={onEditar}
                  onExcluir={onExcluir}
                  onMovimentar={onMovimentar}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
