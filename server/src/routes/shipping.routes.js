//server/src/routes/shipping.routes.js
const express = require("express");

const router = express.Router();

const { calculateShipping } = require("../config/shipping");

router.post("/preview", async (req, res) => {
  try {
    const { city, state, shippingClass } = req.body;

    const shippingFee = await calculateShipping({
      city,
      state,
      shippingClass,
    });

    res.json({
      shippingFee,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Unable to calculate shipping",
    });
  }
});

module.exports = router;
