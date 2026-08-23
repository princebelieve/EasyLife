//server/src/config/shipping.js
const ShippingZone = require("../models/ShippingZone");
const ShippingSettings = require("../models/ShippingSettings");

// `state` remains the persisted field name for backward-compatible data migration.
// It now contains an ISO destination country code (for example NG or GB).
// Every active destination has one honest flat rate and delivery estimate.
async function calculateShipping({ country = "", items = [] }) {
  const destination = country.toUpperCase().trim();
  const zone = await ShippingZone.findOne({ state: destination, active: true });

  if (!zone) {
    const settings = await ShippingSettings.findOneAndUpdate(
      { key: "default" },
      { $setOnInsert: { key: "default" } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    const shippingFee = Number(settings.defaultShippingPrice || 0);
    return {
      shippingFee,
      flatRate: shippingFee,
      estimatedDays: settings.defaultDeliveryEstimate,
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
