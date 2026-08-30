import { useEffect, useRef, useState } from "react";
import {
  CATEGORIAS,
  ROTULO_CATEGORIA,
  type Categoria,
  type EdicaoProduto,
  type NovoProduto,
  type Produto,
} from "../types/produto";

interface FormState {
  nome: string;
  descricao: string;
  categoria: string;
  preco: string;
  quantidade: string;
}

const FORM_VAZIO: FormState = {
  nome: "",
  descricao: "",
  categoria: "",
  preco: "",
  quantidade: "",
};

interface Props {
  /** null = modo cadastro (POST); preenchido = modo edição (PUT). */
  produtoEmEdicao: Produto | null;
  onCadastrar: (produto: NovoProduto) => Promise<boolean>;
  onSalvarEdicao: (id: number, produto: EdicaoProduto) => Promise<boolean>;
  onCancelarEdicao: () => void;
  onErroValidacao: (texto: string) => void;
}

export function ProdutoForm({
  produtoEmEdicao,
  onCadastrar,
  onSalvarEdicao,
  onCancelarEdicao,
  onErroValidacao,
}: Props) {
  const [form, setForm] = useState<FormState>(FORM_VAZIO);
  const [salvando, setSalvando] = useState(false);
  const descricaoRef = useRef<HTMLTextAreaElement>(null);

  const editando = produtoEmEdicao !== null;

  // Ao entrar/sair do modo edição a ficha é repreenchida.
  useEffect(() => {
    if (!produtoEmEdicao) {
      setForm(FORM_VAZIO);
      return;
    }

    setForm({
      nome: produtoEmEdicao.nome,
      descricao: produtoEmEdicao.descricao ?? "",
      categoria: produtoEmEdicao.categoria,
      preco: String(produtoEmEdicao.preco),
      quantidade: "",
    });

    // O nome fica travado na edição, então o cursor vai pro primeiro campo editável.
    descricaoRef.current?.focus();
  }, [produtoEmEdicao]);

  function alterar<C extends keyof FormState>(campo: C, valor: string) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function aoEnviar(evento: React.FormEvent<HTMLFormElement>) {
    // Sem isso o navegador faz o submit nativo e recarrega a página.
    evento.preventDefault();

    const nome = form.nome.trim();
    const descricao = form.descricao.trim();
    const categoria = form.categoria as Categoria;
    const preco = parseFloat(form.preco);
    const quantidade = parseInt(form.quantidade, 10);

    // O form é noValidate, então a validação é nossa.
    if (!nome) {
      onErroValidacao("Informe o nome do produto.");
      return;
    }
    if (!form.categoria) {
      onErroValidacao("Escolha uma categoria.");
      return;
    }
    if (Number.isNaN(preco)) {
      onErroValidacao("Informe um preço válido.");
      return;
    }
    if (!editando && Number.isNaN(quantidade)) {
      onErroValidacao("Informe a quantidade inicial.");
      return;
    }

    setSalvando(true);
    try {
      const deuCerto = editando
        ? await onSalvarEdicao(produtoEmEdicao.id, {
            nome,
            descricao,
            categoria,
            preco,
          })
        : await onCadastrar({ nome, descricao, categoria, preco, quantidade });

      if (deuCerto && !editando) setForm(FORM_VAZIO);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section className="cartao cartao--ficha" aria-labelledby="ficha-titulo">
      <div className="furo" aria-hidden="true"></div>
      <h2 id="ficha-titulo">Ficha do produto</h2>
      <p className="cartao__legenda">
        {editando ? `Editando: ${produtoEmEdicao.nome}` : "Novo cadastro"}
      </p>

      <form onSubmit={aoEnviar} noValidate>
        <div className="campo">
          <label htmlFor="nome">Nome</label>
          <input
            type="text"
            id="nome"
            name="nome"
            required
            maxLength={120}
            placeholder="Ex: Cadeira de escritório"
            value={form.nome}
            // O service recusa mudança de nome (NomeImutavelException).
            readOnly={editando}
            onChange={(e) => alterar("nome", e.target.value)}
          />
          <span className="campo__ajuda">
            O nome não pode ser alterado após o cadastro.
          </span>
        </div>

        <div className="campo">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            ref={descricaoRef}
            id="descricao"
            name="descricao"
            rows={2}
            placeholder="Detalhes do produto (opcional)"
            value={form.descricao}
            onChange={(e) => alterar("descricao", e.target.value)}
          />
        </div>

        <div className="campo-linha">
          <div className="campo">
            <label htmlFor="categoria">Categoria</label>
            <select
              id="categoria"
              name="categoria"
              required
              value={form.categoria}
              onChange={(e) => alterar("categoria", e.target.value)}
            >
              <option value="" disabled>
                Selecione
              </option>
              {CATEGORIAS.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {ROTULO_CATEGORIA[categoria]}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="preco">Preço (R$)</label>
            <input
              type="number"
              id="preco"
              name="preco"
              required
              min="0"
              step="0.01"
              placeholder="0,00"
              value={form.preco}
              onChange={(e) => alterar("preco", e.target.value)}
            />
          </div>
        </div>

        {/* A quantidade some na edição: depois do cadastro ela só muda por entrada/saída. */}
        {!editando && (
          <div className="campo">
            <label htmlFor="quantidade">Quantidade inicial</label>
            <input
              type="number"
              id="quantidade"
              name="quantidade"
              required
              min="0"
              step="1"
              placeholder="0"
              value={form.quantidade}
              onChange={(e) => alterar("quantidade", e.target.value)}
            />
            <span className="campo__ajuda">
              Depois do cadastro, o estoque só muda por entrada/saída.
            </span>
          </div>
        )}

        <div className="cartao__acoes">
          <button type="submit" className="btn btn--primario" disabled={salvando}>
            {editando ? "Salvar alterações" : "Cadastrar produto"}
          </button>
          {editando && (
            <button
              type="button"
              className="btn btn--texto"
              onClick={onCancelarEdicao}
            >
              Cancelar edição
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
