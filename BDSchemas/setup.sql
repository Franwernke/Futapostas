CREATE TABLE IF NOT EXISTS Usuario (
  carteira double precision NOT NULL,
  privacidade_do_perfil boolean NOT NULL,
  cpf varchar(256) NOT NULL,
  nome varchar(256) NOT NULL,
  email varchar(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS Apostas (
  valor double precision NOT NULL,
  tipo varchar(256) NOT NULL,
  lucro_ou_perda varchar(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS Jogo (
  "local" varchar(256) NOT NULL,
  data_horario TIMESTAMP NOT NULL,
  timeA varchar(256) NOT NULL,
  timeB varchar(256) NOT NULL,
  campeonato varchar(256)
);

CREATE TABLE IF NOT EXISTS "time" (
  nome varchar(256) NOT NULL,
  numero_de_resenhas int8
);

CREATE TABLE IF NOT EXISTS Jogador (
  nome varchar(256) NOT NULL,
  data_de_nascimeno DATE NOT NULL,
  local_de_nascimento varchar(256) NOT NULL,
  numero_de_resenhas int8
);

CREATE TABLE IF NOT EXISTS Deposito (
  codigo int8,
  valor double precision
);
