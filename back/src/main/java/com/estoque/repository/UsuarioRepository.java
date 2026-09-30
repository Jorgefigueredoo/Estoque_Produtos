package com.estoque.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.estoque.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    boolean existsByLogin(String login);
}
