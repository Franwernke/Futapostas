-- Deveria falhar com a restrição de Foreign Key da tabela Apostas

DELETE FROM Usuario u WHERE u.id=1;

-- Deveria falhar com a restrição de Foreign Key da tabela Jogo

DELETE FROM "time" t WHERE t.id=45;

-- Deveria falhar com a restrição de unique da tabela de usuários

INSERT INTO Usuario VALUES (1, 0, true, '123.456.789-00', 'Andrew', 'andrew@email.com');

-- Deveria falhar com a restrição de NOT NULL da coluna "nome" da tabela Time

INSERT INTO "time" VALUES (1, NULL, 0);

-- Deveria falhar com a restrição de NOT NULL da coluna "cpf" da tabela Usuario

UPDATE Usuario u SET cpf = NULL WHERE u.id = 1;

-- Deveria falhar com a restrição de Foreign Key da coluna time da tabela Jogador

UPDATE Jogador j SET "time" = 1 WHERE j.id = 160;