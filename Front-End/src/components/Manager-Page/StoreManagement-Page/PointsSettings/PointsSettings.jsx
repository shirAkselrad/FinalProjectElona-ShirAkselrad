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
  const [originalSettings, setOriginalSettings] = useState(null);

  useEffect(() => {
    const getPointsSettings = async () => {
      try {
        const response = await fetch("/api/manager/pointsSettings", {
          method: "GET",
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log("Points settings response:", data);
        if (data.success && data.settings) {
          setSettings(data.settings);
          setOriginalSettings(data.settings);
        }
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
    const updatedSettings = {
      ...settings,
      [field]: value,
    };
    setSettings(updatedSettings);
    setErrors(validatePointsSettings(updatedSettings));
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
      if (data.success) {
        setOriginalSettings({ ...settings });
        setPopup({
          type: "success",
          message: "Points settings updated successfully!",
        });
      } else throw new Error("Couldn't update points settings");
    } catch (error) {
      console.error("Error updating points settings: ", error);
      setPopup({
        type: "error",
        message: "Couldn't update points settings.",
      });
    }
  };

  const isValid = Object.keys(validatePointsSettings(settings)).length === 0;
  const hasChanges =
    originalSettings !== null &&
    (Number(settings.min_order_price) !==
      Number(originalSettings.min_order_price) ||
      Number(settings.earning_percentage) !==
        Number(originalSettings.earning_percentage));

  const isSavedDisabled = !isValid || !hasChanges;

  console.log({
    settings,
    originalSettings,
    isValid,
    hasChanges,
    isSavedDisabled,
    validationErrors: validatePointsSettings(settings),
  });
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
          onFocus={(e) => e.target.select()}
        />

        <InputField
          label="Points Earning Percentage (%)"
          type="number"
          step="0.01"
          error={errors.earning_percentage}
          value={settings.earning_percentage}
          onFocus={(e) => e.target.select()}
          onChange={(e) => handleChange("earning_percentage", e.target.value)}
        />
      </div>
      <div className={styles.actions}>
        <GeneralBtn
          text="SAVE CHANGES"
          onClick={handleSave}
          disabled={isSavedDisabled}
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
export default PointsSettings;
