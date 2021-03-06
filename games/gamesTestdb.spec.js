const server = require('../api/server');
const db = require('../data/dbConfig');
const GamesTest = require('./gamesTestdbModel');
const req = require('supertest');


/*   First TRY
const knexInstance = require('knex')(
    {
        client: 'sqlite3',
        connection: {
        filename: './data/test.db3',
        },
        useNullAsDefault: true,
        migrations: {
        directory: './data/migrations',
        },
        seeds: {
        directory: './data/seeds',
        },
    }
  );
*/

//  refactor 1
/*
const knex = require('knex');
const config = require('../knexfile');
const knexInstance = knex(config.testing);

console.log('##############  db ', config.testing);
*/



/*
const knex = require('knex');
const db = require('../data/dbConfig');
console.log('##############  db ', db.environment);
const knexInstance = knex(db);
*/


describe('Experiments with test_db TESTS  ', () => {

    
    beforeEach(async () => {
        // refactor 1
        //await knexInstance.seed.run(process.env.DB_ENV);
        
        // refactor 2
        await db.seed.run(process.env.DB_ENV);
    })
    

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

                //const gameData = await GamesTest.getAll();
                let gameData = await GamesTest.getAll();
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

                /*
                // REMOVE game -- not needed after adding in seeding before each test!!!
                gameData = await GamesTest.getAll();

                let insertedGameId = gameData[4].id.toString();
                await GamesTest.remove(insertedGameId); 

                gameData = await GamesTest.getAll();
                expect(gameData).toHaveLength(4);
                */

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

        describe('DELETE tests', () => {
            it('should delete a game that was added using remove', async () => {
                const testGame = {
                    'title': 'gonna get deleted',
                    'genre': 'arcade',
                    'releaseYear': 1880,
                }

                
                let gameList = await GamesTest.getAll();
                expect(gameList).toHaveLength(4);

                const addedGame = await GamesTest.insert(testGame);
        
                gameList = await GamesTest.getAll();
                expect(gameList).toHaveLength(5);

                await GamesTest.remove(addedGame.id);
                gameList = await GamesTest.getAll();
                expect(gameList).toHaveLength(4);
                

            })

            
            it('should delete a game that was added using delete ', async () => {
                const testGame = {
                    'title': 'gonna get deleted',
                    'genre': 'arcade',
                    'releaseYear': 1880,
                }

                let gameList = await GamesTest.getAll();
                expect(gameList).toHaveLength(4);

                const addedGame = await GamesTest.insert(testGame);
        
                gameList = await GamesTest.getAll();
                expect(gameList).toHaveLength(5);

               // console.log('gameList **********   ',  gameList);
                let deleteId = gameList[4].id.toString();
               // console.log('>>>>>>>>   deleteId ', deleteId);
                
                await GamesTest.remove(addedGame.id);

                gameList = await GamesTest.getAll();
                expect(gameList).toHaveLength(4);
                
                  // DOES NOT WORK returns 404   statusMessage: 'Not Found' >> send MUST use a string
                  // const badDeleteRequest = await req(server).delete('/test_db').send(deleteId)
            })
            
            it('should not allow to delete a non-existing index ', async () => {
                const badIndexGame = await GamesTest.remove(6);
                expect(badIndexGame).toBe(0);
  
               let badDeleteRequest = await req(server).delete('/test_db').send('100');
               expect(badDeleteRequest.status).toBe(404);
               badDeleteRequest = await req(server).delete('/test_db/100'); 
               expect(badDeleteRequest.status).toBe(404);
               expect(badDeleteRequest.body).toEqual({});
            })
        })

        describe('UPDATE Tests ', () => {
  
            it('should update first item in test db ', async () => {
                const updatedGame = {
                    'title': "Pacman has been updated",
                     'genre': 'Classic',
                     'releaseYear': 80, 
                }
            
                // let gameData = await GamesTest.getAll();
                const res = await req(server).get('/test_db');

              //  let updatedList = await req(server).put('/test_db/1').send(updatedGame); // no workee
                let updatedList = await GamesTest.update(1, updatedGame);   // works !!
                expect(updatedList).toBe(1);

                let gameList = await req(server).get('/test_db');
                let gameData = await GamesTest.getAll();

                 expect(gameList.body[0].title).toEqual(updatedGame.title);
                 expect(gameList.body[0].genre).toEqual(updatedGame.genre);
                 expect(gameList.body[0].releaseYear).toEqual(updatedGame.releaseYear);
            })
   
            it('should NOT update non-existing id ', async () => {
                const updatedGame = {
                    'title': "Pacman has been updated",
                     'genre': 'Classic',
                     'releaseYear': 80, 
                }
//
                const origGame = {
                    "title": "Pacman_TEST_db",
                    "genre": "Arcade",
                    "releaseYear": 1980
                }
   
                const res = await req(server).get('/test_db');

                let updatedList_put = await req(server).put('/test_db/1').send(updatedGame); // no workee
                let updatedList_update = await GamesTest.update(100, updatedGame);   // works !!
  
                expect (updatedList_put.body).toEqual({});
                expect (updatedList_update).toBe(0);

                let gameList = await req(server).get('/test_db');
                let gameData = await GamesTest.getAll();

                expect(gameList.body[0].title).toEqual(origGame.title);
                expect(gameList.body[0].genre).toEqual(origGame.genre);
                expect(gameList.body[0].releaseYear).toEqual(origGame.releaseYear);
            })

        })
    })    
    
});    