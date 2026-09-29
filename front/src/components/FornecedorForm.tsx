import { useEffect, useRef, useState } from "react";
import type {
  EdicaoFornecedor,
  Fornecedor,
  NovoFornecedor,
} from "../types/fornecedor";

interface FormState {
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
}

const FORM_VAZIO: FormState = {
  nome: "",
  cnpj: "",
  telefone: "",
  email: "",
  endereco: "",
};

interface Props {
  /** null = modo cadastro (POST); preenchido = modo edição (PUT). */
  fornecedorEmEdicao: Fornecedor | null;
  onCadastrar: (fornecedor: NovoFornecedor) => Promise<boolean>;
  onSalvarEdicao: (id: number, fornecedor: EdicaoFornecedor) => Promise<boolean>;
  onCancelarEdicao: () => void;
  onErroValidacao: (texto: string) => void;
}

export function FornecedorForm({
  fornecedorEmEdicao,
  onCadastrar,
  onSalvarEdicao,
  onCancelarEdicao,
  onErroValidacao,
}: Props) {
  const [form, setForm] = useState<FormState>(FORM_VAZIO);
  const [salvando, setSalvando] = useState(false);
  const nomeRef = useRef<HTMLInputElement>(null);

  const editando = fornecedorEmEdicao !== null;

  useEffect(() => {
    if (!fornecedorEmEdicao) {
      setForm(FORM_VAZIO);
      return;
    }

    setForm({
      nome: fornecedorEmEdicao.nome,
      cnpj: fornecedorEmEdicao.cnpj,
      telefone: fornecedorEmEdicao.telefone ?? "",
      email: fornecedorEmEdicao.email ?? "",
      endereco: fornecedorEmEdicao.endereco,
    });

    nomeRef.current?.focus();
  }, [fornecedorEmEdicao]);

  function alterar<C extends keyof FormState>(campo: C, valor: string) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function aoEnviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const dados: NovoFornecedor = {
      nome: form.nome.trim(),
      cnpj: form.cnpj.trim(),
      telefone: form.telefone.trim(),
      email: form.email.trim(),
      endereco: form.endereco.trim(),
    };

    if (!dados.nome) {
      onErroValidacao("Informe o nome do fornecedor.");
      return;
    }
    if (!dados.cnpj) {
      onErroValidacao("Informe o CNPJ.");
      return;
    }
    if (!dados.endereco) {
      onErroValidacao("Informe o endereço.");
      return;
    }

    setSalvando(true);
    try {
      const deuCerto = editando
        ? await onSalvarEdicao(fornecedorEmEdicao.id, dados)
        : await onCadastrar(dados);

      if (deuCerto && !editando) setForm(FORM_VAZIO);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section className="cartao cartao--ficha" aria-labelledby="ficha-titulo">
      <div className="furo" aria-hidden="true"></div>
      <h2 id="ficha-titulo">Ficha do fornecedor</h2>
      <p className="cartao__legenda">
        {editando ? `Editando: ${fornecedorEmEdicao.nome}` : "Novo cadastro"}
      </p>

      <form onSubmit={aoEnviar} noValidate>
        <div className="campo">
          <label htmlFor="f-nome">Nome</label>
          <input
            ref={nomeRef}
            type="text"
            id="f-nome"
            required
            maxLength={120}
            placeholder="Ex: Distribuidora Silva"
            value={form.nome}
            onChange={(e) => alterar("nome", e.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="f-cnpj">CNPJ</label>
          <input
            type="text"
            id="f-cnpj"
            required
            maxLength={18}
            placeholder="00.000.000/0000-00"
            value={form.cnpj}
            // O service recusa mudança de CNPJ.
            readOnly={editando}
            onChange={(e) => alterar("cnpj", e.target.value)}
          />
          <span className="campo__ajuda">
            O CNPJ não pode ser alterado após o cadastro.
          </span>
        </div>

        <div className="campo-linha">
          <div className="campo">
            <label htmlFor="f-telefone">Telefone</label>
            <input
              type="tel"
              id="f-telefone"
              placeholder="(00) 00000-0000"
              value={form.telefone}
              onChange={(e) => alterar("telefone", e.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="f-email">E-mail</label>
            <input
              type="email"
              id="f-email"
              placeholder="contato@empresa.com"
              value={form.email}
              onChange={(e) => alterar("email", e.target.value)}
            />
          </div>
        </div>

        <div className="campo">
          <label htmlFor="f-endereco">Endereço</label>
          <input
            type="text"
            id="f-endereco"
            required
            placeholder="Rua, número, cidade"
            value={form.endereco}
            onChange={(e) => alterar("endereco", e.target.value)}
          />
        </div>

        <div className="cartao__acoes">
          <button type="submit" className="btn btn--primario" disabled={salvando}>
            {editando ? "Salvar alterações" : "Cadastrar fornecedor"}
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
