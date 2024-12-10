require("dotenv").config (); 

//console.log(process.env.NODE_ENV); 
const express =require("express"); 
const app=express ();
const cors =require("cors");
const PORT =process.env.PORT || 5000;
const mongoose =require("mongoose");
const connectDB = require("./config/db.config");
const cookieParser =require("cookie-parser");




app.use(cors({
    origin: "http://localhost:3000", // Allow only React's origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow credentials if needed
  }));

app.get("/",(req,res)=>
    {res.send("hello")

})


app.use(cookieParser());
app.use(express.json());
connectDB();


app.use("/patient",require("./routes/patientRoutes"));
app.use("/admin",require("./routes/adminRoutes"));
app.use("/medecin",require("./routes/medecinRoutes"));
app.use("/",require("./routes/authRoutes"));





mongoose.connection.once("open", ()=>{
    console.log('connecter to the database');

app.listen(PORT , () => {
    console.log(`server is running on port ${PORT}`);
     })
})    

