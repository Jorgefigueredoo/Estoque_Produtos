import type {
  EdicaoFornecedor,
  Fornecedor,
  NovoFornecedor,
} from "../types/fornecedor";
import { comJson, requisitar } from "./http";

const API_URL = "http://localhost:8080/api/fornecedores";

export function listarFornecedores(): Promise<Fornecedor[]> {
  return requisitar<Fornecedor[]>(API_URL);
}

export function cadastrarFornecedor(
  fornecedor: NovoFornecedor,
): Promise<Fornecedor> {
  return requisitar<Fornecedor>(API_URL, comJson("POST", fornecedor));
}

export function editarFornecedor(
  id: number,
  fornecedor: EdicaoFornecedor,
): Promise<Fornecedor> {
  return requisitar<Fornecedor>(`${API_URL}/${id}`, comJson("PUT", fornecedor));
}

export function deletarFornecedor(id: number): Promise<void> {
  return requisitar<void>(`${API_URL}/${id}`, { method: "DELETE" });
}
