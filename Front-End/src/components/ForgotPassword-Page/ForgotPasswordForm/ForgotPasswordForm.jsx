import styles from "./forgotPasswordForm.module.css";

import BackLink from "../../General/BackLink/BackLink.jsx";
import PageIntro from "../../General/PageIntro/PageIntro.jsx";
import InputField from "../../General/InputField/InputField.jsx";
import GeneralBtn from "../../General/GeneralBtn/GeneralBtn.jsx";
import { useNavigate } from "react-router-dom";
import MessagePopup from "../../General/MessagePopup/MessagePopup.jsx";
import { useState } from "react";

//The function check that str is an email address
function checkEmail(str) {
  const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
  return emailRegex.test(str);
}

function ForgotPasswordForm() {
  const navigate = useNavigate();
  //keeps the user inputs
  const [userEmail, setUserEmail] = useState("");

  //keeps the errors accroding the input type
  const [emailError, setEmailError] = useState("");

  //This state is for the popup message after an attempt to login
  const [displayMessagePopup, setDisplayMessagePopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  const isFormValid = userEmail !== "" && checkEmail(userEmail);

  //The function send the email string to back end to check if valid
  async function accountRecovery(userEmail) {
    try {
      const response = await fetch("/api/forgotPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("The error is: ", error);
      return {
        success: false,
        message: "Server error",
      };
    }
  }

  //The function check if the form is valid if it does, call the createUser function
  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid) {
      setEmailError("Invalid email address");
      return;
    }
    const data = await accountRecovery(userEmail);
    //This part check if the user entered a valid and existing email address and sent texts to the popup according to the success state
    if (data?.success) {
      setDisplayMessagePopup({
        show: true,
        message: data.message,
        type: "success",
      });
    } else {
      setDisplayMessagePopup({
        show: true,
        message: data?.message || "Email was not found",
        type: "error",
      });
    }
  }

  return (
    <div className={styles.forgotPasswordForm}>
      <div className={styles.back}>
        <BackLink path="/loginPage" text="BACK TO LOGIN" />
      </div>

      <PageIntro
        smallTitle="ACCOUNT RECOVERY"
        title="Forgot your"
        italicText="password?"
        description="Enter the email address linked to your account. We will send you a verification code."
      />

      <form onSubmit={handleSubmit} className={styles.form}>
        <InputField
          label="EMAIL ADDRESS"
          placeholder="your@email.com"
          type="email"
          error={emailError}
          onChange={(e) => {
            if (checkEmail(e.target.value)) {
              setEmailError("");
            }
            setUserEmail(e.target.value);
          }}
          onBlur={(e) => {
            if (!checkEmail(e.target.value)) {
              setEmailError("Invalid email");
            } else {
              setEmailError("");
            }
          }}
        />

        <div className={styles.sendCode}>
          <GeneralBtn text="SEND CODE" />
        </div>
      </form>

      {/*This popup will be displayed ONLY after all the user inputs are valid.
      will display different kind of messages according to what the success status.
      if the user was logged in successfully then the user will be leaded to the shop website  */}
      {displayMessagePopup.show && (
        <MessagePopup
          message={displayMessagePopup.message}
          type={displayMessagePopup.type}
          onClose={() => {
            if (displayMessagePopup.type === "success") {
              navigate("/recoveryPage");
            } else {
              setDisplayMessagePopup({
                show: false,
                message: "",
                type: "",
              });
            }
          }}
        />
      )}
    </div>
  );
}

export default ForgotPasswordForm;
