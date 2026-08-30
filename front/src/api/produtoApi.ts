import type {
  EdicaoProduto,
  NovoProduto,
  Produto,
  TipoMovimento,
} from "../types/produto";

const API_URL = "http://localhost:8080/api/produtos"; // ajuste a porta se for diferente

/** Erro vindo da própria API (status HTTP fora do 2xx). */
export class ApiError extends Error {}

/** Erro de rede: a API não respondeu (servidor fora do ar, CORS, etc). */
export class RedeError extends Error {
  constructor() {
    super("Não foi possível falar com a API. O servidor está no ar?");
  }
}

// O GlobalExceptionHandler devolve os erros como texto puro
// (ResponseEntity<String>), então aqui se lê com .text() e NÃO com .json().
async function lerErro(resposta: Response): Promise<ApiError> {
  const texto = await resposta.text().catch(() => "");
  return new ApiError(texto || `Erro ${resposta.status}`);
}

async function requisitar<T>(url: string, init?: RequestInit): Promise<T> {
  let resposta: Response;

  try {
    resposta = await fetch(url, init);
  } catch (erro) {
    console.error("Falha de rede:", erro);
    throw new RedeError();
  }

  if (!resposta.ok) {
    throw await lerErro(resposta);
  }

  // DELETE responde 200 sem corpo, então não dá pra chamar .json() direto.
  const corpo = await resposta.text();
  return (corpo ? JSON.parse(corpo) : undefined) as T;
}

function comJson(metodo: string, corpo: unknown): RequestInit {
  return {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  };
}

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
