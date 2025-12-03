create database TCC;
use TCC;
CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL, -- Armazenará o hash da senha
    perfil ENUM('admin', 'cliente') DEFAULT 'cliente' NOT NULL,
    telefone VARCHAR(20)
);

-- 2. Tabela Servicos
CREATE TABLE Servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL
);

-- 3. Tabela Animais
CREATE TABLE Animais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raca VARCHAR(50),
    data_nascimento DATE,
    usuario_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
);

-- 4. Tabela Agendamentos
CREATE TABLE Agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_hora DATETIME NOT NULL,
    status ENUM('pendente', 'confirmado', 'cancelado', 'concluido') DEFAULT 'pendente' NOT NULL,
    usuario_id INT NOT NULL, -- Cliente que agendou
    animal_id INT NOT NULL,
    servico_id INT NOT NULL,
    observacoes TEXT,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE RESTRICT,
    FOREIGN KEY (animal_id) REFERENCES Animais(id) ON DELETE RESTRICT,
    FOREIGN KEY (servico_id) REFERENCES Servicos(id) ON DELETE RESTRICT
);