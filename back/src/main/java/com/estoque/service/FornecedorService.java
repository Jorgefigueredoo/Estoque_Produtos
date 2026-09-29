package com.estoque.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.estoque.model.Fornecedor;
import com.estoque.repository.FornecedorRepository;
import com.estoque.repository.ProdutoRepository;

@Service
public class FornecedorService {

    private final FornecedorRepository fornecedorRepository;
    private final ProdutoRepository produtoRepository;

    public FornecedorService(FornecedorRepository fornecedorRepository, ProdutoRepository produtoRepository) {
        this.fornecedorRepository = fornecedorRepository;
        this.produtoRepository = produtoRepository;
    }

    public List<Fornecedor> listarFornecedores() {
        return fornecedorRepository.findAll();
    }

    public Fornecedor salvarFornecedor(Fornecedor fornecedor) {

        if (fornecedorRepository.existsByCnpj(fornecedor.getCnpj())) {
            throw new IllegalArgumentException("O CNPJ do fornecedor já existe");
        }

        if (fornecedorRepository.existsByNome(fornecedor.getNome())) {
            throw new IllegalArgumentException("O nome do fornecedor já existe");
        }

        return fornecedorRepository.save(fornecedor);
    }

    public Fornecedor editarFornecedor(Long id, Fornecedor fornecedor) {

        Fornecedor fornecedorExistente = fornecedorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Fornecedor não encontrado com o ID:" + id));

        if (!fornecedorExistente.getCnpj().equals(fornecedor.getCnpj())) {
            throw new IllegalArgumentException("Não é possível editar o cnpj do fornecedor");
        }

        fornecedorExistente.setNome(fornecedor.getNome());
        fornecedorExistente.setEndereco(fornecedor.getEndereco());
        fornecedorExistente.setEmail(fornecedor.getEmail());
        fornecedorExistente.setTelefone(fornecedor.getTelefone());

        return fornecedorRepository.save(fornecedorExistente);
    }

    public void deletarFornecedor(Long id) {
        Fornecedor fornecedorExistente = fornecedorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Fornecedor não encontrado com o ID:" + id));

        if (produtoRepository.existsByFornecedorId(id)) {
            throw new IllegalArgumentException(
                    "Não é possível deletar o fornecedor, pois existem produtos associados a ele.");
        }

        fornecedorRepository.delete(fornecedorExistente);
    }
}
