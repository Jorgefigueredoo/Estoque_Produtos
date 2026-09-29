package com.estoque.dto;

import com.estoque.constants.CategoriaEnum;
import com.estoque.model.Produto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProdutoResponse {
    private Long id;
    private String nome;
    private String descricao;
    private CategoriaEnum categoria;
    private Double preco;
    private Integer quantidade;
    private Long fornecedorId;
    private String fornecedorNome;

    public ProdutoResponse(Produto produto){
        this.id = produto.getId();
        this.nome = produto.getNome();
        this.descricao = produto.getDescricao();
        this.categoria = produto.getCategoria();
        this.preco = produto.getPreco();
        this.quantidade = produto.getQuantidade();
        this.fornecedorId = produto.getFornecedor().getId();
        this.fornecedorNome = produto.getFornecedor().getNome();
    }
}