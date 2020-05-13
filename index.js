require("dotenv").config();
//instalar express, express formidable e mongoose

const express = require("express");
const mongoose = require("mongoose");
const formidable = require("express-formidable");
//Usar cors e ativar
const cors = require("cors");

//-----------------------------------------------------------
//ativar o servidor e formidable
const app = express();
app.use(formidable());
app.use(cors());
//---------------------------------------------------------------
//ativar mongoose
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
//--------------------------------------------------------------------------
//instalar e importer cloudinary
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dk94g7g12",
  api_key: "167329626518939",
  api_secret: "MJ4UOl8fpEbZuOF7bVSiaHMv0a0",
});

//--------------------------------------------------------------------------------------------------------------------
// import et activer les routes :
const userRoutes = require("./routes/user-route");
app.use(userRoutes);
const offerRoutes = require("./routes/offer-route");
app.use(offerRoutes);
const payRoutes = require("./routes/pay-route");
app.use(payRoutes);
//---------------------------------------------------------------------------------------------------------

//demarrer le serveur
app.listen(process.env.PORT, () => {
  console.log("Server started");
});
