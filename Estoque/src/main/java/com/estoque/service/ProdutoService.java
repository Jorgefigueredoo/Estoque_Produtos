package com.estoque.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.estoque.exception.EstoqueInsuficienteException;
import com.estoque.exception.NomeImutavelException;
import com.estoque.exception.ProdutoJaExisteException;
import com.estoque.exception.ProdutoNaoEncontradoException;
import com.estoque.exception.QuantidadeInvalidaException;
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
            throw new ProdutoJaExisteException("Produto já existe com o nome: " + produto.getNome());
        }

        if (produto.getQuantidade() == null || produto.getQuantidade() < 0) {
            throw new QuantidadeInvalidaException("A quantidade não pode ser nula ou abaixo de 0");
        }

        return produtoRepository.save(produto);
    }

    public Produto editarProduto(Produto produto, Long id) {
        Produto produtoExistente = produtoRepository.findById(id)
                .orElseThrow(() -> new ProdutoNaoEncontradoException("Produto não encontrado com o ID:" + id));

        if (!produtoExistente.getNome().equals(produto.getNome())) {
            throw new NomeImutavelException(
                    "Não é possível alterar o nome do produto. Nome atual: " + produtoExistente.getNome());
        }

        produtoExistente.setDescricao(produto.getDescricao());
        produtoExistente.setCategoria(produto.getCategoria());
        produtoExistente.setPreco(produto.getPreco());

        return produtoRepository.save(produtoExistente);
    }

    public Produto darEntrada(Long id, Integer quantidade) {
        Produto produtoExistente = produtoRepository.findById(id)
                .orElseThrow(() -> new ProdutoNaoEncontradoException("Produto não encontrado com o ID:" + id));

        if (quantidade == null || quantidade <= 0) {
            throw new QuantidadeInvalidaException("A quantidade não pode ser nula ou abaixo de 0");
        }

        produtoExistente.setQuantidade(produtoExistente.getQuantidade() + quantidade);
        return produtoRepository.save(produtoExistente);
    }

    public Produto darSaida(Long id, Integer quantidade) {
        Produto produtoExistente = produtoRepository.findById(id)
                .orElseThrow(() -> new ProdutoNaoEncontradoException("Produto não encontrado com o ID:" + id));

        if (quantidade == null || quantidade <= 0) {
            throw new QuantidadeInvalidaException("A quantidade removida não pode ser nula ou abaixo de 0");
        }

        if (quantidade > produtoExistente.getQuantidade()) {
            throw new EstoqueInsuficienteException("A quantidade removida não pode ser maior que a quantidade em estoque");
        }

        produtoExistente.setQuantidade(produtoExistente.getQuantidade() - quantidade);

        return produtoRepository.save(produtoExistente);
    }

    public void deletarProduto(Long id) {
        Produto produtoExistente = produtoRepository.findById(id)
                .orElseThrow(() -> new ProdutoNaoEncontradoException("Produto não encontrado com o ID:" + id));

        produtoRepository.delete(produtoExistente);
    }
}
