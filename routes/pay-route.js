const express = require("express");
const router = express.Router();
const stripe = require("stripe")("sk_test_HVZg0oSYs3Napak9RymxmnQE00uSGKFYpp");

/* Votre clé privée doit être indiquée ici */
// const stripe = createStripe(process.env.STRIPE_API_SECRET);

// on réceptionne le token
router.post("/payment", async (req, res) => {
  try {
    // on envoie le token a Stripe avec le montant
    const { response } = await stripe.charges.create({
      amount: req.fields.amount,
      currency: "eur",
      description: `Paiement leboncoin pour : ${req.fields.title}`,
      source: req.fields.token,
    });

    console.log(req.fields);
    res.json({ response });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

module.exports = router;
