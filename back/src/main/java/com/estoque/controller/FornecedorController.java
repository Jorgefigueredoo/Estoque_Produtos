package com.estoque.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.estoque.model.Fornecedor;
import com.estoque.service.FornecedorService;

@RestController 
@RequestMapping("/api/fornecedores")
public class FornecedorController {
    
    private final FornecedorService fornecedorService;

    public FornecedorController(FornecedorService fornecedorService) {
        this.fornecedorService = fornecedorService;
    }
    
    @GetMapping
    public List<Fornecedor> listarFornecedores() {
        return fornecedorService.listarFornecedores();
    }

    @PutMapping("/{id}")
    public Fornecedor editarFornecedor(@RequestBody Fornecedor fornecedor, @PathVariable Long id) {
        return fornecedorService.editarFornecedor(id, fornecedor);
    } 

    @PostMapping
    public Fornecedor salvarFornecedor(@RequestBody Fornecedor fornecedor) {
        return fornecedorService.salvarFornecedor(fornecedor);
    }

    @DeleteMapping ("/{id}")
    public void deletarFornecedor(@PathVariable Long id) {
        fornecedorService.deletarFornecedor(id);
    }
}
