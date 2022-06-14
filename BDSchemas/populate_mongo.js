db = db.getMongo().getDB("futapostas");

db.times.insertMany([
{
    "id":50, 
    "name":"Manchester City", 
    "leagues":[
    {"league_name":"premier league","rank":1, "points":98, "games":{"draw": 2, "goals": {"against": 23, "for": 95}, "lose": 4, "played": 38, "win": 32}, "goalsDiff":72}]
},
{
    "id":40, 
    "name":"Liverpool", 
    "leagues":[
    {"league_name":"premier league","rank":2, "points":97, "games":{"draw": 7, "goals": {"against": 22, "for": 89}, "lose": 1, "played": 38, "win": 30}, "goalsDiff":67}]
},
{
    "id":49, 
    "name":"Chelsea", 
    "leagues":[
    {"league_name":"premier league","rank":3, "points":72, "games":{"draw": 9, "goals": {"against": 39, "for": 63}, "lose": 8, "played": 38, "win": 21}, "goalsDiff":24}]
},
{
    "id":47, 
    "name":"Tottenham", 
    "leagues":[
    {"league_name":"premier league","rank":4, "points":71, "games":{"draw": 2, "goals": {"against": 39, "for": 67}, "lose": 13, "played": 38, "win": 23}, "goalsDiff":28}]
},
{
    "id":42, 
    "name":"Arsenal", 
    "leagues":[
    {"league_name":"premier league","rank":5, "points":70, "games":{"draw": 7, "goals": {"against": 51, "for": 73}, "lose": 10, "played": 38, "win": 21}, "goalsDiff":22}]
},
{
    "id":33, 
    "name":"Manchester United", 
    "leagues":[
    {"league_name":"premier league","rank":6, "points":66, "games":{"draw": 9, "goals": {"against": 54, "for": 65}, "lose": 10, "played": 38, "win": 19}, "goalsDiff":11}]
},
{
    "id":39, 
    "name":"Wolves", 
    "leagues":[
    {"league_name":"premier league","rank":7, "points":57, "games":{"draw": 9, "goals": {"against": 46, "for": 47}, "lose": 13, "played": 38, "win": 16}, "goalsDiff":1}]
},
{
    "id":45, 
    "name":"Everton", 
    "leagues":[
    {"league_name":"premier league","rank":8, "points":54, "games":{"draw": 9, "goals": {"against": 46, "for": 54}, "lose": 14, "played": 38, "win": 15}, "goalsDiff":8}]
},
{
    "id":46, 
    "name":"Leicester", 
    "leagues":[
    {"league_name":"premier league","rank":9, "points":52, "games":{"draw": 7, "goals": {"against": 48, "for": 51}, "lose": 16, "played": 38, "win": 15}, "goalsDiff":3}]
},
{
    "id":48, 
    "name":"West Ham", 
    "leagues":[
    {"league_name":"premier league","rank":10, "points":52, "games":{"draw": 7, "goals": {"against": 55, "for": 52}, "lose": 16, "played": 38, "win": 15}, "goalsDiff":-3}]
},
{
    "id":38, 
    "name":"Watford", 
    "leagues":[
    {"league_name":"premier league","rank":11, "points":50, "games":{"draw": 8, "goals": {"against": 59, "for": 52}, "lose": 16, "played": 38, "win": 14}, "goalsDiff":-7}]
},
{
    "id":52, 
    "name":"Crystal Palace", 
    "leagues":[
    {"league_name":"premier league","rank":12, "points":49, "games":{"draw": 7, "goals": {"against": 53, "for": 51}, "lose": 17, "played": 38, "win": 14}, "goalsDiff":-2}]
},
{
    "id":34, 
    "name":"Newcastle", 
    "leagues":[
    {"league_name":"premier league","rank":13, "points":45, "games":{"draw": 9, "goals": {"against": 48, "for": 42}, "lose": 17, "played": 38, "win": 12}, "goalsDiff":-6}]
},
{
    "id":35, 
    "name":"Bournemouth", 
    "leagues":[
    {"league_name":"premier league","rank":14, "points":45, "games":{"draw": 6, "goals": {"against": 70, "for": 56}, "lose": 19, "played": 38, "win": 13}, "goalsDiff":-14}]
},
{
    "id":44, 
    "name":"Burnley", 
    "leagues":[
    {"league_name":"premier league","rank":15, "points":40, "games":{"draw": 7, "goals": {"against": 68, "for": 45}, "lose": 20, "played": 38, "win": 11}, "goalsDiff":-23}]
},
{
    "id":41, 
    "name":"Southampton", 
    "leagues":[
    {"league_name":"premier league","rank":16, "points":39, "games":{"draw": 12, "goals": {"against": 65, "for": 45}, "lose": 17, "played": 38, "win": 9}, "goalsDiff":-20}]
},
{
    "id":51, 
    "name":"Brighton", 
    "leagues":[
    {"league_name":"premier league","rank":17, "points":36, "games":{"draw": 9, "goals": {"against": 60, "for": 35}, "lose": 20, "played": 38, "win": 9}, "goalsDiff":-25}]
},
{
    "id":43, 
    "name":"Cardiff", 
    "leagues":[
    {"league_name":"premier league","rank":18, "points":34, "games":{"draw": 4, "goals": {"against": 69, "for": 34}, "lose": 24, "played": 38, "win": 10}, "goalsDiff":-35}]
},
{
    "id":36, 
    "name":"Fulham", 
    "leagues":[
    {"league_name":"premier league","rank":19, "points":26, "games":{"draw": 5, "goals": {"against": 81, "for": 34}, "lose": 26, "played": 38, "win": 7}, "goalsDiff":-47}]
},
{
    "id":37, 
    "name":"Huddersfield", 
    "leagues":[
    {"league_name":"premier league","rank":20, "points":16, "games":{"draw": 7, "goals": {"against": 76, "for": 22}, "lose": 28, "played": 38, "win": 3}, "goalsDiff":-54}]}
]);

db.jogador.insertMany();

db.jogo.insertMany();

db.usuario.insertMany();

