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

import com.estoque.dto.ProdutoRequest;
import com.estoque.dto.ProdutoResponse;
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
    public List<ProdutoResponse> listarProdutos() {
        List<Produto> produtos = produtoService.listarProdutos();
        return produtos.stream()
                .map(ProdutoResponse::new)
                .toList();
    }

    @PutMapping("/{id}")
    public ProdutoResponse editarProduto(@RequestBody ProdutoRequest produtoRequest, @PathVariable Long id) {
        Produto produto = new Produto();
        produto.setNome(produtoRequest.getNome());
        produto.setDescricao(produtoRequest.getDescricao());
        produto.setPreco(produtoRequest.getPreco());
        produto.setQuantidade(produtoRequest.getQuantidade());
        produto.setCategoria(produtoRequest.getCategoria());

        Produto produtoEditado = produtoService.editarProduto(produto, id, produtoRequest.getFornecedorId());
        return new ProdutoResponse(produtoEditado);
    }

    @PostMapping("/{id}/entrada")
    public ProdutoResponse darEntrada(@PathVariable Long id, @RequestBody QuantidadeRequest request) {
        Produto produtoEntrando = produtoService.darEntrada(id, request.getQuantidade());
        return new ProdutoResponse(produtoEntrando);
    }

    @PostMapping("/{id}/saida")
    public ProdutoResponse darSaida(@PathVariable Long id, @RequestBody QuantidadeRequest request) {
        Produto produtoSaindo = produtoService.darSaida(id, request.getQuantidade());
        return new ProdutoResponse(produtoSaindo);
    }

    @PostMapping
    public ProdutoResponse salvarProduto(@RequestBody ProdutoRequest produtoRequest) {
        Produto produto = new Produto();
        produto.setNome(produtoRequest.getNome());
        produto.setDescricao(produtoRequest.getDescricao());
        produto.setPreco(produtoRequest.getPreco());
        produto.setQuantidade(produtoRequest.getQuantidade());
        produto.setCategoria(produtoRequest.getCategoria());

        Produto produtoSalvo = produtoService.salvarProduto(produto, produtoRequest.getFornecedorId());
        return new ProdutoResponse(produtoSalvo);

    }

    @DeleteMapping("/{id}")
    public void deletarProduto(@PathVariable Long id) {
        produtoService.deletarProduto(id);
    }
}
