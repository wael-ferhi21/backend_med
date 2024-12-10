const express = require("express");
const router = express.Router();

const medecincontroller=require('../controllers/authController');



router.route("/register").post(medecincontroller.registerMedecin);
module.exports= router;