const express = require('express');
const playerModel = require('../Models/player.model');
const router = express.Router();



router.get('/getAllPlayers', async (req, res) => {
  try {
    const response = await playerModel.find();
    if(!response){
      res.status(400).json({error: 'Data not found'});
    }
    res.status(200).json(response)
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error")
  }
})
router.post('/getAllPlayers', async (req, res) => {
  try {
    const player = await playerModel.create({
        name: req.body.name,
        address: req.body.address,
        games: req.body.games,
        position: req.body.position,
        image: req.body.image,
        age: req.body.age
    })
    res.status(200).json(player);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error")
  }
})


module.exports = router;