const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      required: true,
      default: ["user"],
      
    },
  },
  { timestamps: true }
);


const User = mongoose.model('User', userSchema);



const medecinSchema = new mongoose.Schema({
  matricule: { type: Number, required: true },
 
  specialte: { type: String, required: true },
  nom:{ type: String, required: true },
  prenom:{ type: String, required: true },

});

const patientSchema = new mongoose.Schema({

  nom:{ type: String, required: true },
  prenom:{ type: String, required: true },
});

const adminSchema = new mongoose.Schema({
 
});


const Medecin = User.discriminator("Medecin", medecinSchema);
const Patient = User.discriminator("Patient", patientSchema);
const Admin = User.discriminator("Admin", adminSchema);

module.exports = { User, Medecin, Patient, Admin };
