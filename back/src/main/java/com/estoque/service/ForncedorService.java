package com.estoque.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.estoque.model.Fornecedor;
import com.estoque.repository.FornecedorRepository;

@Service
public class ForncedorService {

    private final FornecedorRepository fornecedorRepository;

    public ForncedorService(FornecedorRepository fornecedorRepository) {
        this.fornecedorRepository = fornecedorRepository;
    }

    public List<Fornecedor> ListarFornecedores() {
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

    public Fornecedor editarFornecedor (Fornecedor fornecedor) {
        
        if (fornecedorRepository.existsByCnpj(fornecedor.getCnpj())) {
            throw new IllegalArgumentException("Não é possível editar o cnpj do fornecedor");
        }
        
        
        return fornecedorRepository.save(fornecedor);
    }
}
