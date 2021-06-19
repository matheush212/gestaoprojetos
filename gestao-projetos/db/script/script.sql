/*
Created: 24/08/2020
Modified: 27/10/2020
Model: AgroModel
Database: SQLite 3.7
*/


-- Create tables section -------------------------------------------------

-- Table Usuarios

CREATE TABLE Usuarios
(
  Id INTEGER NOT NULL
        CONSTRAINT PK_Usuarios PRIMARY KEY AUTOINCREMENT,
  TipoUsuario TEXT NOT NULL,
  Nome TEXT NOT NULL,
  Login TEXT NOT NULL,
  Senha TEXT NOT NULL,
  Ativo smallint NOT NULL,
  CONSTRAINT Login UNIQUE (Login)
);

-- Table Fornecedores

CREATE TABLE Fornecedores
(
  Id INTEGER NOT NULL
        CONSTRAINT PK_Fornecedores PRIMARY KEY AUTOINCREMENT,
  Codigo int NOT NULL,
  NomeEmpresa TEXT NOT NULL,
  NomeVendedor TEXT NOT NULL,
  Email TEXT DEFAULT '',
  Endereco TEXT DEFAULT '',
  Telefone1 TEXT NOT NULL,
  Telefone2 TEXT DEFAULT '',
  Telefone3 TEXT DEFAULT '',
  DtUltimaVisita date NOT NULL,
  TipoVisita TEXT DEFAULT '',
  Ativo smallint NOT NULL DEFAULT 1,
  CONSTRAINT Codigo UNIQUE (Codigo)
);

-- Table Grupo

CREATE TABLE Grupo
(
  Id INTEGER NOT NULL
        CONSTRAINT PK_Grupo PRIMARY KEY AUTOINCREMENT,
  Codigo INTEGER NOT NULL,
  Descricao TEXT NOT NULL,
  Ativo smallint NOT NULL DEFAULT 1,
  CONSTRAINT Cod UNIQUE (Codigo)
);

-- Table Subgrupo

CREATE TABLE Subgrupo
(
  Id INTEGER NOT NULL
        CONSTRAINT PK_Subgrupo PRIMARY KEY AUTOINCREMENT,
  Codigo INTEGER NOT NULL,
  Descricao TEXT NOT NULL,
  Ativo smallint NOT NULL DEFAULT 1,
  CONSTRAINT Cod UNIQUE (Codigo)
);

-- Table GrupoTamanho

CREATE TABLE GrupoTamanho
(
  Id INTEGER NOT NULL
        CONSTRAINT PK_GrupoTamanho PRIMARY KEY AUTOINCREMENT,
  Codigo INTEGER NOT NULL,
  Descricao TEXT NOT NULL,
  Ativo smallint NOT NULL DEFAULT 1,
  CONSTRAINT Cod UNIQUE (Codigo)
);

-- Table Produtos

CREATE TABLE Produtos
(
  Id INTEGER NOT NULL
        CONSTRAINT PK_Produtos PRIMARY KEY AUTOINCREMENT,
  CodGeral INTEGER NOT NULL,
  IdGrupo INTEGER,
  IdSubgrupo INTEGER,
  IdGrupoTamanho INTEGER,
  CodBarras INTEGER NOT NULL,
  Nome TEXT NOT NULL,
  Descricao TEXT DEFAULT '',
  KG TEXT NOT NULL,
  Preco TEXT NOT NULL,
  DtCadastro date NOT NULL,
  Observacoes TEXT DEFAULT '',
  Ativo smallint NOT NULL DEFAULT 1,
  CONSTRAINT CodGeral UNIQUE (CodGeral),
  CONSTRAINT CodBarras UNIQUE (CodBarras),
  CONSTRAINT Nome UNIQUE (Nome),
  CONSTRAINT Relationship12 FOREIGN KEY (IdSubgrupo) REFERENCES Subgrupo (Id),
  CONSTRAINT Relationship14 FOREIGN KEY (IdGrupo) REFERENCES Grupo (Id),
  CONSTRAINT Relationship17 FOREIGN KEY (IdGrupoTamanho) REFERENCES GrupoTamanho (Id)
);

CREATE INDEX IX_Relationship12 ON Produtos (IdSubgrupo);

CREATE INDEX IX_Relationship14 ON Produtos (IdGrupo);

CREATE INDEX IX_Relationship17 ON Produtos (IdGrupoTamanho);

-- Table Fornecedor_Produto

CREATE TABLE Fornecedor_Produto
(
  Id INTEGER NOT NULL
        CONSTRAINT PK_Fornecedor_Produto PRIMARY KEY AUTOINCREMENT,
  IdProduto INTEGER,
  IdFornecedor INTEGER,
  Ativo smallint NOT NULL DEFAULT 1,
  CONSTRAINT Relationship20 FOREIGN KEY (IdProduto) REFERENCES Produtos (Id),
  CONSTRAINT Relationship27 FOREIGN KEY (IdFornecedor) REFERENCES Fornecedores (Id)
);

CREATE INDEX IX_Relationship20 ON Fornecedor_Produto (IdProduto);

CREATE INDEX IX_Relationship27 ON Fornecedor_Produto (IdFornecedor);

-- Table EstoqueGeral

CREATE TABLE EstoqueGeral
(
  Id INTEGER NOT NULL
        CONSTRAINT PK_EstoqueGeral PRIMARY KEY AUTOINCREMENT,
  IdProduto INTEGER NOT NULL,
  Quantidade int NOT NULL,
  PrecoTotal TEXT NOT NULL,
  CONSTRAINT Relationship18 FOREIGN KEY (IdProduto) REFERENCES Produtos (Id)
);

