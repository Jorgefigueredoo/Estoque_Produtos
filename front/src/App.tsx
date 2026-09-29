import { useCallback, useEffect, useState } from "react";
import * as fornecedorApi from "./api/fornecedorApi";
import * as api from "./api/produtoApi";
import { FornecedorForm } from "./components/FornecedorForm";
import { ListaFornecedores } from "./components/ListaFornecedores";
import { ListaProdutos } from "./components/ListaProdutos";
import { MensagemBox } from "./components/MensagemBox";
import { MovimentoModal } from "./components/MovimentoModal";
import { ProdutoForm } from "./components/ProdutoForm";
import { Topo } from "./components/Topo";
import { useMensagem } from "./hooks/useMensagem";
import type {
  EdicaoFornecedor,
  Fornecedor,
  NovoFornecedor,
} from "./types/fornecedor";
import type {
  EdicaoProduto,
  NovoProduto,
  Produto,
  TipoMovimento,
} from "./types/produto";

type Aba = "produtos" | "fornecedores";

interface Movimento {
  produto: Produto;
  tipo: TipoMovimento;
}

function textoDoErro(erro: unknown): string {
  return erro instanceof Error ? erro.message : "Erro inesperado.";
}

export default function App() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [aba, setAba] = useState<Aba>("produtos");
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [fornecedorEmEdicao, setFornecedorEmEdicao] =
    useState<Fornecedor | null>(null);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null);
  const [movimento, setMovimento] = useState<Movimento | null>(null);
  const { mensagem, mostrarMensagem } = useMensagem();

  const carregarProdutos = useCallback(async () => {
    try {
      setProdutos(await api.listarProdutos());
    } catch (erro) {
      mostrarMensagem(textoDoErro(erro), "erro");
    }
  }, [mostrarMensagem]);

  const carregarFornecedores = useCallback(async () => {
    try {
      setFornecedores(await fornecedorApi.listarFornecedores());
    } catch (erro) {
      mostrarMensagem(textoDoErro(erro), "erro");
    }
  }, [mostrarMensagem]);

  useEffect(() => {
    void carregarProdutos();
    void carregarFornecedores();
  }, [carregarProdutos, carregarFornecedores]);

  async function cadastrarFornecedor(
    fornecedor: NovoFornecedor,
  ): Promise<boolean> {
    try {
      await fornecedorApi.cadastrarFornecedor(fornecedor);
      mostrarMensagem("Fornecedor cadastrado.", "sucesso");
      await carregarFornecedores();
      return true;
    } catch (erro) {
      mostrarMensagem(textoDoErro(erro), "erro");
      return false;
    }
  }

  async function salvarEdicaoFornecedor(
    id: number,
    fornecedor: EdicaoFornecedor,
  ): Promise<boolean> {
    try {
      await fornecedorApi.editarFornecedor(id, fornecedor);
      mostrarMensagem("Fornecedor atualizado.", "sucesso");
      setFornecedorEmEdicao(null);
      // O nome do fornecedor aparece na lista de produtos.
      await Promise.all([carregarFornecedores(), carregarProdutos()]);
      return true;
    } catch (erro) {
      mostrarMensagem(textoDoErro(erro), "erro");
      return false;
    }
  }

  async function excluirFornecedor(fornecedor: Fornecedor) {
    if (!confirm(`Excluir "${fornecedor.nome}"?`)) return;

    try {
      await fornecedorApi.deletarFornecedor(fornecedor.id);
      if (fornecedorEmEdicao?.id === fornecedor.id) setFornecedorEmEdicao(null);
      mostrarMensagem("Fornecedor excluído.", "sucesso");
      await carregarFornecedores();
    } catch (erro) {
      // Ex.: fornecedor ainda tem produtos associados.
      mostrarMensagem(textoDoErro(erro), "erro");
    }
  }

  async function cadastrar(produto: NovoProduto): Promise<boolean> {
    try {
      await api.cadastrarProduto(produto);
      mostrarMensagem("Produto cadastrado.", "sucesso");
      await carregarProdutos();
      return true;
    } catch (erro) {
      mostrarMensagem(textoDoErro(erro), "erro");
      return false;
    }
  }

  async function salvarEdicao(
    id: number,
    produto: EdicaoProduto,
  ): Promise<boolean> {
    try {
      await api.editarProduto(id, produto);
      mostrarMensagem("Produto atualizado.", "sucesso");
      setProdutoEmEdicao(null);
      await carregarProdutos();
      return true;
    } catch (erro) {
      mostrarMensagem(textoDoErro(erro), "erro");
      return false;
    }
  }

  async function excluir(produto: Produto) {
    if (!confirm(`Excluir "${produto.nome}"?`)) return;

    try {
      await api.deletarProduto(produto.id);

      // Se o produto excluído era o que estava na ficha, volta pro modo cadastro.
      if (produtoEmEdicao?.id === produto.id) setProdutoEmEdicao(null);

      mostrarMensagem("Produto excluído.", "sucesso");
      await carregarProdutos();
    } catch (erro) {
      mostrarMensagem(textoDoErro(erro), "erro");
    }
  }

  async function confirmarMovimento(quantidade: number): Promise<boolean> {
    if (!movimento) return false;

    try {
      await api.movimentarEstoque(movimento.produto.id, movimento.tipo, quantidade);

      mostrarMensagem(
        movimento.tipo === "entrada"
          ? "Entrada registrada."
          : "Saída registrada.",
        "sucesso",
      );
      setMovimento(null);
      await carregarProdutos();
      return true;
    } catch (erro) {
      // Ex.: EstoqueInsuficienteException numa saída maior que o estoque.
      mostrarMensagem(textoDoErro(erro), "erro");
      return false;
    }
  }

  const fecharModal = useCallback(() => setMovimento(null), []);

  return (
    <>
      <Topo total={produtos.length} />

      <MensagemBox mensagem={mensagem} />

      <nav className="abas" aria-label="Seções">
        <button
          type="button"
          className={`aba${aba === "produtos" ? " aba--ativa" : ""}`}
          onClick={() => setAba("produtos")}
        >
          Produtos
        </button>
        <button
          type="button"
          className={`aba${aba === "fornecedores" ? " aba--ativa" : ""}`}
          onClick={() => setAba("fornecedores")}
        >
          Fornecedores
        </button>
      </nav>

      {aba === "fornecedores" ? (
        <main className="conteudo">
          <FornecedorForm
            fornecedorEmEdicao={fornecedorEmEdicao}
            onCadastrar={cadastrarFornecedor}
            onSalvarEdicao={salvarEdicaoFornecedor}
            onCancelarEdicao={() => setFornecedorEmEdicao(null)}
            onErroValidacao={(texto) => mostrarMensagem(texto, "erro")}
          />

          <ListaFornecedores
            fornecedores={fornecedores}
            onRecarregar={carregarFornecedores}
            onEditar={setFornecedorEmEdicao}
            onExcluir={excluirFornecedor}
          />
        </main>
      ) : (
      <main className="conteudo">
        <ProdutoForm
          produtoEmEdicao={produtoEmEdicao}
          fornecedores={fornecedores}
          onCadastrar={cadastrar}
          onSalvarEdicao={salvarEdicao}
          onCancelarEdicao={() => setProdutoEmEdicao(null)}
          onErroValidacao={(texto) => mostrarMensagem(texto, "erro")}
        />

        <ListaProdutos
          produtos={produtos}
          onRecarregar={carregarProdutos}
          onEditar={setProdutoEmEdicao}
          onExcluir={excluir}
          onMovimentar={(produto, tipo) => setMovimento({ produto, tipo })}
        />
      </main>
      )}

      {movimento && (
        <MovimentoModal
          produto={movimento.produto}
          tipo={movimento.tipo}
          onConfirmar={confirmarMovimento}
          onFechar={fecharModal}
          onErroValidacao={(texto) => mostrarMensagem(texto, "erro")}
        />
      )}
    </>
  );
}
