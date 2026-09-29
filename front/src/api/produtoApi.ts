import type {
  EdicaoProduto,
  NovoProduto,
  Produto,
  TipoMovimento,
} from "../types/produto";
import { comJson, requisitar } from "./http";

const API_URL = "http://localhost:8080/api/produtos"; // ajuste a porta se for diferente

export function listarProdutos(): Promise<Produto[]> {
  return requisitar<Produto[]>(API_URL);
}

export function cadastrarProduto(produto: NovoProduto): Promise<Produto> {
  return requisitar<Produto>(API_URL, comJson("POST", produto));
}

export function editarProduto(
  id: number,
  produto: EdicaoProduto,
): Promise<Produto> {
  return requisitar<Produto>(`${API_URL}/${id}`, comJson("PUT", produto));
}

export function deletarProduto(id: number): Promise<void> {
  return requisitar<void>(`${API_URL}/${id}`, { method: "DELETE" });
}

export function movimentarEstoque(
  id: number,
  tipo: TipoMovimento,
  quantidade: number,
): Promise<Produto> {
  return requisitar<Produto>(
    `${API_URL}/${id}/${tipo}`,
    comJson("POST", { quantidade }),
  );
}
