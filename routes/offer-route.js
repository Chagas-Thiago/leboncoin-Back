const express = require("express");
const router = express.Router();

const cloudinary = require("cloudinary");

const Offer = require("../models/offer-model");
const User = require("../models/user-model");

const isAuthenticated = require("../middlewares/is-authenticated");

//---------------------Created route post---------------------------------------------
router.post("/offer/publish", isAuthenticated, async (req, res) => {
  const user = req.user;

  try {
    if (user) {
      //a user was found/Send the file to Cloudinary
      const result = await cloudinary.uploader.upload(req.files.picture.path);

      // Save the ad and the image url in the database
      const offer = new Offer({
        created: Date.now(),
        creator: user,
        description: req.fields.description,
        picture: result,
        price: req.fields.price,
        title: req.fields.title,
      });

      await offer.save();

      // answer the customer
      return res.json({
        created: offer.created,
        creator: {
          account: {
            username: user.account.username,
            phone: user.account.phone,
          },
          _id: user._id,
        },
        description: offer.description,
        picture: offer.picture,
        price: offer.price,
        title: offer.title,
        _id: offer._id,
      });
    } else {
      // no user has been triuved
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
//---------------criar route pra declarar os limites de recherche----------------------------------
router.get("/offers/with-count", async (req, res) => {
  const page = Number(req.query.page);

  try {
    //procurar por titulo
    const filters = {};
    if (req.query.title) {
      filters.title = new RegExp(req.query.title, "i");
    }

    if (req.query.priceMin) {
      filters.price = { $gte: req.query.priceMin };
      if (req.query.priceMax) {
        if (!filters.price) {
          filters.price = {};
        }
        filters.price.$lte = req.query.priceMax;
      }
    }
    //trier par ordem crescente e decrescente
    let sort = {};
    if (req.query.sort === "date-desc") {
      sort = { date: "desc" };
    } else if (req.query.sort === "date-asc") {
      sort = { date: "asc" };
    } else if (req.query.sort === "price-asc") {
      sort = { price: "asc" };
    } else if (req.query.sort === "price-desc") {
      sort = { price: "desc" };
    }

    //contar o numero de resultados
    const count = await Offer.countDocuments(filters);
    //recuperar os anucios
    let offers;
    let page = Number(req.query.page);
    if (!page) {
      //forcer a afficher la premiere page
      page = 1;
    }

    offers = await Offer.find(filters)
      .select("title price created creator picture.secure_url description")
      .populate({
        path: "creator",
        select: "account.username account.phone",
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort);

    res.json({
      count: count,
      offers: offers,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  //----------------------------------Route pour ID--------------------------------------
  router.get("/offer/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const offers = await Offer.findOne({ _id: id }).populate({
        path: "creator",
        select: "account",
      });
      res.json(offers);
    } catch (error) {
      res.json({ message: error.message });
    }
  });
});
module.exports = router;
