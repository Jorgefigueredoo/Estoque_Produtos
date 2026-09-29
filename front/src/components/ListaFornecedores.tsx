import type { Fornecedor } from "../types/fornecedor";

interface Props {
  fornecedores: Fornecedor[];
  onRecarregar: () => void;
  onEditar: (fornecedor: Fornecedor) => void;
  onExcluir: (fornecedor: Fornecedor) => void;
}

export function ListaFornecedores({
  fornecedores,
  onRecarregar,
  onEditar,
  onExcluir,
}: Props) {
  return (
    <section className="cartao cartao--lista" aria-labelledby="lista-f-titulo">
      <div className="cartao__cabecalho">
        <h2 id="lista-f-titulo">Fornecedores cadastrados</h2>
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
              <th>Fornecedor</th>
              <th>CNPJ</th>
              <th>Contato</th>
              <th className="col-acoes">Ações</th>
            </tr>
          </thead>
          <tbody>
            {fornecedores.length === 0 ? (
              <tr>
                <td colSpan={4} className="vazio">
                  Nenhum fornecedor cadastrado ainda.
                </td>
              </tr>
            ) : (
              fornecedores.map((f) => (
                <tr key={f.id}>
                  <td>
                    <span className="produto-nome">{f.nome}</span>
                    <span className="produto-descricao">{f.endereco}</span>
                  </td>
                  <td>{f.cnpj}</td>
                  <td>
                    <span className="produto-nome">{f.telefone ?? ""}</span>
                    <span className="produto-descricao">{f.email ?? ""}</span>
                  </td>
                  <td className="col-acoes">
                    <div className="linha-acoes">
                      <button
                        type="button"
                        className="btn btn--linha"
                        onClick={() => onEditar(f)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn--linha btn--excluir"
                        onClick={() => onExcluir(f)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
