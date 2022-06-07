CREATE IF NOT EXISTS TABLE Usuario {
  carteira double precision NOT NULL,
  privacidade_do_perfil boolean NOT NULL,
  cpf varchar(256) NOT NULL,
  nome varchar(256) NOT NULL,
  email varchar(256) NOT NULL
}

CREATE IF NOT EXISTS TABLE Apostas {
  valor double precision NOT NULL,
  tipo varchar(256) NOT NULL,
  lucro_ou_perda varchar(256) NOT NULL
}

CREATE IF NOT EXISTS TABLE Jogo {
  "local" varchar(256) NOT NULL,
  data_horario TIMESTAMP NOT NULL,
  timeA varchar(256) NOT NULL,
  timeB varchar(256) NOT NULL,
  campeonato varchar(256)
}

CREATE IF NOT EXISTS TABLE "Time" {
  nome varchar(256) NOT NULL,
  numero_de_resenhas int8
}

CREATE IF NOT EXISTS TABLE Jogador {
  nome varchar(256) NOT NULL,
  data_de_nascimeno DATE NOT NULL,
  local_de_nascimento varchar(256) NOT NULL,
  numero_de_resenhas int8
}

CREATE IF NOT EXISTS TABLE Deposito {
  codigo int8,
  valor double precision
}
