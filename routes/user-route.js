//Como é um routeur tem que colocar isso ai
const express = require("express");
const router = express.Router();

//-----------------------------------------------------------------------------------------------------
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const User = require("../models/user-model");
//--------------ROUTE CREATED USER----------------------------------------------------------------------------------
router.post("/create/user", async (req, res) => {
  try {
    if (!req.fields.username || !req.fields.email || !req.fields.password) {
      return res.status(400).json({ message: "A value is missing" });
    }
    //verificar si o email ja existe--------------------------------------------------
    const verifyUser = await User.findOne({ email: req.fields.email });
    if (verifyUser) {
      return res.status(400).json({ message: "Email already used" });

      //sinao criar um----------------------------------------------------------------------------------------------
    } else {
      //generer token,salt,hash------------------------------------------------------------------------------
      const token = uid2(16);
      const salt = uid2(16);
      const hash = SHA256(req.fields.password + salt).toString(encBase64);

      const user = new User({
        email: req.fields.email,
        token: token,
        hash: hash,
        salt: salt,
        account: {
          username: req.fields.username,
          phone: req.fields.phone,
        },
      });

      //salvar e retornar ---------------------------------------------------------------------------------------------
      await user.save();
      return res.json({
        _id: user._id,
        token: user.token,
        account: {
          username: user.account.username,
          phone: user.account.phone,
        },
      });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
//--------------------------------ROUTE 2 LOGIN------------------------------------------------------------------------
router.post("/user/log_in", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });
    //chercher si email est deja dans la base des donnes
    if (user) {
      const hash = SHA256(req.fields.password + user.salt).toString(encBase64);

      if (hash === user.hash) {
        return res.json({
          _id: user._id,
          token: user.token,
          account: {
            username: user.account.username,
            phone: user.account.phone,
          },
        });
      } else {
        //si le hash n'est pas le meme a celui de la bdd
        return res.status(400).json({ message: "Wrong password" });
      }
    } else {
      return res.status(400).json({ message: "Unknown email" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
module.exports = router;
