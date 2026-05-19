//server/src/config/shipping.js
const ShippingZone = require("../models/ShippingZone");

async function calculateShipping({ city = "", state = "", items = [] }) {
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

  let shippingFee = sameCity
    ? zone.baseDeliveryFee * 0.5
    : zone.baseDeliveryFee;

  for (const item of items) {
    const product = item.productId;

    const category = product?.deliveryCategory || "sofa";

    const quantity = Number(item.quantity || 1);

    const categoryRule = (zone.categoryPricing || []).find(
      (rule) => rule.category === category,
    );

    const categoryPrice = Number(categoryRule?.price || 0);

    shippingFee += categoryPrice * quantity;
  }

  return {
    shippingFee,

    estimatedDays: zone.estimatedDays,

    pickupEnabled: zone.pickupEnabled,

    installationAvailable: zone.installationAvailable,
  };
}

module.exports = {
  calculateShipping,
};
