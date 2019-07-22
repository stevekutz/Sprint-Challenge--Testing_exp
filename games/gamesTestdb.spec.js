const server = require('../api/server');
const db = require('../data/dbConfig');
const GamesTest = require('./gamesTestdbModel');
const req = require('supertest');
const knex = require('');

describe('Experiments with test_db TESTS  ', () => {

    beforeEach(async () => {
        await knex.seed;
    })

    describe('GET & POST tests', () => {
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

        describe('Tests that involve POST & insert', () => {
            // need cleanup here ??
            
            
            it(' should insert a game using POST', async () => {
               const insertedGame = {
                    'title' : 'Battlezone',
                    'genre' : 'Arcade',
                    'releaseYear': 1981,
               }
               
               
               
                let res = await req(server).post('/test_db').send(insertedGame);
                console.log('res post >>>> \n', res.body );
                const gameData = await GamesTest.insert(insertedGame);
                console.log('res insert() >>>> \n', res.body );
                res = await req(server).get('/test_db');
                console.log('res get >>>> \n', res.body );
            })


        })

    })    
    
});    