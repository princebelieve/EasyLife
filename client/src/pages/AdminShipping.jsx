//client/src/pages/AdminShipping.jsx
import { useEffect, useState } from "react";

import {
  getShippingZones,
  createShippingZone,
  updateShippingZone,
  deleteShippingZone,
} from "../services/api";

import { getToken } from "../utils/auth";

import ngGeo from "../config/ng-geo.json";

// Generate state options from ng-geo.json, with values in lowercase for database matching
const NIGERIAN_STATES = Object.keys(ngGeo).map((stateName) => ({
  value: stateName.toLowerCase(),
  label:
    stateName === "FCT" ? "Federal Capital Territory" : `${stateName} State`,
}));

const emptyForm = {
  state: "",
  cities: "",

  baseFee: "",

  decorFee: "",

  chairFee: "",

  tableFee: "",

  sofaFee: "",

  bedFee: "",

  cabinetFee: "",

  tvConsoleFee: "",

  officeFurnitureFee: "",

  customProjectFee: "",

  estimatedDays: "3-7 days",

  pickupEnabled: true,

  installationAvailable: true,

  active: true,
};

export default function AdminShipping() {
  const [zones, setZones] = useState([]);

  const [openSection, setOpenSection] = useState("location");

  const [editing, setEditing] = useState(null);

  const [selectedCity, setSelectedCity] = useState("");

  const [availableCities, setAvailableCities] = useState([]);

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

    const nextValue = type === "checkbox" ? checked : value;

    setForm({
      ...form,
      [name]: nextValue,
    });

    if (name === "state") {
      const stateKey = Object.keys(ngGeo).find(
        (key) => key.toLowerCase() === value.toLowerCase(),
      );

      setAvailableCities(stateKey ? ngGeo[stateKey] : []);
      setSelectedCity("");
      setForm((prev) => ({
        ...prev,
        cities: "",
      }));
    }
  }

  function handleCitySelect(e) {
    const value = e.target.value;

    if (!value) {
      setSelectedCity("");
      return;
    }

    const currentCities = form.cities
      .split(",")
      .map((city) => city.trim())
      .filter(Boolean);

    if (!currentCities.includes(value)) {
      const nextCities = [...currentCities, value];
      setForm((prev) => ({
        ...prev,
        cities: nextCities.join(", ") + ", ",
      }));
    }

    setSelectedCity("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      state: form.state,

      cities: form.cities
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),

      baseDeliveryFee: Number(form.baseFee || 0),

      estimatedDays: form.estimatedDays,

      pickupEnabled: form.pickupEnabled,

      installationAvailable: form.installationAvailable,

      active: form.active,

      categoryPricing: [
        {
          category: "small-decor",
          price: Number(form.decorFee || 0),
        },

        {
          category: "chair",
          price: Number(form.chairFee || 0),
        },

        {
          category: "table",
          price: Number(form.tableFee || 0),
        },

        {
          category: "sofa",
          price: Number(form.sofaFee || 0),
        },

        {
          category: "bed",
          price: Number(form.bedFee || 0),
        },

        {
          category: "cabinet",
          price: Number(form.cabinetFee || 0),
        },

        {
          category: "tv-console",
          price: Number(form.tvConsoleFee || 0),
        },

        {
          category: "office-furniture",
          price: Number(form.officeFurnitureFee || 0),
        },

        {
          category: "custom-project",
          price: Number(form.customProjectFee || 0),
        },
      ],
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

    function getCategoryPrice(zone, category) {
      return (
        zone.categoryPricing?.find((item) => item.category === category)
          ?.price || 0
      );
    }

    setForm({
      state: zone.state || "",

      cities: zone.cities.join(", "),

      baseFee: zone.baseDeliveryFee || 0,

      chairFee: getCategoryPrice(zone, "chair"),

      tableFee: getCategoryPrice(zone, "table"),

      bedFee: getCategoryPrice(zone, "bed"),

      cabinetFee: getCategoryPrice(zone, "cabinet"),

      tvConsoleFee: getCategoryPrice(zone, "tv-console"),

      officeFurnitureFee: getCategoryPrice(zone, "office-furniture"),

      sofaFee: getCategoryPrice(zone, "sofa"),

      decorFee: getCategoryPrice(zone, "small-decor"),

      customProjectFee: getCategoryPrice(zone, "custom-project"),

      estimatedDays: zone.estimatedDays || "3-7 days",

      pickupEnabled: zone.pickupEnabled ?? true,

      installationAvailable: zone.installationAvailable ?? true,

      active: zone.active ?? true,
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
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                required
              >
                <option value="">Select a State</option>
                {NIGERIAN_STATES.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>

              <select
                name="city"
                value={selectedCity}
                onChange={handleCitySelect}
                disabled={!availableCities.length}
              >
                <option value="">
                  {availableCities.length
                    ? "Select a City to add"
                    : "Select a state first"}
                </option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <input
                name="cities"
                placeholder="Selected cities (comma separated)"
                value={form.cities}
                readOnly
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
            <div
              className="accordion-body"
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              }}
            >
              <input
                type="number"
                min="0"
                name="baseFee"
                placeholder="Base Fee"
                value={form.baseFee}
                onChange={handleChange}
              />

              <input
                type="number"
                min="0"
                name="chairFee"
                placeholder="Chair Delivery Fee"
                value={form.chairFee}
                onChange={handleChange}
              />

              <input
                type="number"
                name="tableFee"
                placeholder="Dining Table Delivery Fee"
                value={form.tableFee}
                onChange={handleChange}
              />

              <input
                type="number"
                name="sofaFee"
                placeholder="Sofa Delivery Fee"
                value={form.sofaFee}
                onChange={handleChange}
              />

              <input
                type="number"
                name="bedFee"
                placeholder="Bedroom Furniture Delivery Fee"
                value={form.bedFee}
                onChange={handleChange}
              />

              <input
                type="number"
                name="cabinetFee"
                placeholder="Cabinet Delivery Fee"
                value={form.cabinetFee}
                onChange={handleChange}
              />

              <input
                type="number"
                min="0"
                name="tvConsoleFee"
                placeholder="TV Console Delivery Fee"
                value={form.tvConsoleFee}
                onChange={handleChange}
              />

              <input
                type="number"
                min="0"
                name="officeFurnitureFee"
                placeholder="Office Furniture Delivery Fee"
                value={form.officeFurnitureFee}
                onChange={handleChange}
              />

              <input
                type="number"
                min="0"
                name="decorFee"
                placeholder="Decor Fee"
                value={form.decorFee}
                onChange={handleChange}
              />

              <input
                type="number"
                min="0"
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
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {zones.map((zone) => (
          <div key={zone._id} className="order-card">
            <h3>{zone.state}</h3>

            <p>Cities: {zone.cities.join(", ")}</p>

            <p>
              Base Fee: ₦{Number(zone.baseDeliveryFee || 0).toLocaleString()}
            </p>

            {zone.categoryPricing && zone.categoryPricing.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <strong>Category Fees</strong>
                <ul style={{ margin: 8, paddingLeft: 20 }}>
                  {zone.categoryPricing.map((item) => (
                    <li key={item.category}>
                      {item.category}: ₦
                      {Number(item.price || 0).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
