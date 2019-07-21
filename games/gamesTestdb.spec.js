const server = require('../api/server');
const db = require('../data/dbConfig');
const Games = require('./gamesTestdbModel');
const req = require('supertest');

describe('Experiments with test_db TESTS  ', () => {
/*
    beforeEach(async () => {
        await db('games').truncate();
    })
*/
    describe('GET & POST tests', () => {
        it('should get games from test_db', async () => {

            const res = await req(server).get('/test_db');
           // console.log('test_db >>> ', res);
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(4);


        }) 
    })    
    
});    