-- Deveria apagar uma aposta

DELETE FROM Apostas a WHERE a.id = 10;

-- Deveria apagar um Jogador

DELETE FROM Jogador j WHERE j.nome = 'P. Zabaleta';

-- Deveria apagar todas as apostas de antes de março

DELETE FROM Apostas a WHERE a.data < DATE()