
const { User, Medecin, Patient, Admin } = require('../models/user');
const bcrypt = require ("bcrypt");
const jwt=require("jsonwebtoken");




async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}


async function registerMedecin(req, res) {
  try {
    const { email, password, nom, prenom, specialte, matricule } = req.body;

    if (!email || !password || !nom || !prenom || !specialte || !matricule) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await Medecin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await hashPassword(password);

    const medecin = new Medecin({
      email,
      password: hashedPassword,
      role: 'medecin',
      nom,
      prenom,
      specialte,
      matricule,
    });

    await medecin.save();

    res.status(201).json({ message: 'Doctor registered successfully', medecin });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: 'An error occurred during registration' });
  }
}



async function registerPatient(req, res) {
  try {
    const { email, password, nom, prenom, } = req.body;

 
    if (!email || !password || !nom || !prenom) {
      return res.status(400).json({ error: 'All fields are required' });
    }


    const existingUser = await Patient.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }


    const hashedPassword = await hashPassword(password);

 
    const patient = new Patient({
      email,
      password: hashedPassword,
      role: 'patient',
      nom,
      prenom,
     
    });


    await patient.save();

    res.status(201).json({ message: 'Patient registered successfully', patient });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during registration' });
  }
}
async function Login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const foundedUser = await User.findOne({ email }).exec();
    if (!foundedUser) {
      return res.status(401).json({ message: "User does not exist" });
    }

    if (foundedUser.role === 'admin' && foundedUser.password === password) {
      const token = jwt.sign(
        {
          UserInfo: {
            id: foundedUser._id,
            email: foundedUser.email,
            role: foundedUser.role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).send({
        message: 'Login successful',
        token,
        id: foundedUser._id,
        email: foundedUser.email,
        role: foundedUser.role, 
      });
    }

    const isMatch = await bcrypt.compare(password, foundedUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      {
        UserInfo: {
          id: foundedUser._id,
          email: foundedUser.email,
          role: foundedUser.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).send({
      message: 'Login successful',
      token,
      id: foundedUser._id,
      email: foundedUser.email,
      role: foundedUser.role,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = { registerMedecin, registerPatient,Login };

