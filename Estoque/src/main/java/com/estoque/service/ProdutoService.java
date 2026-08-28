package com.estoque.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.estoque.model.Produto;
import com.estoque.repository.ProdutoRepository;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public List<Produto> listarProdutos() {
        return produtoRepository.findAll();
    }

    public Produto salvarProduto(Produto produto) {
        if (produtoRepository.existsByNome(produto.getNome())) {
            throw new RuntimeException("Produto já existe com o nome: " + produto.getNome());
        }

        Produto novoProduto = new Produto();
        novoProduto.setNome(produto.getNome());
        novoProduto.setDescricao(produto.getDescricao());
        novoProduto.setCategoria(produto.getCategoria());  
        novoProduto.setPreco(produto.getPreco());

        return produtoRepository.save(novoProduto);
    }

    public Produto editarProduto(Produto produto, Long id) {
        Produto produtoExistente = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com o ID:" + id));

        produtoExistente.setNome(produto.getNome());
        produtoExistente.setDescricao(produto.getDescricao());
        produtoExistente.setCategoria(produto.getCategoria());
        produtoExistente.setPreco(produto.getPreco());

        return produtoRepository.save(produtoExistente);

    }

    public void deletarProduto(Long id) {
        Produto produtoExistente = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com o ID:" + id));

        produtoRepository.delete(produtoExistente);
    }
}
