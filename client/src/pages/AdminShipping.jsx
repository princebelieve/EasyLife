import { useEffect, useState } from "react";
import {
  createShippingZone,
  deleteShippingZone,
  getShippingSettings,
  getShippingZones,
  updateShippingSettings,
  updateShippingZone,
} from "../services/api";
import useAuth from "../context/AuthContext";

const blank = {
  state: "NG", baseDeliveryFee: 0, serviceName: "Standard Delivery",
  handlingTimeMinDays: 1, handlingTimeMaxDays: 2, transitTimeMinDays: 2,
  transitTimeMaxDays: 7, estimatedDays: "3-9 business days",
  dutiesAndTaxes: "customer", active: true,
};

export default function AdminShipping() {
  const { token } = useAuth();
  const [zones, setZones] = useState([]);
  const [form, setForm] = useState(blank);
  const [defaults, setDefaults] = useState({ defaultShippingPrice: 0, defaultDeliveryEstimate: "3-7 business days" });
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const [loadedZones, loadedSettings] = await Promise.all([getShippingZones(token), getShippingSettings(token)]);
      setZones(loadedZones);
      setDefaults({ defaultShippingPrice: loadedSettings.defaultShippingPrice ?? 0, defaultDeliveryEstimate: loadedSettings.defaultDeliveryEstimate ?? "3-7 business days" });
    } catch {
      setMessage("Unable to load shipping settings.");
    }
  };

  useEffect(() => { if (token) load(); }, [token]);

  const change = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  async function saveDefaults(event) {
    event.preventDefault();
    setMessage("");
    try {
      const saved = await updateShippingSettings({ defaultShippingPrice: Number(defaults.defaultShippingPrice), defaultDeliveryEstimate: defaults.defaultDeliveryEstimate }, token);
      setDefaults({ defaultShippingPrice: saved.defaultShippingPrice, defaultDeliveryEstimate: saved.defaultDeliveryEstimate });
      setMessage("Default shipping settings saved.");
    } catch (error) {
      setMessage(error.message || "Default shipping settings could not be saved.");
    }
  }

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    try {
      const payload = {
        ...form, state: form.state.toUpperCase(), currency: "NGN",
        baseDeliveryFee: Number(form.baseDeliveryFee),
        handlingTimeMinDays: Number(form.handlingTimeMinDays), handlingTimeMaxDays: Number(form.handlingTimeMaxDays),
        transitTimeMinDays: Number(form.transitTimeMinDays), transitTimeMaxDays: Number(form.transitTimeMaxDays),
        cities: [], categoryPricing: [],
      };
      if (editing) await updateShippingZone(editing, payload, token);
      else await createShippingZone(payload, token);
      setForm(blank); setEditing(null); setMessage("Shipping policy saved."); load();
    } catch (error) {
      setMessage(error.message || "Shipping policy could not be saved.");
    }
  }

  return <div className="page">
    <h1>Shipping Policies</h1>
    <p className="muted">Checkout and product prices are charged in NGN. These same NGN rates are sent to Google Merchant Center.</p>

    <form className="form" onSubmit={saveDefaults}>
      <h2>Default shipping</h2>
      <p className="muted">Used when a customer selects a country without an active country policy.</p>
      <div className="wizard-grid">
        <input required type="number" min="0" name="defaultShippingPrice" placeholder="Default shipping price (NGN)" value={defaults.defaultShippingPrice} onChange={(event) => setDefaults((current) => ({ ...current, defaultShippingPrice: event.target.value }))} />
        <input required name="defaultDeliveryEstimate" placeholder="Default delivery estimate" value={defaults.defaultDeliveryEstimate} onChange={(event) => setDefaults((current) => ({ ...current, defaultDeliveryEstimate: event.target.value }))} />
      </div>
      <button type="submit">Save default shipping</button>
    </form>

    <form className="form" onSubmit={submit} style={{ marginTop: 32 }}>
      <h2>Country-specific shipping</h2>
      <p className="muted">Add one active flat rate per destination country using ISO codes, such as NG, GH, GB, or US.</p>
      <div className="wizard-grid">
        <input required name="state" maxLength="2" placeholder="Country code" value={form.state} onChange={change} />
        <input required type="number" min="0" name="baseDeliveryFee" placeholder="Flat shipping fee (NGN)" value={form.baseDeliveryFee} onChange={change} />
        <input required name="serviceName" placeholder="Service name" value={form.serviceName} onChange={change} />
      </div>
      <div className="wizard-grid">
        <input type="number" min="0" name="handlingTimeMinDays" placeholder="Min handling days" value={form.handlingTimeMinDays} onChange={change} />
        <input type="number" min="0" name="handlingTimeMaxDays" placeholder="Max handling days" value={form.handlingTimeMaxDays} onChange={change} />
        <input type="number" min="0" name="transitTimeMinDays" placeholder="Min transit days" value={form.transitTimeMinDays} onChange={change} />
        <input type="number" min="0" name="transitTimeMaxDays" placeholder="Max transit days" value={form.transitTimeMaxDays} onChange={change} />
      </div>
      <input name="estimatedDays" placeholder="Customer-facing delivery estimate" value={form.estimatedDays} onChange={change} />
      <select name="dutiesAndTaxes" value={form.dutiesAndTaxes} onChange={change}><option value="customer">Customer pays import duties/taxes</option><option value="included">Duties/taxes included</option></select>
      <label><input type="checkbox" name="active" checked={form.active} onChange={change} /> Active</label>
      <button type="submit">{editing ? "Update policy" : "Add policy"}</button>
      {editing && <button type="button" onClick={() => { setForm(blank); setEditing(null); }}>Cancel</button>}
    </form>

    {message && <p>{message}</p>}
    <div className="grid" style={{ marginTop: 32 }}>{zones.map((zone) => <article className="card" key={zone._id}>
      <h3>{zone.state} · {zone.serviceName}</h3>
      <p>₦{Number(zone.baseDeliveryFee).toLocaleString()}</p>
      <p>{zone.handlingTimeMinDays}-{zone.handlingTimeMaxDays} handling days · {zone.transitTimeMinDays}-{zone.transitTimeMaxDays} transit days</p>
      <p>{zone.dutiesAndTaxes === "included" ? "Duties/taxes included" : "Customer pays import duties/taxes"}</p>
      <button onClick={() => { setEditing(zone._id); setForm({ ...blank, ...zone }); }}>Edit</button>
      <button className="btn-danger" onClick={async () => { await deleteShippingZone(zone._id, token); load(); }}>Delete</button>
    </article>)}</div>
  </div>;
}
