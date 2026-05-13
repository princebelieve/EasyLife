//server/src/scripts/seedShippingZones.js
require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("../config/db");

const ShippingZone = require("../models/ShippingZone");

const zones = [
  {
    state: "lagos",
    baseFee: 5000,
  },

  {
    state: "abuja",
    baseFee: 8000,
  },

  {
    state: "rivers",
    baseFee: 7000,
  },

  {
    state: "enugu",
    baseFee: 9000,
  },

  {
    state: "kaduna",
    baseFee: 10000,
  },
];

async function seed() {
  try {
    await connectDB();

    await ShippingZone.deleteMany();

    await ShippingZone.insertMany(zones);

    console.log("Shipping zones seeded");

    process.exit();
  } catch (err) {
    console.error(err);

    process.exit(1);
  }
}

seed();
