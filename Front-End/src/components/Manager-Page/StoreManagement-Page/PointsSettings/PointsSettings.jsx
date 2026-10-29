import styles from "./pointsSettings.module.css";
import { useState, useEffect } from "react";
import InputField from "../../../General/InputField/InputField";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn";
import MessagePopup from "../../../General/MessagePopup/MessagePopup";
import { validatePointsSettings } from "./pointsSettings";

function PointsSettings() {
  const [settings, setSettings] = useState({
    min_order_price: 0,
    earning_percentage: 0,
  });
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    const getPointsSettings = async () => {
      try {
        const response = await fetch("/api/manager/pointsSettings", {
          method: "GET",
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.success && data.settings) setSettings(data.settings);
      } catch (error) {
        console.error("Error getting points settings: ", error);
        setPopup({
          type: "error",
          message: "Couldn't load points settings.",
        });
      }
    };
    getPointsSettings();
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
    const validationErrors = validatePointsSettings(settings);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      const response = await fetch("/api/manager/updatePointsSettings", {
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
          message: "Points settings updated successfully!",
        });
      else throw new Error("Couldn't update points settings");
    } catch (error) {
      console.error("Error updating points settings: ", error);
      setPopup({
        type: "error",
        message: "Couldn't update points settings.",
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Loyalty Points Settings</h2>
        <p>Manage loyalty points earning redemption requirements</p>
      </div>
      <div className={styles.fields}>
        <InputField
          label="Minimum Order Price For Points Redemption"
          type="number"
          step="0.01"
          error={errors.min_order_price}
          value={settings.min_order_price}
          onChange={(e) => handleChange("min_order_price", e.target.value)}
        />

        <InputField
          label="Points Earning Percentage (%)"
          type="number"
          step="0.01"
          error={errors.earning_percentage}
          value={settings.earning_percentage}
          onChange={(e) => handleChange("earning_percentage", e.target.value)}
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
export default PointsSettings;
