//client/src/pages/AdminShipping.jsx
import { useEffect, useState } from "react";

import {
  getShippingZones,
  createShippingZone,
  updateShippingZone,
  deleteShippingZone,
  getProductCategories,
} from "../services/api";

import { getToken } from "../utils/auth";

import ngGeo from "../config/ng-geo.json";

// Generate state options from ng-geo.json, with values in lowercase for database matching
const NIGERIAN_STATES = Object.keys(ngGeo).map((stateName) => ({
  value: stateName.toLowerCase(),
  label:
    stateName === "FCT" ? "Federal Capital Territory" : `${stateName} State`,
}));

const SHIPPING_CATEGORY_LABELS = {
  sofa: "Sofa Set",
  table: "Dining Set",
  chair: "Single Chair Replacement",
  bed: "Bedroom Furniture",
  cabinet: "Kitchen Cabinet",
  "tv-console": "TV Console",
  "office-furniture": "Office Furniture",
  "small-decor": "Curtains & Bedsheets / Lighting & Fittings",
  "custom-project": "Wall Panel / Interior Design / Custom Project",
};

const SHIPPING_CATEGORY_OPTIONS = Object.keys(SHIPPING_CATEGORY_LABELS);
const SHIPPING_CATEGORY_SUGGESTIONS = [
  ...Object.keys(SHIPPING_CATEGORY_LABELS),
  ...Object.values(SHIPPING_CATEGORY_LABELS),
];

const emptyForm = {
  state: "",
  cities: "",

  baseFee: "",

  categoryPricing: [{ category: "", price: "" }],

  estimatedDays: "3-7 days",
  orderCutoffTime: "",
  handlingTimeMinDays: 0,
  handlingTimeMaxDays: 0,
  transitTimeMinDays: 0,
  transitTimeMaxDays: 1,
  fulfillmentDays: "Mon – Sat",

  pickupEnabled: true,

  installationAvailable: true,

  active: true,
};

