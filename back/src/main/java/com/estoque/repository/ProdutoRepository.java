package com.estoque.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


import com.estoque.constants.CategoriaEnum;
import com.estoque.model.Produto;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    
    Optional<Produto> findByNome(String nome);

    boolean existsByNome(String nome);

    List<Produto> findByCategoria(CategoriaEnum categoria);
}
