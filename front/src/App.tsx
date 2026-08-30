import { useCallback, useEffect, useState } from "react";
import * as api from "./api/produtoApi";
import { ListaProdutos } from "./components/ListaProdutos";
import { MensagemBox } from "./components/MensagemBox";
import { MovimentoModal } from "./components/MovimentoModal";
import { ProdutoForm } from "./components/ProdutoForm";
import { Topo } from "./components/Topo";
import { useMensagem } from "./hooks/useMensagem";
import type {
  EdicaoProduto,
  NovoProduto,
  Produto,
  TipoMovimento,
} from "./types/produto";

interface Movimento {
  produto: Produto;
  tipo: TipoMovimento;
}

function textoDoErro(erro: unknown): string {
  return erro instanceof Error ? erro.message : "Erro inesperado.";
}

export default function App() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
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

  useEffect(() => {
    void carregarProdutos();
  }, [carregarProdutos]);

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

      <main className="conteudo">
        <ProdutoForm
          produtoEmEdicao={produtoEmEdicao}
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
