package com.estoque.exception;

public class FornecedorNaoEncontradoException extends RuntimeException {
    public FornecedorNaoEncontradoException(String message) {
        super(message);
    }
}
