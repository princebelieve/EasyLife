//server/src/config/shipping.js
const ShippingZone = require("../models/ShippingZone");

const SHIPPING_PRIORITY = {
  light: 1,
  medium: 2,
  decor: 3,
  heavy: 4,
  furniture: 5,
  installation: 6,
  custom: 7,
};

function getHighestShippingClass(items = []) {
  let highestClass = "light";

  for (const item of items) {
    const currentClass = item?.productId?.shippingClass || "furniture";

    if (SHIPPING_PRIORITY[currentClass] > SHIPPING_PRIORITY[highestClass]) {
      highestClass = currentClass;
    }
  }

  return highestClass;
}

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
      pickupEnabled: false,
      installationAvailable: false,
    };
  }

  const sameCity =
    zone.cities?.some((c) => c.toLowerCase().trim() === normalizedCity) ||
    false;

  const classFees = {
    light: zone.lightFee,
    medium: zone.mediumFee,
    heavy: zone.heavyFee,
    furniture: zone.furnitureFee,
    decor: zone.decorFee,
    installation: zone.installationFee,
    custom: zone.customProjectFee,
  };

  // SAME CITY REPLACES BASE FEE
  // OTHERWISE USE NORMAL BASE FEE
  const locationFee = sameCity ? zone.sameCityFee : zone.baseFee;

  const shippingFee = locationFee + (classFees[shippingClass] || 0);

  return {
    shippingFee,
    estimatedDays: zone.estimatedDays,
    pickupEnabled: zone.pickupEnabled,
    installationAvailable: zone.installationAvailable,
  };
}

module.exports = {
  calculateShipping,
  getHighestShippingClass,
};
