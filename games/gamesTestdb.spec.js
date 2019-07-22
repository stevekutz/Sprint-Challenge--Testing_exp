const server = require('../api/server');


//const server = require('../games/gamesTestdb-Router');
const db = require('../data/dbConfig');
const GamesTest = require('./gamesTestdbModel');
const req = require('supertest');

describe('Experiments with test_db TESTS  ', () => {
/*
    beforeEach(async () => {
        await db('games').truncate();
    })
*/
    describe('GET & POST tests', () => {
        it('should get games test data from test_db', async () => {

            const res = await req(server).get('/test_db');
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(4);
        }) 

        it('should receive same data from endpoint and data access file', async () => {
            const res = await req(server).get('/test_db');
          //  console.log('res >>>> \n', res.body );

            const gameData = await GamesTest.getAll();
          //  console.log(' getAll() >>>>>>>>>>> \n', gameData);


            expect(res.body).toEqual(gameData);
        })

    })    
    
});    