import styles from "./forgotPasswordForm.module.css";
import BackLink from "../../General/BackLink/BackLink.jsx";
import PageIntro from "../../General/PageIntro/PageIntro.jsx";
import InputField from "../../General/InputField/InputField.jsx";
import GeneralBtn from "../../General/GeneralBtn/GeneralBtn.jsx";
import { useNavigate } from "react-router-dom";
import MessagePopup from "../../General/MessagePopup/MessagePopup.jsx";
import { useState } from "react";
import { validateForgotPasswordEmail } from "./forgotPasswordValidation.js";

function ForgotPasswordForm() {
  //let us switching between pages
  const navigate = useNavigate();

  //user email & email error (if needs)
  const [userEmail, setUserEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  //while the form is sent, changing the look of the sending button
  const [isSubmitting, setIsSubmitting] = useState(false);

  //This state is for the popup message after an attempt to login
  const [displayMessagePopup, setDisplayMessagePopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  //checks if user's email is valid
  const isFormValid = validateForgotPasswordEmail(userEmail) === "";

  //The function send the email string to back end to check if exits
  async function accountRecovery(userEmail) {
    try {
      const response = await fetch("/api/forgotPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
        }),
      });
      return await response.json();
    } catch (error) {
      console.error("The error is: ", error);
      return {
        success: false,
        message: "Server error",
      };
    }
  }

  //updates email input
  function handleChange(value) {
    setUserEmail(value);
    setEmailError("");
  }

  //validates the email when leaving the field
  function handleBlur(value) {
    const error = validateForgotPasswordEmail(value);
    setEmailError(error);
  }


  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;
    const validationError = validateForgotPasswordEmail(userEmail);
    //if there is an error, the form cannot be send 
    if (validationError) {
      setEmailError(validationError);
      return;
    }
    //now the form is submmited 
    setIsSubmitting(true);
    try {
      //sending the user a recovery code 
      const data = await accountRecovery(userEmail.trim());
      setDisplayMessagePopup({
        show: true,
        message: data.message || "Couldn't send recovery code",
        type: data.success ? "success" : "error",
      });
    } finally {
      //ending the submmiting 
      setIsSubmitting(false);
    }
  }

  // Handles popup closing
  function handlePopupClose() {
    if (displayMessagePopup.type === "success") {
      navigate("/recoveryPage");
    } else {
      setDisplayMessagePopup({
        show: false,
        message: "",
        type: "",
      });
    }
  }

  return (
    <div className={styles.forgotPasswordForm}>
      <div className={styles.back}>
        <BackLink path="/loginPage" text="BACK TO LOGIN" />
      </div>

      <PageIntro
        title="Forgot your password?"
        description="Enter your email address and we'll send you a verification code."
      />

      <form onSubmit={handleSubmit} className={styles.form}>
        <InputField
          label="EMAIL ADDRESS"
          placeholder="your@email.com"
          type="email"
          value={userEmail}
          error={emailError}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={(e) => handleBlur(e.target.value)}
        />

        <div className={styles.sendCode}>
          <GeneralBtn
            text={isSubmitting ? "SENDING..." : "SEND CODE"}
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

export default ForgotPasswordForm;
