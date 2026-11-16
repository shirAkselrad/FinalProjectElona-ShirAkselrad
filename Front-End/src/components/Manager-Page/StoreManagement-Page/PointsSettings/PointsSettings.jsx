import styles from "./pointsSettings.module.css";
import { useState, useEffect } from "react";
import InputField from "../../../General/InputField/InputField";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn";
import MessagePopup from "../../../General/MessagePopup/MessagePopup";
import { validatePointsSettings } from "./pointsSettings";

function PointsSettings() {
  const [settings, setSettings] = useState({
    min_order_price: 0, //the min order price which needs to be paid for using the points
    earning_percentage: 0, //the amount of percentage the user can earn points
    max_redemption_percentage: 0, //the the percentage price the user can use the point
  });
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState(null);
  const [originalSettings, setOriginalSettings] = useState(null); //before changing

  useEffect(() => {
    //getting the points settings
    const getPointsSettings = async () => {
      try {
        const response = await fetch("/api/manager/pointsSettings", {
          method: "GET",
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log("Points settings response:", data);
        //getting the original settings
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

  //saving the updated settings
  const handleChange = (field, value) => {
    const updatedSettings = {
      ...settings,
      [field]: value,
    };
    setSettings(updatedSettings);
    //in case there are errors
    setErrors(validatePointsSettings(updatedSettings));
  };

  //saving the new updated points settings errors
  const handleSave = async () => {
    //in case there is any error
    const validationErrors = validatePointsSettings(settings);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      //updating a new points settings
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
        //changing the original settings to be the new ones
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

  //checkin if the form is valid 
  const isValid = Object.keys(validatePointsSettings(settings)).length === 0;

  //if there is no change in the original points settings the saving button stays disabled 
  const hasChanges =
    originalSettings !== null &&
    (Number(settings.min_order_price) !==
      Number(originalSettings.min_order_price) ||
      Number(settings.earning_percentage) !==
        Number(originalSettings.earning_percentage) ||
      Number(settings.max_redemption_percentage) !==
        Number(originalSettings.max_redemption_percentage));

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
        <p>Manage how customers earn and use loyalty points.</p>
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

        <InputField
          label="Maximum Points Redemption (%)"
          type="number"
          step="0.01"
          error={errors.max_redemption_percentage}
          value={settings.max_redemption_percentage}
          onFocus={(e) => e.target.select()}
          onChange={(e) =>
            handleChange("max_redemption_percentage", e.target.value)
          }
        />
      </div>
      <div className={styles.pointsNote}>
        <strong>Important Note:</strong> Earned loyalty points are always
        rounded up to the nearest whole number.
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
