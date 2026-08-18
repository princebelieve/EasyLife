//server/src/config/shipping.js
const ShippingZone = require("../models/ShippingZone");

// `state` remains the persisted field name for a safe migration from Newbrend.
// It now contains an ISO destination country code (for example NG or GB).
// Every active destination has one honest flat rate and delivery estimate.
async function calculateShipping({ country = "", items = [] }) {
  const destination = country.toUpperCase().trim();
  const zone = await ShippingZone.findOne({ state: destination, active: true });

  if (!zone) {
    return {
      shippingFee: 0,
      estimatedDays: "Not available",
      shippingAvailable: false,
      message: "Shipping is not yet available for this destination.",
    };
  }

  const hasDomesticOnlyItem = items.some((item) => {
    const product = item.productId && typeof item.productId === "object" ? item.productId : item;
    return product?.shipsInternationally === false && destination !== "NG";
  });

  if (hasDomesticOnlyItem) {
    return {
      shippingFee: 0,
      estimatedDays: "Not available",
      shippingAvailable: false,
      message: "One or more items in your cart are available only within Nigeria.",
    };
  }

  const shippingFee = Number(zone.baseDeliveryFee || 0);
  return {
    shippingFee,
    baseFee: shippingFee,
    categoryFee: 0,
    estimatedDays: zone.estimatedDays,
    serviceName: zone.serviceName,
    currency: zone.currency,
    dutiesAndTaxes: zone.dutiesAndTaxes,
    shippingAvailable: true,
  };
}

module.exports = { calculateShipping };
