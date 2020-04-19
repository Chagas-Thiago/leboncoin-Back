const User = require("../models/user-model");

const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    // Chercher dans la BDD à qui appartient ce token
    const token = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({ token: token });

    if (user) {
      // stocker `user` dans la request
      req.user = user;
      next();
    } else {
      // mauvais token
      res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    // aucun token
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = isAuthenticated;
