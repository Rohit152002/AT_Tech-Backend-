const express = require('express');
const eventModel = require('../Models/event.model');
const router = express.Router();



router.get('/getAllEvent', async (req, res) => {
  try {
    const response = await eventModel.find();
    if(!response){
      res.status(400).json({error: 'Data not found'});
    }
    res.status(200).json(response)
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error")
  }
})
router.post('/getAllEvent', async (req, res) => {
  try {
    const event = await playerModel.create({
        title: req.body.title,
        location: req.body.location,
        sport: req.body.sport,
        dates: req.body.dates,
        img: req.body.img
    })
    res.status(200).json(event);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error")
  }
})


module.exports = router;