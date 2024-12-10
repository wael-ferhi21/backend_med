const express = require("express");
const router = express.Router();
const authcontroller = require('../controllers/authController');



router.route("/login").post(authcontroller.Login);
module.exports= router;