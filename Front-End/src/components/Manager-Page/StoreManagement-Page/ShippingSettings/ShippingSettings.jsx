import styles from "./shippingSettings.module.css";
import InputField from "../../../General/InputField/InputField.jsx";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn";
import { useState, useEffect } from "react";
import { validateShippingSettings } from "./shippingSettings.js";
import MessagePopup from "../../../General/MessagePopup/MessagePopup.jsx";
function ShippingSettings() {
  const [popup, setPopup] = useState(null);
  //all the shipping settings- starts empty 
  const [settings, setSettings] = useState({
    shipping_price: "",
    min_delivery_days: "",
    max_delivery_days: "",
  });
  //orginal settings which are given from the BE 
  const [originalSettings, setOriginalSettings] = useState(null);

  useEffect(() => {
    //getting all shipping settings 
    const getShippingSettings = async () => {
      try {
        const response = await fetch("/api/manager/shippingSettings", {
          method: "GET",
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        //setting in the original shipping settings state variable 
        if (data.success && data.settings) {
          setSettings(data.settings);
          setOriginalSettings({ ...data.settings });
        }
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


  //in case one of the fields gets change 
  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  //saving the new updated shipping settings 
  const handleSave = async () => {
    if (!isFormValid || !hasChanges) return;
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
      //now the original settings are the new updated settings 
      if (data.success) {
        setOriginalSettings({ ...settings });
        setPopup({
          type: "success",
          message: "Shipping settings updated successfully!",
        });
      }
    } catch (error) {
      console.error("Error updating shipping settings: ", error);
      setPopup({
        type: "error",
        message: "Couldn't update shipping settings.",
      });
    }
  };

  //no errors 
  const validationErrors =
    originalSettings !== null ? validateShippingSettings(settings) : {};
  const isFormValid =
    originalSettings !== null && Object.keys(validationErrors).length === 0;
  const hasChanges =
    originalSettings !== null &&
    Object.keys(settings).some(
      (key) => Number(settings[key]) !== Number(originalSettings[key]),
    );
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
          error={validationErrors.shipping_price}
          value={settings.shipping_price}
          onFocus={(e) => e.target.select()}
          onChange={(e) => handleChange("shipping_price", e.target.value)}
          suffix="₪"
        />

        <InputField
          label="Minimum Delivery Days"
          type="number"
          step="1"
          error={validationErrors.min_delivery_days}
          value={settings.min_delivery_days}
          onFocus={(e) => e.target.select()}
          onChange={(e) => handleChange("min_delivery_days", e.target.value)}
        />

        <InputField
          label="Maximum Delivery Days"
          type="number"
          step="1"
          error={validationErrors.max_delivery_days}
          value={settings.max_delivery_days}
          onFocus={(e) => e.target.select()}
          onChange={(e) => handleChange("max_delivery_days", e.target.value)}
        />
      </div>
      <div className={styles.actions}>
        <GeneralBtn
          text="SAVE CHANGES"
          onClick={handleSave}
          disabled={!isFormValid || !hasChanges}
        />
      </div>

      {popup && (
        <MessagePopup
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup(null)}
          autoClose={false}
        />
      )}
    </div>
  );
}
export default ShippingSettings;
