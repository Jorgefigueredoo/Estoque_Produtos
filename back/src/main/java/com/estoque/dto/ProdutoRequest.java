package com.estoque.dto;

import com.estoque.constants.CategoriaEnum;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class ProdutoRequest {
    private String nome;
    private String descricao;
    private Double preco;
    private Integer quantidade;
    private Long fornecedorId;
    private CategoriaEnum categoria;
}