export default function AdminShipping() {
  const [zones, setZones] = useState([]);

  const [openSection, setOpenSection] = useState("location");

  const [editing, setEditing] = useState(null);

  const [productCategories, setProductCategories] = useState([]);

  const [selectedCity, setSelectedCity] = useState("");

  const [selectedCities, setSelectedCities] = useState([]);

  const [availableCities, setAvailableCities] = useState([]);

  const [form, setForm] = useState(emptyForm);

  // Normalize categories returned from the API (objects or strings) into human labels
  const productCategoryLabels = (productCategories || [])
    .filter(Boolean)
    .map((c) =>
      typeof c === "string"
        ? c
        : c.label || c.sampleCategory || c.deliveryCategory || "",
    )
    .filter(Boolean);

  const categorySuggestions = Array.from(
    new Set([...SHIPPING_CATEGORY_SUGGESTIONS, ...productCategoryLabels]),
  );

  async function loadZones() {
    const data = await getShippingZones(getToken());

    setZones(data);
  }

  async function loadProductCategories() {
    try {
      const categories = await getProductCategories();

      setProductCategories(Array.isArray(categories) ? categories : []);
    } catch (error) {
      console.error("Unable to load product categories:", error);
      setProductCategories([]);
    }
  }

  useEffect(() => {
    loadZones();
    loadProductCategories();

    const handler = () => loadProductCategories();

    window.addEventListener("products:changed", handler);

    return () => window.removeEventListener("products:changed", handler);
  }, []);

  useEffect(() => {
    // auto-populate categoryPricing with suggestions when creating a new zone
    if (!editing) {
      const pricing = Array.isArray(form.categoryPricing)
        ? form.categoryPricing
        : [{ category: "", price: "" }];
      if (
        categorySuggestions.length &&
        pricing.length === 1 &&
        !pricing[0].category
      ) {
        setForm((prev) => ({
          ...prev,
          categoryPricing: categorySuggestions.map((c) => ({
            category: c,
            price: "",
          })),
        }));
      }
    }
  }, [categorySuggestions, editing, form.categoryPricing]);

  useEffect(() => {
    // refresh categories when the pricing accordion is opened
    if (openSection === "pricing") {
      loadProductCategories();
    }
  }, [openSection]);

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
      setSelectedCities([]);
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

    if (!selectedCities.includes(value)) {
      const nextCities = [...selectedCities, value];
      setSelectedCities(nextCities);
      setForm((prev) => ({
        ...prev,
        cities: nextCities.join(", ") + ", ",
      }));
    }

    setSelectedCity("");
  }

  function removeSelectedCity(cityToRemove) {
    const nextCities = selectedCities.filter((city) => city !== cityToRemove);
    setSelectedCities(nextCities);
    setForm((prev) => ({
      ...prev,
      cities: nextCities.length ? nextCities.join(", ") + ", " : "",
    }));
  }

  function handleCategoryPricingChange(index, field, value) {
    const currentPricing = Array.isArray(form.categoryPricing)
      ? form.categoryPricing
      : [{ category: "", price: "" }];

    const nextPricing = [...currentPricing];
    nextPricing[index] = {
      ...nextPricing[index],
      [field]: value,
    };
    setForm({
      ...form,
      categoryPricing: nextPricing,
    });
  }

  function addCategoryPricingRule() {
    setForm((prev) => ({
      ...prev,
      categoryPricing: [...prev.categoryPricing, { category: "", price: "" }],
    }));
  }

  function removeCategoryPricingRule(indexToRemove) {
    setForm((prev) => ({
      ...prev,
      categoryPricing: prev.categoryPricing.filter(
        (_item, index) => index !== indexToRemove,
      ),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      state: form.state,

      cities:
        selectedCities.length > 0
          ? selectedCities
          : form.cities
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean),

      baseDeliveryFee: Number(form.baseFee || 0),

      estimatedDays: form.estimatedDays,
      orderCutoffTime: form.orderCutoffTime,
      handlingTimeMinDays: Number(form.handlingTimeMinDays || 0),
      handlingTimeMaxDays: Number(form.handlingTimeMaxDays || 0),
      transitTimeMinDays: Number(form.transitTimeMinDays || 0),
      transitTimeMaxDays: Number(form.transitTimeMaxDays || 1),
      fulfillmentDays: form.fulfillmentDays,

      pickupEnabled: form.pickupEnabled,

      installationAvailable: form.installationAvailable,

      active: form.active,

      categoryPricing: (form.categoryPricing || [])
        .filter((item) => item.category?.trim())
        .map((item) => ({
          category: item.category.trim(),
          price: Number(item.price || 0),
        })),
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
      state: zone.state || "",

      cities: zone.cities.length > 0 ? zone.cities.join(", ") + ", " : "",

      baseFee: zone.baseDeliveryFee || 0,

      categoryPricing:
        zone.categoryPricing?.length > 0
          ? zone.categoryPricing.map((item) => ({
              category: item.category || "",
              price: item.price || 0,
            }))
          : [{ category: "", price: "" }],

      estimatedDays: zone.estimatedDays || "3-7 days",
      orderCutoffTime: zone.orderCutoffTime || "",
      handlingTimeMinDays: zone.handlingTimeMinDays ?? 0,
      handlingTimeMaxDays: zone.handlingTimeMaxDays ?? 0,
      transitTimeMinDays: zone.transitTimeMinDays ?? 0,
      transitTimeMaxDays: zone.transitTimeMaxDays ?? 1,
      fulfillmentDays: zone.fulfillmentDays || "Mon – Sat",

      pickupEnabled: zone.pickupEnabled ?? true,

      installationAvailable: zone.installationAvailable ?? true,

      active: zone.active ?? true,
    });

    setSelectedCities(zone.cities || []);

    const stateKey = Object.keys(ngGeo).find(
      (key) => key.toLowerCase() === (zone.state || "").toLowerCase(),
    );
    setAvailableCities(stateKey ? ngGeo[stateKey] : []);

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

              <div
                className="selected-cities-list"
                style={{ margin: "12px 0" }}
              >
                {selectedCities.length > 0 ? (
                  selectedCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      className="city-chip"
                      onClick={() => removeSelectedCity(city)}
                      style={{
                        margin: "4px 6px 4px 0",
                        padding: "8px 12px",
                        borderRadius: 9999,
                        border: "1px solid #d7dce2",
                        background: "#f8fafc",
                        color: "#111",
                        cursor: "pointer",
                      }}
                    >
                      {city} ×
                    </button>
                  ))
                ) : (
                  <p className="muted">Selected cities will appear here.</p>
                )}
              </div>

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
            <div className="accordion-body">
              <div className="pricing-input-grid">
                <input
                  type="number"
                  min="0"
                  name="baseFee"
                  placeholder="Base Fee"
                  value={form.baseFee}
                  onChange={handleChange}
                />
              </div>

              <div className="pricing-section">
                <strong>Category fees</strong>
                <p style={{ margin: "8px 0 12px", color: "#555" }}>
                  Add a delivery category slug or label and fee. You can type a
                  new category here or choose an existing one from the
                  suggestions.
                </p>

                {form.categoryPricing.map((item, index) => (
                  <div key={index} className="pricing-rule-row">
                    <input
                      value={item.category}
                      list="shipping-category-suggestions"
                      placeholder="Category slug or label (e.g. sofa / Sofa Set)"
                      onChange={(e) =>
                        handleCategoryPricingChange(
                          index,
                          "category",
                          e.target.value,
                        )
                      }
                    />
                    <input
                      type="number"
                      min="0"
                      value={item.price}
                      placeholder="Price"
                      onChange={(e) =>
                        handleCategoryPricingChange(
                          index,
                          "price",
                          e.target.value,
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeCategoryPricingRule(index)}
                      className="pricing-remove-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}

                <datalist id="shipping-category-suggestions">
                  {SHIPPING_CATEGORY_SUGGESTIONS.map((category) => (
                    <option key={category} value={category} />
                  ))}
                  {productCategoryLabels.map((category) => (
                    <option key={`product-${category}`} value={category} />
                  ))}
                </datalist>

                {productCategoryLabels.length > 0 && (
                  <div
                    style={{
                      marginTop: 16,
                      fontSize: "0.94rem",
                      color: "#444",
                    }}
                  >
                    <strong>Existing product categories</strong>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                        marginTop: 8,
                      }}
                    >
                      {productCategoryLabels.map((category) => (
                        <span
                          key={category}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 9999,
                            background: "#f3f4f6",
                            border: "1px solid #d1d5db",
                          }}
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={addCategoryPricingRule}
                  style={{
                    marginTop: 8,
                    padding: "10px 16px",
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Add category fee
                </button>
              </div>
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
              <div className="shipping-timing-grid">
                <input
                  name="orderCutoffTime"
                  placeholder="Order cutoff time (e.g. 2:00 PM)"
                  value={form.orderCutoffTime}
                  onChange={handleChange}
                />
                <input
                  name="fulfillmentDays"
                  placeholder="Fulfillment days (e.g. Mon – Sat)"
                  value={form.fulfillmentDays}
                  onChange={handleChange}
                />
              </div>

              <div className="shipping-timing-grid">
                <input
                  type="number"
                  min="0"
                  name="handlingTimeMinDays"
                  placeholder="Handling min days"
                  value={form.handlingTimeMinDays}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  min="0"
                  name="handlingTimeMaxDays"
                  placeholder="Handling max days"
                  value={form.handlingTimeMaxDays}
                  onChange={handleChange}
                />
              </div>

              <div className="shipping-timing-grid">
                <input
                  type="number"
                  min="0"
                  name="transitTimeMinDays"
                  placeholder="Transit min days"
                  value={form.transitTimeMinDays}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  min="0"
                  name="transitTimeMaxDays"
                  placeholder="Transit max days"
                  value={form.transitTimeMaxDays}
                  onChange={handleChange}
                />
              </div>

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
                      {SHIPPING_CATEGORY_LABELS[item.category] || item.category}
                      : ₦{Number(item.price || 0).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p>Cutoff: {zone.orderCutoffTime || "—"}</p>
            <p>Fulfillment: {zone.fulfillmentDays}</p>
            <p>
              Handling: {zone.handlingTimeMinDays}-{zone.handlingTimeMaxDays}{" "}
              days
            </p>
            <p>
              Transit: {zone.transitTimeMinDays}-{zone.transitTimeMaxDays} days
            </p>
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
