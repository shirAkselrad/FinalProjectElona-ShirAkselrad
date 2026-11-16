import styles from "./vatSettings.module.css";
import { useState, useEffect } from "react";
import InputField from "../../../General/InputField/InputField";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn";
import MessagePopup from "../../../General/MessagePopup/MessagePopup";

function VatSettings() {
  const [vatPercentage, setVatPercentage] = useState("");// the new vat percenatge 
  const [originalPercentage, setOriginalPercentage] = useState(null); //the original vat percentage 
  const [popup, setPopup] = useState(null);
  const [loading, setLoading] = useState(true);//while loading the vat from BE 
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    //getting the vat percentage from BE 
    const getVatSettings = async () => {
      try {
        const response = await fetch("/api/manager/vatSettings");

        if (!response.ok) {
          throw new Error("Couldn't get VAT settings");
        }

        const data = await response.json();

        if (!data.success || !data.settings) {
          throw new Error("Invalid VAT settings response");
        }

        const percentage = String(data.settings.vat_percentage);
        //setting it to be both original and new till it will get changed
        setVatPercentage(percentage);
        setOriginalPercentage(percentage);
      } catch (error) {
        console.error("Error getting VAT settings:", error);

        setPopup({
          type: "error",
          message: "Couldn't load VAT settings.",
        });
      } finally {
        //stop loading from BE 
        setLoading(false);
      }
    };

    getVatSettings();
  }, []);

  //getting the value 
  const percentage = Number(vatPercentage);

  //check if the value is valid 
  const isValid =
    vatPercentage.trim() !== "" &&
    Number.isFinite(percentage) &&
    percentage >= 0 &&
    percentage <= 100 &&
    Math.round(percentage * 100) / 100 === percentage;

    //checking if the original value has changed 
  const hasChanges =
    originalPercentage !== null && percentage !== Number(originalPercentage);

    //disabled only if still loading from BE/saving to BE/ value is not valid/ original value haven't changed 
  const isSaveDisabled = loading || saving || !isValid || !hasChanges;

  //error to be displayed in case there an error 
  const error =
    vatPercentage !== "" && !isValid
      ? "VAT percentage must be between 0 and 100, with up to 2 decimal places."
      : "";

  //saving to BE the new vat percentage value 
  const handleSave = async () => {
    if (isSaveDisabled) return;

    setSaving(true);

    try {
      const response = await fetch("/api/manager/updateVatSettings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vat_percentage: percentage,
        }),
      });

      if (!response.ok) {
        throw new Error("Couldn't update VAT settings");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error("Couldn't update VAT settings");
      }
      //setting the original percetange to be the new updated value 
      setOriginalPercentage(vatPercentage);

      setPopup({
        type: "success",
        message: "VAT settings updated successfully!",
      });
    } catch (error) {
      console.error("Error updating VAT settings:", error);

      setPopup({
        type: "error",
        message: "Couldn't update VAT settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>VAT Settings</h2>
        <p>Manage the value-added tax percentage for the store.</p>
      </div>

      <div className={styles.fields}>
        <div className={styles.vatInputWrapper}>
          <InputField
            label="VAT Percentage (%)"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={vatPercentage}
            error={error}
            disabled={loading || saving}
            onChange={(e) => setVatPercentage(e.target.value)}
            onFocus={(e) => e.target.select()}
          />

          <span className={styles.percentSymbol}>%</span>
        </div>
      </div>

      <div className={styles.vatNote}>
        <strong>Important Note:</strong> Changes to the VAT percentage will
        affect future orders only. Existing orders will retain their original
        VAT percentage.
      </div>

      <div className={styles.actions}>
        <GeneralBtn
          text="SAVE CHANGES"
          onClick={handleSave}
          disabled={isSaveDisabled}
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

export default VatSettings;
