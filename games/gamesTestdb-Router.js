const express = require('express');
const server = express();
const router = express.Router();

const GamesTestdb = require('../games/gamesTestdbModel');

// GET Testdb items
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

module.exports = router;
  // DONT FORGET