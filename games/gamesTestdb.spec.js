const server = require('../api/server');
const db = require('../data/dbConfig');
const GamesTest = require('./gamesTestdbModel');
const req = require('supertest');
//const knex = require('knex');

//const knexInstance = require('knex')(config);  // sqlite does not support inserting default values


describe('Experiments with test_db TESTS  ', () => {

/*
    beforeEach(async () => {
        await knexInstance.seed.run();
    })
*/

    describe('GET tests', () => {
        it('should get games test data from test_db', async () => {

            const res = await req(server).get('/test_db');
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(4);
        }) 

        it('should receive same data from endpoint and data access file', async () => {
            const res = await req(server).get('/test_db');
      //      console.log('res >>>> \n', res.body );

            const gameData = await GamesTest.getAll();
      //      console.log(' getAll() >>>>>>>>>>> \n', gameData);


            expect(res.body).toEqual(gameData);
        })

        it('should get game with a specific id', async () => {
            const selectedGame = await GamesTest.findById(4);
            expect(selectedGame).toEqual({
                id: 4, title: 'Space Invaders_TEST_db', genre: 'Arcade', releaseYear: 1980
            });
        });

        it('should return status 404 & error message for id that does not exist', async () => {
            const nonexistingGame = await GamesTest.findById(100);
            const res = await req(server).get('/test_db/100');

            expect(res.status).toBe(404);
            expect(nonexistingGame).toBeUndefined();
        })    

        
        describe('Tests that involve POST & insert', () => {
            // need cleanup here ??
           
            
            it(' should insert a game using POST', async () => {
               const insertedGame = {
                    'title' : 'Battlezone',
                    'genre' : 'Arcade',
                    'releaseYear': 1981,
               }
               
                let res = await req(server).post('/test_db').send(insertedGame);
                expect(res.status).toBe(201);

                const gameData = await GamesTest.getAll();
                expect(gameData).toHaveLength(5);

                res = await req(server).post('/test_db').send(insertedGame);
                expect(res.status).toBe(405);
                expect(res.body).toMatchObject({
                    message: " Game Battlezone already exits, not added"
                });

                res = await req(server).post('/test_db').send(insertedGame);
                expect(res.status).toBe(405);
                expect(res.body).toMatchObject({
                    message: " Game Battlezone already exits, not added"
                });

                // This DIRECTLY inserts to db, MW cannot stop, duplicate entry will be made
              //  const insertUsingKnex = await GamesTest.insert(insertedGame);
     

            })
      
            it(' should NOT allow game with empty title OR genre', async () => {
                const noTitle = {
                    'title' : '',
                    'genre' : 'NeverSeen',
                    'releaseYear': 1981,
               }
               const noGenre = {
                'title' : 'NeveAdded',
                'genre' : '',
                'releaseYear': 1981,
                }
         
                var res = await req(server).post('/test_db').send(noTitle);
                expect(res.status).toBe(422);
                res = await req(server).post('/test_db').send(noGenre);
                expect(res.status).toBe(422);

                let res2 = await req(server).post('/test_db').send(noTitle);
                expect(res2.status).toBe(422);
                res2 = await req(server).post('/test_db').send(noGenre);
                expect(res2.status).toBe(422);

        
            })

        })

    })    
    
});    