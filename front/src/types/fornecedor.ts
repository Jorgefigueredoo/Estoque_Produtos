// Espelha com.estoque.model.Fornecedor
export interface Fornecedor {
  id: number;
  nome: string;
  cnpj: string;
  telefone: string | null;
  email: string | null;
  endereco: string;
}

// Corpo do POST /api/fornecedores
export type NovoFornecedor = Omit<Fornecedor, "id">;

// Corpo do PUT /api/fornecedores/{id}.
// O back recusa mudança de CNPJ, então ele vai igual ao cadastrado.
export type EdicaoFornecedor = NovoFornecedor;
