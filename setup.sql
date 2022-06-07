CREATE IF NOT EXISTS TABLE Usuario {
  int carteira,
  boolean privacidade_do_perfil,
  varchar(256) cpf,
  varchar(256) nome,
  varchar(256) email
}

CREATE IF NOT EXISTS TABLE Apostas {
  int valor,
  varchar(256)
}