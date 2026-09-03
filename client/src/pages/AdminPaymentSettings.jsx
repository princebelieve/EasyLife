import { useEffect, useState } from "react";
import useAuth from "../context/AuthContext";
import { getStorePaymentSettings, updateStorePaymentSettings } from "../services/api";

const initialSettings = { manualTransferEnabled: false, bankName: "", accountName: "", accountNumber: "", transferInstructions: "" };

export default function AdminPaymentSettings() {
  const { token } = useAuth(); const [settings, setSettings] = useState(initialSettings); const [message, setMessage] = useState("");
  useEffect(() => { getStorePaymentSettings(token).then((data) => setSettings({ ...initialSettings, ...data })).catch((error) => setMessage(error.message || "Unable to load payment settings.")); }, [token]);
  const change = (event) => { const { name, value, checked, type } = event.target; setSettings((current) => ({ ...current, [name]: type === "checkbox" ? checked : value })); };
  async function save(event) { event.preventDefault(); setMessage(""); try { setSettings(await updateStorePaymentSettings(settings, token)); setMessage("Main-store bank transfer settings saved."); } catch (error) { setMessage(error.message || "Unable to save payment settings."); } }
  return <div className="page"><h1>Store Payment Settings</h1><p className="muted">Enable direct bank transfer for main-store customers. Their orders stay pending until you verify payment.</p><form className="form" onSubmit={save}><label className="wizard-checkbox"><input type="checkbox" name="manualTransferEnabled" checked={settings.manualTransferEnabled} onChange={change} /><span>Enable manual bank transfer at main checkout</span></label><input required={settings.manualTransferEnabled} name="bankName" placeholder="Bank name" value={settings.bankName} onChange={change} /><input required={settings.manualTransferEnabled} name="accountName" placeholder="Account name" value={settings.accountName} onChange={change} /><input required={settings.manualTransferEnabled} inputMode="numeric" name="accountNumber" placeholder="Account number" value={settings.accountNumber} onChange={change} /><textarea name="transferInstructions" rows="4" placeholder="Optional instructions, e.g. use order number as transfer narration" value={settings.transferInstructions} onChange={change} /><button className="primary" type="submit">Save payment settings</button>{message && <p className="inline-toast success">{message}</p>}</form></div>;
}
