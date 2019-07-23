const server = require('../api/server');
const db = require('../data/dbConfig');
const Games = require('./gamesModel');
const req = require('supertest');

const testInputs = [
    {
        "title": "PacmanTEST",
        "genre": "Arcade",
        "releaseYear": 1980
    },
    {
        "title": "Ms. PacmanTEST",
        "genre": "Arcade",
        "releaseYear": 1983
    },
    {
        "title": "AsteroidsTEST",
        "genre": "Arcade",
        "releaseYear": 1980
    },        
];

const testGames = [
    {
        "id": 1,
        "title": "PacmanTEST",
        "genre": "Arcade",
        "releaseYear": 1980
    },
    {
        "id": 2,
        "title": "Ms. PacmanTEST",
        "genre": "Arcade",
        "releaseYear": 1983
    },
    {
        "id": 3,
        "title": "AsteroidsTEST",
        "genre": "Arcade",
        "releaseYear": 1980
    },        
];



describe('Sprint db tests ', () => {

    beforeEach(async () => {
        await db('games').truncate();
    })

    describe('GET & POST tests', () => {
        it('should insert a game', async () => {
            await Games.insert(    {
                "title": "PacmanTEST",
                "genre": "Arcade",
                "releaseYear": 1980
            });

            const games = await db('games');
            expect(games).toHaveLength(1);
            expect(games[0].title).toBe('PacmanTEST');
            expect(games[0].genre).toBe('Arcade');
            expect(games[0].releaseYear).toBe(1980);

        }) 

        it('should return game obj that was inserted', async () => {
            const insertedGame =  await Games.insert(    {
                "title": "PacmanTEST",
                "genre": "Arcade",
                "releaseYear": 1980
            });

            expect(insertedGame.title).toBe('PacmanTEST');
            expect(insertedGame).toHaveProperty("releaseYear", 1980);
            expect(insertedGame).toEqual({
                "id": 1,
                "title": "PacmanTEST",
                "genre": "Arcade",
                "releaseYear": 1980,
            })
        })

        it('should return every game from testIputs', async () => {
            await db('games').insert(testInputs);

            const res = await req(server).get('/games');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(testGames);

        })

        it('should return an empty ARRAY with empty db', async () => {
            const res = await req(server).get('/games');
            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
            expect(res.body).toHaveLength(0);
            expect(res.body).not.toBeNull();
            expect(res.body).not.toBeUndefined();

        })

        it('should return 404 & error message when getting ID that does not exist', async () => {
            const insertedGame =  await Games.insert(    {
                "title": "PacmanTEST",
                "genre": "Arcade",
                "releaseYear": 1980
            });

            const res = await req(server).get('/games/2');
            expect(res.status).toBe(404);
            expect(res.body).toMatchObject({
                message: "2 not found"
            });

        })


        it('should return 422 & error message when title OR genre is blank', async () => {
            const insertedGame =  {
                "title": "",
                "genre": "Arcade",
                "releaseYear": 1980
            };

            const res = await req(server).post('/games').send(insertedGame);
            // console.log('>>>>>>  res.status  ', res.status);

            expect(res.status).toBe(422);
            expect(res.body).toMatchObject({
                message: `Please add title & genre item`
            })
        })


        it('middleware should NOT allow duplicate game title to be added', async () => {
            await db('games').insert(testInputs);

            const dupGame = {
                "title": "PacmanTEST",
                "genre": "Arcade",
                "releaseYear": 1980
            }

            req.body = dupGame;
            const res = await req(server).post('/games').send(dupGame);
            expect(res.status).toBe(405);
            expect(res.body).toMatchObject({
                message: " Game PacmanTEST already exits, not added"
            });
        })
    })

    describe('DELETE tests !!! ', () => {
        it('should delete a game given an existing id', async () => {
            await db('games').insert(testInputs);

            let res = await req(server).get('/games');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(testGames);
          //  console.log('>>>>testGames  \n', testGames);
       
            expect(testGames).toHaveLength(3);    
            const deleteResult = await Games.remove(3);
            expect(deleteResult).toEqual(1);

            res = await req(server).get('/games');
            expect(res.status).toBe(200);
           // expect(res.body).toEqual(testGames);
           // console.log('>>>> res.body  \n', res.body);
            expect(res.body).toHaveLength(2);
        })
//
        it('should NOT be able delete a game given an non-existing id', async () => {
            await db('games').insert(testInputs);

            let res = await req(server).get('/games');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(testGames);
   //         console.log('>>>>testGames  \n', testGames);
       
            expect(testGames).toHaveLength(3);    
            const deleteResult = await Games.remove(100);
            expect(deleteResult).toEqual(0);

            res = await req(server).get('/games');
            expect(res.status).toBe(200);
       //     console.log('>>>> res.body  \n', res.body);
            expect(res.body).toHaveLength(3);
        })

    })


})