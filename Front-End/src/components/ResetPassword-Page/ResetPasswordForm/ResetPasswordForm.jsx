import styles from "./resetPasswordForm.module.css";
import BackLink from "../../General/BackLink/BackLink.jsx";
import PageIntro from "../../General/PageIntro/PageIntro.jsx";
import InputField from "../../General/InputField/InputField.jsx";
import GeneralBtn from "../../General/GeneralBtn/GeneralBtn.jsx";
import MessagePopup from "../../General/MessagePopup/MessagePopup.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  validatePasswordChange,
  validatePasswordBlur,
  checkResetPasswordValidation,
} from "./resetPasswordValidation.js";

function ResetPasswordForm() {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    password: "",
    verification: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    verification: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayMessagePopup, setDisplayMessagePopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  const isFormValid = checkResetPasswordValidation(
    passwords.password,
    passwords.verification,
  );

  async function resetPassword(password) {
    try {
      const response = await fetch("/api/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: "Couldn't connect to the server. Please try again.",
      };
    }
  }

  //updates input values
  function handleChange(field, value) {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => validatePasswordChange(field, value, passwords, prev));
  }

  //validates input when leaving the field
  function handleBlur(field, value) {
    setErrors((prev) => validatePasswordBlur(field, value, passwords, prev));
  }

  //submits new password
  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const data = await resetPassword(passwords.password);
      setDisplayMessagePopup({
        show: true,
        message: data.message || "Couldn't reset password",
        type: data.success ? "success" : "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  //hanldes popup closing
  function handlePopupClose() {
    if (displayMessagePopup.type === "success")
      navigate("/loginPage", { replace: true });
    else
      setDisplayMessagePopup({
        show: false,
        message: "",
        type: "",
      });
  }

  return (
    <div className={styles.resetPasswordForm}>
      <div className={styles.back}>
        <BackLink path="/recoveryPage" text="BACK" />
      </div>

      <PageIntro
        title="Reset your password."
        description="Choose a new password for your account."
      />

      <form onSubmit={handleSubmit} className={styles.form}>
        <InputField
          label="NEW PASSWORD"
          placeholder="Your new password"
          type="password"
          maxLength={12}
          error={errors.password}
          onChange={(e) => handleChange("password", e.target.value)}
          onBlur={(e) => handleBlur("password", e.target.value)}
        />

        <InputField
          label="CONFIRM PASSWORD"
          placeholder="Repeat your password"
          type="password"
          maxLength={12}
          error={errors.verification}
          onChange={(e) => handleChange("verification", e.target.value)}
          onBlur={(e) => handleBlur("verification", e.target.value)}
        />

        <div className={styles.savePassword}>
          <GeneralBtn
            text={isSubmitting ? "SAVING..." : "SAVE NEW PASSWORD"}
            disabled={!isFormValid || isSubmitting}
          />
        </div>
      </form>

      {displayMessagePopup.show && (
        <MessagePopup
          message={displayMessagePopup.message}
          type={displayMessagePopup.type}
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
}

export default ResetPasswordForm;
