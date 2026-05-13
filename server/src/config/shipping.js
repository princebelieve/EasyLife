//server/src/config/shipping.js
const ShippingZone = require("../models/ShippingZone");

async function calculateShipping({
  city = "",
  state = "",
  shippingClass = "furniture",
}) {
  const zone = await ShippingZone.findOne({
    state: state.toLowerCase(),
    active: true,
  });

  const baseFee = zone?.baseFee || 12000;

  const multiplier = {
    light: 1,
    medium: 1.3,
    heavy: 1.6,
    furniture: 2.5,
    decor: 1.8,
    installation: 3,
    custom: 4,
  };

  return Math.round(baseFee * (multiplier[shippingClass] || 2));
}

module.exports = { calculateShipping };
