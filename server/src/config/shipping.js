//server/src/config/shipping.js
const ShippingZone = require("../models/ShippingZone");

// `state` remains the persisted field name for backward-compatible data migration.
// It now contains an ISO destination country code (for example NG or GB).
// Every active destination has one honest flat rate and delivery estimate.
async function calculateShipping({ country = "", items = [] }) {
  const destination = country.toUpperCase().trim();
  const zone = await ShippingZone.findOne({ state: destination, active: true });

  if (!zone) {
    const shippingFee = Number(process.env.DEFAULT_SHIPPING_PRICE || 0);
    return {
      shippingFee,
      flatRate: shippingFee,
      estimatedDays: process.env.DEFAULT_DELIVERY_ESTIMATE || "3-7 business days",
      serviceName: "Standard delivery",
      currency: "NGN",
      dutiesAndTaxes: "customer",
      shippingAvailable: true,
    };
  }

  const shippingFee = Number(zone.baseDeliveryFee || 0);
  return {
    shippingFee,
    flatRate: shippingFee,
    estimatedDays: zone.estimatedDays,
    serviceName: zone.serviceName,
    currency: zone.currency,
    dutiesAndTaxes: zone.dutiesAndTaxes,
    shippingAvailable: true,
  };
}

module.exports = { calculateShipping };
