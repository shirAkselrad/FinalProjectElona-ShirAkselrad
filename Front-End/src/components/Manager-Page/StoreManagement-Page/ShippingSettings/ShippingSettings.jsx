import styles from "./shippingSettings.module.css";
import InputField from "../../../General/InputField/InputField.jsx";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn";
import { useState, useEffect } from "react";
import { validateShippingSettings } from "./shippingSettings.js";
import MessagePopup from "../../../General/MessagePopup/MessagePopup.jsx";
function ShippingSettings() {
  const [popup, setPopup] = useState(null);
  const [settings, setSettings] = useState({
    shipping_price: 0,
    min_delivery_days: 0,
    max_delivery_days: 0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const getShippingSettings = async () => {
      try {
        const response = await fetch("/api/manager/shippingSettings", {
          method: "GET",
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (data.success && data.settings) setSettings(data.settings);
      } catch (error) {
        console.error("Error getting shipping settings: ", error);
        setPopup({
          type: "error",
          message: "Couldn't get shipping settings.",
        });
      }
    };
    getShippingSettings();
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleSave = async () => {
    const validationErrors = validateShippingSettings(settings);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      const response = await fetch("/api/manager/updateShippingSettings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success)
        setPopup({
          type: "success",
          message: "Shipping settings updated successfully!",
        });
    } catch (error) {
      console.error("Error updating shipping settings: ", error);
      setPopup({
        type: "error",
        message: "Couldn't update shipping settings.",
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Shipping Settings</h2>
        <p>Manage shipping fees and estimated delivery times.</p>
      </div>
      <div className={styles.fields}>
        <InputField
          label="Shipping Price"
          type="number"
          step="0.01"
          error={errors.shipping_price}
          value={settings.shipping_price}
          onChange={(e) => handleChange("shipping_price", e.target.value)}
        />

        <InputField
          label="Minimum Delivery Days"
          type="number"
          step="1"
          error={errors.min_delivery_days}
          value={settings.min_delivery_days}
          onChange={(e) => handleChange("min_delivery_days", e.target.value)}
        />

        <InputField
          label="Maximum Delivery Days"
          type="number"
          step="1"
          error={errors.max_delivery_days}
          value={settings.max_delivery_days}
          onChange={(e) => handleChange("max_delivery_days", e.target.value)}
        />
      </div>
      <div className={styles.actions}>
        <GeneralBtn text="SAVE CHANGES" onClick={handleSave} />
      </div>

      {popup && (
        <MessagePopup
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup(null)}
          autoClose={popup.type === "success"}
        />
      )}
    </div>
  );
}
export default ShippingSettings;
