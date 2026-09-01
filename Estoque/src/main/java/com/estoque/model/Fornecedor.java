package com.estoque.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Entity(name= "fornecedores")
public class Fornecedor {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(name= "nome", nullable = false)
    private String nome;

    @Column(name= "cnpj", nullable = false, unique = true)
    private String cnpj;

    @Column(name= "telefone", nullable = true)
    private String telefone;

    @Column (name= "email", nullable = true)
    private String email;

    @Column(name= "endereco", nullable = false)
    private String endereco;
}
