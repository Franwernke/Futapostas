-- Inserções

INSERT INTO apostas(id,valor,tipo,lucro_ou_perda,usuario,jogo,data) VALUES (15,500,'time_vencedor','lucro',3,75,'2018-09-01T14:00:00+00:00');
INSERT INTO deposito(id,valor,usuario) VALUES (1,1200,1);
INSERT INTO jogo(id,local,data_horario,timea,timeb,campeonato,numero_de_resenhas) VALUES (99,'Crystal Palace','2018-09-01T14:00:00+00:00',52,41,'Regular Season - 4',0);
INSERT INTO usuario(id,carteira,privacidade_do_perfil,cpf,nome,email) VALUES (1,434,true,'545.269.123-87','John Doe','john.doe@email.com');
INSERT INTO jogador(id,nome,data_de_nascimento,local_de_nascimento,numero_de_resenhas,altura,peso,time) VALUES (18943,'J. Vestergaard','1992-08-03','København',0,199,98,41);
INSERT INTO time(id,nome,numero_de_resenhas) VALUES (45,'Everton',0);

-- Remoções

DELETE FROM apostas a WHERE a.id = 2;
DELETE FROM deposito d WHERE d.id = 2;
DELETE FROM jogo j WHERE j.id = 100;
DELETE FROM jogador j WHERE j.id = 160;
DELETE FROM time t WHERE t.id = 50;
DELETE FROM usuario u WHERE u.id = 2;

-- Updates

UPDATE apostas a SET lucro_ou_perda = 'lucro' WHERE a.id = 2;
UPDATE deposito d SET valor = 1250 WHERE d.id = 1;
UPDATE jogo j SET "local" = 'Newcastle' WHERE j.id = 111;
UPDATE jogador j SET time = 45 WHERE j.id = 160;
UPDATE time t SET numero_de_resenhas = 3 WHERE t.id = 50;
UPDATE usuario u SET carteira = 500 WHERE u.id = 1;

-- Queries interessantes

-- Soma o valor de todas as apostas feitas sobre cada jogo

SELECT jogo, SUM(valor) as total FROM apostas GROUP BY jogo;

-- Retorna todos os jogadores de cada time em ordem alfabética

SELECT t.nome, j.nome FROM Time t
  INNER JOIN Jogador j ON j.time=t.id
  GROUP BY t.nome, j.nome
  ORDER BY t.nome;

-- Soma o quanto já foi apostado por cada usuário

SELECT u.nome, SUM(a.valor) FROM Apostas a
  INNER JOIN Usuario u ON u.id = a.usuario
  GROUP BY u.nome;

-- Soma quantas apostas estão relacionadas a cada embate e ordena pelo embate mais apostado

SELECT j.data_horario as data_do_embate, t1.nome as time_da_casa, t2.nome as time_de_fora, COUNT(t1.nome) as numero_de_apostas 
  FROM Jogo j
  INNER JOIN Apostas a on a.jogo=j.id
  INNER JOIN Time t1 on j.timea=t1.id
  INNER JOIN Time t2 on j.timeb=t2.id
  GROUP BY t1.nome, t2.nome, j.data_horario
  ORDER BY numero_de_apostas DESC;

-- Encontra o jogador com menor IMC

SELECT j.nome, (j.peso / ((j.altura / 100) * (j.altura / 100))) as IMC FROM Jogador j 
  WHERE j.peso IS NOT NULL AND j.peso IS NOT NULL
  ORDER BY IMC ASC 
  LIMIT 1;