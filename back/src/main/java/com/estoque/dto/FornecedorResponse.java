package com.estoque.dto;

import com.estoque.model.Fornecedor;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FornecedorResponse {
    private Long id;
    private String nome;
    private String cnpj;
    private String telefone;
    private String email;
    private String endereco;

    public FornecedorResponse(Fornecedor fornecedor) {
        this.id = fornecedor.getId();
        this.nome = fornecedor.getNome();
        this.cnpj = fornecedor.getCnpj();
        this.telefone = fornecedor.getTelefone();
        this.email = fornecedor.getEmail();
        this.endereco = fornecedor.getEndereco();
    }
}
