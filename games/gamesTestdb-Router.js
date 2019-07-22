const express = require('express');
const server = express();
const router = express.Router();

const GamesTestdb = require('../games/gamesTestdbModel');

// GET Testdb items
//  '/' =>    '/test_db' endpoint 
router.get('/', async(req,res) => {

    try{
      const games = await GamesTestdb.getAll()   
     // console.log(games);
      res.status(200).json(games);
    }
    catch (err){
      res.status(500).json(err);
    }
  })

  // MW ONLY affects post method, NOT using insert directly !
  // router.post('/',  noDupGames, async(req, res) => {
  router.post('/',  noDupGames, async(req, res) => {

    try{
        if(req.body.title === '' || req.body.genre === '') {
            res.status(422).json({
                message: `Please add title & genre item`
            })
        } else {
            const gameItem = await GamesTestdb.insert(req.body);
            res.status(201).json({gameItem});
        }
    }
    catch (err) {
        res.status(500).json({
          message: `ERROR`
        });
      }
})

server.get('/:id', async(req, res) => {
    const {id} = req.params;
    
    try{
      const game = await GamesTestdb.findById(id);
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

server.delete('/:id', async(req, res) => {
    const {id} = req.params;
    
    try{
      const game = await GamesTestdb.remove(id);
      console.log('server promise Game', game)
       
      if(game){
        res.status(200).json(game)
      } else {
        res.status(404).json({
          message: ` Game with ${id} not found`
        })
      }
    }
    catch (err) {
      res.status(500).json({
        message: `ERROR in delete`
      });
    }
  })




// custom middleware
async function noDupGames(req, res, next) {
    const {title} = req.body;

    try {
        const titleExists = await GamesTestdb.findByTitle(title);
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


module.exports = router;
  // DONT FORGET