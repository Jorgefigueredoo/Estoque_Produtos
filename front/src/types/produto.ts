// Espelha o CategoriaEnum do back end.
export const CATEGORIAS = [
  "ELETRONICOS",
  "ROUPAS",
  "ALIMENTOS",
  "MOVEIS",
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

export const ROTULO_CATEGORIA: Record<Categoria, string> = {
  ELETRONICOS: "Eletrônicos",
  ROUPAS: "Roupas",
  ALIMENTOS: "Alimentos",
  MOVEIS: "Móveis",
};

// Espelha com.estoque.model.Produto
export interface Produto {
  id: number;
  nome: string;
  descricao: string | null;
  categoria: Categoria;
  preco: number;
  quantidade: number;
}

// Corpo do POST /api/produtos
export interface NovoProduto {
  nome: string;
  descricao: string;
  categoria: Categoria;
  preco: number;
  quantidade: number;
}

// Corpo do PUT /api/produtos/{id}.
// A quantidade não vai: ela só muda por entrada/saída.
export type EdicaoProduto = Omit<NovoProduto, "quantidade">;

export type TipoMovimento = "entrada" | "saida";

export type TipoMensagem = "sucesso" | "erro";
