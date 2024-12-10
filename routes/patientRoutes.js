const express = require("express");
const router = express.Router();

const patientcontroller=require('../controllers/authController');



router.route("/register").post(patientcontroller.registerPatient);
module.exports= router;