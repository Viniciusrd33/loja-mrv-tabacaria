CREATE DATABASE loja_tabacaria;

USE loja_tabacaria;

-- Tabela para armazenar usuários
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);


CREATE TABLE avaliacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    usuario VARCHAR(100) NOT NULL,
    comentario TEXT NOT NULL,
    nota INT NOT NULL CHECK(nota BETWEEN 1 AND 5),
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);
