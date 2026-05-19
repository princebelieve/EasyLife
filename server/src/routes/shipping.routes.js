//server/src/routes/shipping.routes.js
const express = require("express");

const router = express.Router();

const { calculateShipping } = require("../config/shipping");

router.post("/preview", async (req, res) => {
  try {
    const { city, state, items } = req.body;

    const shippingData = await calculateShipping({
      city,
      state,
      items,
    });

    res.json(shippingData);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Unable to calculate shipping",
    });
  }
});

module.exports = router;
