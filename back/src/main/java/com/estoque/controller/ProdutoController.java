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

import com.estoque.dto.QuantidadeRequest;
import com.estoque.model.Produto;
import com.estoque.service.ProdutoService;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {
    
    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @GetMapping
    public List<Produto> listarProdutos() {
        return produtoService.listarProdutos();
    }

    @PutMapping("/{id}")
    public Produto editarProduto(@RequestBody Produto produto,@PathVariable Long id) {
        return produtoService.editarProduto(produto, id);
    }

    @PostMapping("/{id}/entrada")
    public Produto darEntrada(@PathVariable Long id, @RequestBody QuantidadeRequest request) {
        return produtoService.darEntrada(id, request.getQuantidade());
    }

    @PostMapping("/{id}/saida")
    public Produto darSaida(@PathVariable Long id, @RequestBody QuantidadeRequest request) {
        return produtoService.darSaida(id, request.getQuantidade());
    }

    @PostMapping
    public Produto salvarProduto(@RequestBody Produto produto) {
        return produtoService.salvarProduto(produto);
    }

    @DeleteMapping("/{id}")
    public void deletarProduto(@PathVariable Long id) {
        produtoService.deletarProduto(id);
    }
}