CREATE INDEX IX_Relationship18 ON EstoqueGeral (IdProduto);

-- Table Produtos_Entradas

CREATE TABLE Produtos_Entradas
(
  Id INTEGER NOT NULL
        CONSTRAINT PK_Produtos_Entradas PRIMARY KEY AUTOINCREMENT,
  IdProduto INTEGER,
  IdUsuario INTEGER,
  IdFornecedor INTEGER,
  Quantidade int NOT NULL,
  Preco TEXT,
  DtEntrada date NOT NULL,
  DtValidadeProduto date NOT NULL,
  CONSTRAINT Relationship7 FOREIGN KEY (IdProduto) REFERENCES Produtos (Id),
  CONSTRAINT Relationship9 FOREIGN KEY (IdUsuario) REFERENCES Usuarios (Id),
  CONSTRAINT Relationship28 FOREIGN KEY (IdFornecedor) REFERENCES Fornecedores (Id)
);

CREATE INDEX IX_Relationship7 ON Produtos_Entradas (IdProduto);

CREATE INDEX IX_Relationship9 ON Produtos_Entradas (IdUsuario);

CREATE INDEX IX_Relationship28 ON Produtos_Entradas (IdFornecedor);

-- Table Clientes

CREATE TABLE Clientes
(
  Id INTEGER NOT NULL
        CONSTRAINT PK_Clientes PRIMARY KEY AUTOINCREMENT,
  Codigo int NOT NULL,
  Nome TEXT NOT NULL,
  Sobrenome TEXT NOT NULL,
  Endereco TEXT,
  Telefone TEXT,
  TelefoneAdd TEXT,
  Email TEXT,
  DtCadastro date NOT NULL,
  Observacoes TEXT,
  Ativo smallint NOT NULL DEFAULT 1,
  CONSTRAINT Codigo UNIQUE (Codigo)
);

-- Table Produtos_Saidas

CREATE TABLE Produtos_Saidas
(
  Id INTEGER NOT NULL
        CONSTRAINT PK_Produtos_Saidas PRIMARY KEY AUTOINCREMENT,
  IdProduto INTEGER,
  IdUsuario INTEGER,
  IdCliente INTEGER,
  Quantidade int NOT NULL,
  DtSaida date NOT NULL,
  CONSTRAINT Relationship8 FOREIGN KEY (IdProduto) REFERENCES Produtos (Id),
  CONSTRAINT Relationship10 FOREIGN KEY (IdUsuario) REFERENCES Usuarios (Id),
  CONSTRAINT Relationship24 FOREIGN KEY (IdCliente) REFERENCES Clientes (Id)
);

CREATE INDEX IX_Relationship8 ON Produtos_Saidas (IdProduto);

CREATE INDEX IX_Relationship10 ON Produtos_Saidas (IdUsuario);

CREATE INDEX IX_Relationship24 ON Produtos_Saidas (IdCliente);

-- Table Historico_Compras

CREATE TABLE Historico_Compras
(
  Id INTEGER NOT NULL
        CONSTRAINT PK_Historico_Compras PRIMARY KEY AUTOINCREMENT,
  IdProdutoSaidas INTEGER,
  Ativo smallint NOT NULL DEFAULT 1,
  CONSTRAINT Relationship22 FOREIGN KEY (IdProdutoSaidas) REFERENCES Produtos_Saidas (Id)
);

CREATE INDEX IX_Relationship22 ON Historico_Compras (IdProdutoSaidas);

-- Table Produtos_Estorno

CREATE TABLE Produtos_Estorno
(
  Id INTEGER NOT NULL
        CONSTRAINT PK_Produtos_Estorno PRIMARY KEY AUTOINCREMENT,
  IdProduto INTEGER,
  IdUsuario INTEGER,
  Quantidade int NOT NULL,
  DtEstorno date NOT NULL,
  CONSTRAINT Relationship25 FOREIGN KEY (IdProduto) REFERENCES Produtos (Id),
  CONSTRAINT Relationship26 FOREIGN KEY (IdUsuario) REFERENCES Usuarios (Id)
);

CREATE INDEX IX_Relationship25 ON Produtos_Estorno (IdProduto);

CREATE INDEX IX_Relationship26 ON Produtos_Estorno (IdUsuario);

-- Table Boletos

CREATE TABLE Boletos
(
  Id INTEGER NOT NULL
        CONSTRAINT PK_Boletos PRIMARY KEY AUTOINCREMENT,
  Codigo int NOT NULL,
  Identificacao TEXT NOT NULL,
  NomePDF TEXT NOT NULL,
  DtVencimento date NOT NULL,
  DtCadastro date NOT NULL,
  BoletoURI TEXT NOT NULL,
  Observacoes TEXT,
  Ativo smallint NOT NULL DEFAULT 1,
  CONSTRAINT Codigo UNIQUE (Codigo)
);

-- Table Alteracoes

CREATE TABLE Alteracoes
(
  Id INTEGER NOT NULL
        CONSTRAINT PK_Alteracoes PRIMARY KEY AUTOINCREMENT,
  IdUsuario INTEGER,
  Tela TEXT NOT NULL,
  FuncaoAlterada TEXT NOT NULL,
  DataHoraAlteracao datetime NOT NULL,
  CONSTRAINT Relationship29 FOREIGN KEY (IdUsuario) REFERENCES Usuarios (Id)
);

CREATE INDEX IX_Relationship29 ON Alteracoes (IdUsuario);

