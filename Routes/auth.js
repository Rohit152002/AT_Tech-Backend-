const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/user.model");
const fetchDetails = require("../Middleware/fetchDetails");

const JWT_SECRET = "Ourteamnameis$AT";

router.post(
  "/create",
  [
    body("username", "Username must be atleast 4 characters").isLength({
      min: 4,
    }),
    body("address", "Address must be atleast 8 characters").isLength({
      min: 8,
    }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "User with this email alreadu exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        username: req.body.username,
        address: req.body.address,
        interest: req.body.interest,
        email: req.body.email,
        password: securePassword,
        pincode: req.body.pincode
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, JWT_SECRET);
      res.status(201).json({token});
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  });

  router.post(
    "/login",
    [
      body("email", "Enter a valid email").isEmail(),
      body("password", "Password cannot be blank").exists(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
          return res.status(400).json({success, error: "Try to login with correct credentials"})
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
          return res.status(400).json({success, error: "Try to login with correct credentials"})
        }
        const data = {
          user: {
            id: user.id,
          },
        };
        const token = jwt.sign(data, JWT_SECRET);
        res.status(200).json({token})
      } catch (error) {
        console.log(error.message);
        res.status(500).send("Some Error occured");
    }
  });
  router.post('/getUser', fetchDetails, async( req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select('-password -__v');
      res.json(user)
      
    } catch (error) {
      console.log(error.message)
      res.status(500).send("Some Error occured")
    }
  });

  module.exports = router
