CREATE TABLE IF NOT EXISTS Usuario (
  id integer NOT NULL PRIMARY KEY UNIQUE,
  carteira double precision NOT NULL,
  privacidade_do_perfil boolean NOT NULL,
  cpf varchar(256) NOT NULL,
  nome varchar(256) NOT NULL,
  email varchar(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS Apostas (
  id integer NOT NULL PRIMARY KEY UNIQUE,
  valor double precision NOT NULL,
  tipo varchar(256) NOT NULL,
  lucro_ou_perda varchar(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS Jogo (
  id integer NOT NULL PRIMARY KEY UNIQUE,
  "local" varchar(256) NOT NULL,
  data_horario TIMESTAMP NOT NULL,
  timeA integer NOT NULL,
  timeB integer NOT NULL,
  campeonato varchar(256),

  CONSTRAINT fk_timeA
      FOREIGN KEY(timeA) 
	      REFERENCES "time"(id),
  CONSTRAINT fk_timeB
      FOREIGN KEY(timeB) 
	      REFERENCES "time"(id)
);

CREATE TABLE IF NOT EXISTS "time" (
  id integer NOT NULL PRIMARY KEY UNIQUE,
  nome varchar(256) NOT NULL,
  numero_de_resenhas int8
);

CREATE TABLE IF NOT EXISTS Jogador (
  id integer NOT NULL PRIMARY KEY UNIQUE,
  nome varchar(256) NOT NULL,
  data_de_nascimeno DATE NOT NULL,
  local_de_nascimento varchar(256) NOT NULL,
  numero_de_resenhas int8,
  height integer,
  weight decimal,
  "time" integer,
  CONSTRAINT fk_time
      FOREIGN KEY("time")
	      REFERENCES "time"(id)
);

CREATE TABLE IF NOT EXISTS Deposito (
  id integer NOT NULL PRIMARY KEY UNIQUE,
  codigo int8,
  valor double precision
);
