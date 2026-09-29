package com.estoque.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.estoque.model.Fornecedor;

public interface FornecedorRepository extends JpaRepository<Fornecedor, Long> {

    Optional<Fornecedor> findByNome(String nome);

    Optional<Fornecedor> findByCnpj(String cnpj);

    boolean existsByNome(String nome);

    boolean existsByCnpj(String cnpj);
}
