package com.estoque.exception;

public class ProdutoJaExisteException extends RuntimeException {
    
    public ProdutoJaExisteException(String message) {
        super(message);
    }
}
