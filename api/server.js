const express = require('express');

const server = express();

const Games = require('../games/gamesModel');
// const GamesTestdb = require('../games/gamesTestdbModel');

// add router path
const TestGamesRouter = require('../games/gamesTestdb-Router');

server.use(express.json());

// sanity check
server.get('/', (req,res) => {
    res.cookie('SPRINTcookie', 'cookieForTestingSprint' );

    res.status(200).json({message: `Sprint TESTING server sanity check !!! `})

});

// mount route for test db
server.use('/test_db', TestGamesRouter);



// GET all games
  server.get('/games', async(req,res) => {

    try{
      const games = await Games.getAll()   
     // console.log(games);
      res.status(200).json(games);
    }
    catch (err){
      res.status(500).json(err);
    }
  })
/*
  server.get('/test_db', async(req,res) => {

    try{
      const games = await GamesTestdb.getAll()   
     // console.log(games);
      res.status(200).json(games);
    }
    catch (err){
      res.status(500).json(err);
    }
  })
*/



server.get('/games/:id', async(req, res) => {
    const {id} = req.params;
    
    try{
      const game = await Games.findById(id);
     // console.log('server promise Game', game);
       
      if(game){
        res.status(200).json(game)
      } else {
        res.status(404).json({
          message: `${id} not found`
        })
      }
    }
    catch (err) {
      res.status(500).json({
        message: `ERROR getting Game id`
      });
    }
  })

  server.post('/games', noDupGames, async (req, res) => {
    try{
        if(req.body.title === '' || req.body.genre === '') {
            res.status(422).json({
                message: `Please add title & genre item`
            })
        } else {
            const gameItem = await Games.insert(req.body);
     //       console.log(' !!!!!  gameItem is ', gameItem);
            res.status(201).json({gameItem});
        }    
  }
  catch (err) {
      res.status(500).json({
        message: `ERROR`
      });
    }
})

server.delete('/games/:id', async(req, res) => {
    const {id} = req.params;
    
    try{
      const game = await Games.remove(id);
      console.log('server promise Game', game)
       
      if(game){
        res.status(200).json(game)
      } else {
        res.status(404).json({
          message: ` Game with id ${id} not found`
        })
      }
    }
    catch (err) {
      res.status(500).json({
        message: `ERROR in delete`
      });
    }
  })

  server.put('/games/:id', async(req, res) => {
    const updatedGame = req.body;
    const {id} = req.params;

    try{
        const gameUpdate = await Games.update(id, updatedGame);

        if(gameUpdate){
            res.status(201).json({updatedGame})
        } else {
            res.status(451).json({
                message: `Game id ${id} does not exist`
            })
        }
    }
    catch (err) {
        res.status(500).json({
          message: `ERROR`
        });
      }
  })

// custom middleware
async function noDupGames(req, res, next) {
    const {title} = req.body;

    try {
        const titleExists = await Games.findByTitle(title);
        if(titleExists) {
            res.status(405).json({
                message: ` Game ${title} already exits, not added`
            })
        } else {
            next();
        } 
    }   
    catch (err) {
        res.status(500).json({
          message: `ERROR with the MW`
        });
      }
}




module.exports = server;