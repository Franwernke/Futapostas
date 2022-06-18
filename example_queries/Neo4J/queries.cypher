// Obter montante total de um jogo

    // Verificando montante total do jogo de código 75 
MATCH 
    ()-[b]->(g:Jogo)
WHERE 
    g.Codigo = 75
RETURN SUM(b.Valor);

// Obter montante total de uma aposta em um jogo

    // Obtendo montante da aposta em time no jogo de código 250
MATCH 
    ()-[b:APOSTA_TIME]->(g:Jogo)
WHERE 
    g.Codigo = 350
RETURN SUM(b.Valor);

// Obter montante vencedor de uma aposta em um jogo

    // Obtendo montante da aposta em time no jogo de código 75
MATCH ()-[b:APOSTA_TIME]->(g:Jogo)
    WHERE 
        g.Codigo = 75 AND 
        b.Resultado = g.Resultado
RETURN SUM(b.Valor);
    // Deve devolver 250


// Recomendar jogos para um usuário especifico
    
    // feitas por usuário que apostou no mesmo jogo que ele 

        // Recomendando para o usuário de código 1: John Doe
MATCH 
    (john:Usuario)-[johnsBet]->(game)<-[]-(mate:Usuario)-[otherBet]->(desiredGame)
WHERE 
    john.Codigo = 1 AND 
    NOT EXISTS((john)-[]->(desiredGame)) 
RETURN DISTINCT desiredGame;
        // Deve devolver os jogos de código 174, 211, 224, 316, 379

    // feitas por usuário que realizou aposta de mesmo tipo em 
    // mesmo jogo que ele

        // Recomendando para o usuário de código 2: Phillip Rogers
MATCH 
    (phil:Usuario)-[philsBet]->(game)<-[mateBet]-(mate:Usuario)-[otherBet]->(desiredGame)
WHERE 
    phil.Codigo = 1 AND 
    NOT EXISTS((phil)-[]->(desiredGame)) AND 
    TYPE(philsBet) = TYPE(mateBet)
RETURN DISTINCT phil, philsBet, game, mate, otherBet, desiredGame;
        // Deve devolver os jogos de código 174, 211, 224, 316, 379