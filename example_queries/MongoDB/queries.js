// Queries

// Devolver todas as partidas com mais de 5 gols
db.jogos.aggregate([{ $group : { _id: {matchId: "$id", awayTeam: "$info.awayTeam", homeTeam: "$info.homeTeam"}, golsPartida: { $max : {$sum: [{$toInt: "$info.goalsAwayTeam"},{$toInt: "$info.goalsHomeTeam"}]}}}}, {$sort: {golsPartida: -1}}, {$match: {golsPartida: {$gte: 5}}}]);

// Devolver os 5 times com os melhores saldo de gols
db.times.aggregate({ $group : { _id: "$name", gD: {$max: "$leagues.goalsDiff"}}}, {$sort: {gD:-1}}, {$limit: 5});

// Devolver o usuário com maior lucro
db.usuarios.aggregate({ $group : { _id: "$nome", lucro: { $max : "$lucro" }}}, {$sort: {lucro:-1}}, {$limit: 1});

// Devolver o usuário com mais apostas
db.usuarios.aggregate({ $group : { _id: "$nome", quantidadeApostas: { $max : {$sum: ["$apostasVencedoras", "$apostasPerdedoras"]}}}}, {$sort: {quantidadeApostas: -1}}, {$limit: 1});

// Devolver jogador com mais cartões
db.jogadores.aggregate([{$unwind: "$statistics"},{$group: {_id: {id: "$id", firstName: "$info.firstname", lastName: "$info.lastname" }, cards: { $max : {$sum: ["$statistics.cards.red", "$statistics.cards.yellow", "$statistics.cards.yellowred"]}}}}, {$sort: {cards: -1}}, {$limit: 5}]);

// Classificação dos times que terminam em 'ham'
db.times.find({"name":{$regex: /.*(ham)$/}}, {_id: 0, name: 1, leagues:1})

// Liste os times que terminaram com mais de 60 pontos 
db.times.aggregate({$group: {_id: "$name", points : {$max : "$leagues.points"}}}, {$match: {points: {$gte: 60}}}, {$sort: {points: -1}})
