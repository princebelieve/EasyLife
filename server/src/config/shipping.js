//server/src/config/shipping.js
const ShippingZone = require("../models/ShippingZone");

async function calculateShipping({
  city = "",
  state = "",
  shippingClass = "furniture",
}) {
  const normalizedState = state.toLowerCase().trim();

  const normalizedCity = city.toLowerCase().trim();

  const zone = await ShippingZone.findOne({
    state: normalizedState,
    active: true,
  });

  if (!zone) {
    return {
      shippingFee: 0,
      estimatedDays: "Not available",
    };
  }

  let shippingFee = zone.baseFee;

  const sameCity =
    zone.cities?.some((c) => c.toLowerCase().trim() === normalizedCity) ||
    false;

  if (sameCity && zone.sameCityFee > 0) {
    shippingFee = zone.sameCityFee;
  }

  const classFees = {
    light: zone.lightFee,
    medium: zone.mediumFee,
    heavy: zone.heavyFee,
    furniture: zone.furnitureFee,
    decor: zone.decorFee,
    installation: zone.installationFee,
    custom: zone.customProjectFee,
  };

  shippingFee += classFees[shippingClass] || 0;

  return {
    shippingFee,
    estimatedDays: zone.estimatedDays,
    pickupEnabled: zone.pickupEnabled,
    installationAvailable: zone.installationAvailable,
  };
}

module.exports = { calculateShipping };
