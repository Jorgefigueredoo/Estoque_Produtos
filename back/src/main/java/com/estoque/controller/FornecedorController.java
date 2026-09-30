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

import com.estoque.dto.FornecedorResponse;
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
    public List<FornecedorResponse> listarFornecedores() {
        return fornecedorService.listarFornecedores().stream()
                .map(FornecedorResponse::new)
                .toList();
    }

    @PutMapping("/{id}")
    public FornecedorResponse editarFornecedor(@RequestBody Fornecedor fornecedor, @PathVariable Long id) {
        Fornecedor fornecedorEditado = fornecedorService.editarFornecedor(id, fornecedor);
        return new FornecedorResponse(fornecedorEditado);
    } 

    @PostMapping
    public FornecedorResponse salvarFornecedor(@RequestBody Fornecedor fornecedor) {
        Fornecedor fornecedorSalvo = fornecedorService.salvarFornecedor(fornecedor);
        return new FornecedorResponse(fornecedorSalvo);
    }

    @DeleteMapping ("/{id}")
    public void deletarFornecedor(@PathVariable Long id) {
        fornecedorService.deletarFornecedor(id);
    }
}
