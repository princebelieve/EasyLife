//client/src/pages/AdminShipping.jsx
import { useEffect, useState } from "react";

import {
  getShippingZones,
  createShippingZone,
  updateShippingZone,
  deleteShippingZone,
} from "../services/api";

import { getToken } from "../utils/auth";

const emptyForm = {
  state: "",
  cities: "",
  baseFee: 0,
  sameCityFee: 0,
  lightFee: 0,
  mediumFee: 0,
  heavyFee: 0,
  furnitureFee: 0,
  decorFee: 0,
  installationFee: 0,
  customProjectFee: 0,
  estimatedDays: "3-7 days",
  pickupEnabled: true,
  installationAvailable: true,
  active: true,
};

export default function AdminShipping() {
  const [zones, setZones] = useState([]);

  const [openSection, setOpenSection] = useState("location");

  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState(emptyForm);

  async function loadZones() {
    const data = await getShippingZones(getToken());

    setZones(data);
  }

  useEffect(() => {
    loadZones();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...form,
      cities: form.cities
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    };

    if (editing) {
      await updateShippingZone(editing._id, payload, getToken());
    } else {
      await createShippingZone(payload, getToken());
    }

    setEditing(null);

    setForm(emptyForm);

    loadZones();
  }

  async function handleDelete(id) {
    const ok = window.confirm("Delete this shipping zone?");

    if (!ok) return;

    await deleteShippingZone(id, getToken());

    loadZones();
  }

  function handleEdit(zone) {
    setEditing(zone);

    setForm({
      ...zone,
      cities: zone.cities.join(", "),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="page">
      <h1>Shipping Zones</h1>

      <form onSubmit={handleSubmit} className="form">
        <h2>{editing ? "Edit Shipping Zone" : "Create Shipping Zone"}</h2>

        {/* LOCATION */}
        <div className="accordion">
          <button
            type="button"
            onClick={() =>
              setOpenSection(openSection === "location" ? "" : "location")
            }
          >
            📍 Location Settings
          </button>

          {openSection === "location" && (
            <div className="accordion-body">
              <input
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
              />

              <input
                name="cities"
                placeholder="Cities (comma separated)"
                value={form.cities}
                onChange={handleChange}
              />
            </div>
          )}
        </div>

        {/* PRICING */}
        <div className="accordion">
          <button
            type="button"
            onClick={() =>
              setOpenSection(openSection === "pricing" ? "" : "pricing")
            }
          >
            💰 Pricing Rules
          </button>

          {openSection === "pricing" && (
            <div className="accordion-body">
              <input
                type="number"
                name="baseFee"
                placeholder="Base Fee"
                value={form.baseFee}
                onChange={handleChange}
              />
              <input
                type="number"
                name="sameCityFee"
                placeholder="Same City Fee"
                value={form.sameCityFee}
                onChange={handleChange}
              />
              <input
                type="number"
                name="lightFee"
                placeholder="Light Fee"
                value={form.lightFee}
                onChange={handleChange}
              />
              <input
                type="number"
                name="mediumFee"
                placeholder="Medium Fee"
                value={form.mediumFee}
                onChange={handleChange}
              />
              <input
                type="number"
                name="heavyFee"
                placeholder="Heavy Fee"
                value={form.heavyFee}
                onChange={handleChange}
              />
              <input
                type="number"
                name="furnitureFee"
                placeholder="Furniture Fee"
                value={form.furnitureFee}
                onChange={handleChange}
              />
              <input
                type="number"
                name="decorFee"
                placeholder="Decor Fee"
                value={form.decorFee}
                onChange={handleChange}
              />
              <input
                type="number"
                name="installationFee"
                placeholder="Installation Fee"
                value={form.installationFee}
                onChange={handleChange}
              />
              <input
                type="number"
                name="customProjectFee"
                placeholder="Custom Project Fee"
                value={form.customProjectFee}
                onChange={handleChange}
              />
            </div>
          )}
        </div>

        {/* DELIVERY */}
        <div className="accordion">
          <button
            type="button"
            onClick={() =>
              setOpenSection(openSection === "delivery" ? "" : "delivery")
            }
          >
            🚚 Delivery Settings
          </button>

          {openSection === "delivery" && (
            <div className="accordion-body">
              <input
                name="estimatedDays"
                placeholder="Estimated Days"
                value={form.estimatedDays}
                onChange={handleChange}
              />

              <label>
                <input
                  type="checkbox"
                  name="pickupEnabled"
                  checked={form.pickupEnabled}
                  onChange={handleChange}
                />
                Pickup Enabled
              </label>

              <label>
                <input
                  type="checkbox"
                  name="installationAvailable"
                  checked={form.installationAvailable}
                  onChange={handleChange}
                />
                Installation Available
              </label>

              <label>
                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                />
                Active
              </label>
            </div>
          )}
        </div>

        <button type="submit">
          {editing ? "Update Shipping Zone" : "Create Shipping Zone"}
        </button>
      </form>

      <div
        style={{
          display: "grid",
          gap: 20,
          marginTop: 40,
        }}
      >
        {zones.map((zone) => (
          <div key={zone._id} className="order-card">
            <h3>{zone.state}</h3>

            <p>Cities: {zone.cities.join(", ")}</p>

            <p>Base Fee: ₦{Number(zone.baseFee).toLocaleString()}</p>

            <p>Estimated: {zone.estimatedDays}</p>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 10,
              }}
            >
              <button type="button" onClick={() => handleEdit(zone)}>
                Edit
              </button>

              <button
                type="button"
                className="btn-danger"
                onClick={() => handleDelete(zone._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
