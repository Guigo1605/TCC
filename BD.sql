create database TCC;
use TCC;

CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil ENUM('admin', 'cliente') DEFAULT 'cliente' NOT NULL,
    telefone VARCHAR(20),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_perfil (perfil)
);

-- 2. Tabela Servicos
CREATE TABLE Servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nome (nome)
);

-- 3. Tabela Animais
CREATE TABLE Animais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raca VARCHAR(50),
    data_nascimento DATE,
    usuario_id INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_animais_usuario FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_id (usuario_id)
);

-- 4. Tabela Agendamentos
CREATE TABLE Agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_hora DATETIME NOT NULL,
    status ENUM('pendente', 'confirmado', 'cancelado', 'concluido') DEFAULT 'pendente' NOT NULL,
    usuario_id INT NOT NULL,
    animal_id INT NOT NULL,
    servico_id INT NOT NULL,
    observacoes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_agendamentos_usuario FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE RESTRICT,
    CONSTRAINT fk_agendamentos_animal FOREIGN KEY (animal_id) REFERENCES Animais(id) ON DELETE RESTRICT,
    CONSTRAINT fk_agendamentos_servico FOREIGN KEY (servico_id) REFERENCES Servicos(id) ON DELETE RESTRICT,
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_animal_id (animal_id),
    INDEX idx_servico_id (servico_id),
    INDEX idx_status (status),
    INDEX idx_data_hora (data_hora)
);