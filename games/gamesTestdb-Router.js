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

router.post('/', async(req, res) => {

    try{
        if(req.body.title === '' || req.body.genre === '') {
            req.status(422).sjon({
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



module.exports = router;
  // DONT FORGET