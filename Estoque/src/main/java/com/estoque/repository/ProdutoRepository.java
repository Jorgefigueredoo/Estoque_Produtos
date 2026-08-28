package com.estoque.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.estoque.constants.CategoriaEnum;
import com.estoque.model.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    Optional<Produto> findById(Long id);
    
    Optional<Produto> findByNome(String nome);

    boolean existsByNome(String nome);

    List<Produto> findByCategoria(CategoriaEnum categoria);
}
