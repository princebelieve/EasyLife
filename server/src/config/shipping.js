//server/src/config/shipping.js
const ShippingZone = require("../models/ShippingZone");
const { normalizeDeliveryCategory } = require("../utils/category");

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
      shippingAvailable: false,
      message: "The selected city is not available. Please contact support.",
    };
  }

  const cityMatched =
    zone.cities?.some((c) => c.toLowerCase().trim() === normalizedCity) ||
    false;

  if (zone.cities?.length > 0 && !cityMatched) {
    return {
      shippingFee: 0,
      estimatedDays: "Not available",
      pickupEnabled: false,
      installationAvailable: false,
      shippingAvailable: false,
      message: "The selected city is not available. Please contact support.",
    };
  }

  const sameCity = cityMatched;
  const baseFee = sameCity ? zone.baseDeliveryFee * 0.5 : zone.baseDeliveryFee;

  let categoryFee = 0;

  for (const item of items) {
    const product =
      item.productId && typeof item.productId === "object"
        ? item.productId
        : undefined;

    const category = normalizeDeliveryCategory(
      product?.deliveryCategory ||
        item.deliveryCategory ||
        item.category ||
        "sofa",
    );

    const quantity = Number(item.quantity || 1);

    const categoryRule = (zone.categoryPricing || []).find(
      (rule) => normalizeDeliveryCategory(rule.category) === category,
    );

    const categoryPrice = Number(categoryRule?.price || 0);

    categoryFee += categoryPrice * quantity;
  }

  const shippingFee = baseFee + categoryFee;

  return {
    shippingFee,
    baseFee,
    categoryFee,
    estimatedDays: zone.estimatedDays,
    pickupEnabled: zone.pickupEnabled,
    installationAvailable: zone.installationAvailable,
    shippingAvailable: true,
  };
}

module.exports = {
  calculateShipping,
};
