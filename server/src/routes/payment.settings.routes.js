const express = require("express");
const StorePaymentSettings = require("../models/StorePaymentSettings");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

async function getSettings() {
  return StorePaymentSettings.findOneAndUpdate(
    { key: "default" },
    { $setOnInsert: { key: "default" } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
}

router.get("/public", async (req, res) => {
  try {
    const settings = await getSettings();
    const enabled = settings.manualTransferEnabled && settings.bankName && settings.accountName && settings.accountNumber;
    res.json({
      manualTransferEnabled: Boolean(enabled),
      bankName: enabled ? settings.bankName : "",
      accountName: enabled ? settings.accountName : "",
      accountNumber: enabled ? settings.accountNumber : "",
      transferInstructions: enabled ? settings.transferInstructions : "",
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to load payment settings." });
  }
});

router.get("/admin", protect, adminOnly, async (req, res) => {
  try { res.json(await getSettings()); }
  catch { res.status(500).json({ message: "Unable to load payment settings." }); }
});

router.put("/admin", protect, adminOnly, async (req, res) => {
  try {
    const settings = {
      manualTransferEnabled: req.body.manualTransferEnabled === true,
      bankName: String(req.body.bankName || "").trim(),
      accountName: String(req.body.accountName || "").trim(),
      accountNumber: String(req.body.accountNumber || "").trim(),
      transferInstructions: String(req.body.transferInstructions || "").trim(),
    };
    if (settings.manualTransferEnabled && (!settings.bankName || !settings.accountName || !settings.accountNumber)) {
      return res.status(400).json({ message: "Bank name, account name, and account number are required when manual transfer is enabled." });
    }
    res.json(await StorePaymentSettings.findOneAndUpdate({ key: "default" }, { $set: settings, $setOnInsert: { key: "default" } }, { new: true, upsert: true, setDefaultsOnInsert: true }));
  } catch {
    res.status(500).json({ message: "Unable to save payment settings." });
  }
});

module.exports = router;
