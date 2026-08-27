import styles from "./resetPasswordForm.module.css";

import BackLink from "../../General/BackLink/BackLink.jsx";
import PageIntro from "../../General/PageIntro/PageIntro.jsx";
import InputField from "../../General/InputField/InputField.jsx";
import GeneralBtn from "../../General/GeneralBtn/GeneralBtn.jsx";
import MessagePopup from "../../General/MessagePopup/MessagePopup.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

//The function check that both passwords are equal
function checkVerificationPassword(password, str) {
  if (password === str) return true;
  return false;
}

//The function send the new password to backend
async function resetPassword(password) {
  try {
    const response = await fetch("/resetPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("error reseting password: ", error);
  }
}

//The function check if str is a valid password
function checkPassword(str) {
  if (str.length < 8 || str.length > 12) return false;
  const specialChars = "!@#$%^&*?";
  let special = false;
  let capital = false;
  for (let i = 0; i < str.length; i++) {
    if (specialChars.includes(str[i])) special = true;
    if (str[i] >= "A" && str[i] <= "Z") capital = true;
  }

  return capital && special;
}

function ResetPasswordForm() {
  const navigate = useNavigate();

  //keeps password
  const [userPassword, setUserPassword] = useState("");

  //keeps the verification password
  const [userVerificationPassword, setUserVerificationPassword] = useState("");

  //keeps the errors accroding the input type
  const [errors, setErrors] = useState({
    password: "",
    verification: "",
  });

  //This state is for the popup message after an attempt to login
  const [displayMessagePopup, setDisplayMessagePopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  const isFormValid =
    checkPassword(userPassword) &&
    checkVerificationPassword(userPassword, userVerificationPassword);

  //The function check if the form is valid if it does, call the createUser function
  async function handleSubmit(e) {
    e.preventDefault();

    if (!isFormValid) return;

    const data = await resetPassword(userPassword);

    //This part check if the user created and sent texts to the popup according to the success state
    if (data?.success) {
      setDisplayMessagePopup({
        show: true,
        message: data.message,
        type: "success",
      });
    } else {
      setDisplayMessagePopup({
        show: true,
        message: data?.message || "Invalid password",
        type: "error",
      });
    }
  }

  return (
    <div className={styles.resetPasswordForm}>
      <div className={styles.back}>
        <BackLink path="/recoveryPage" text="BACK" />
      </div>

      <PageIntro
        smallTitle="NEW PASSWORD"
        title="Reset your"
        italicText="password"
      />

      <form onSubmit={handleSubmit} className={styles.form}>
        <InputField
          label="NEW PASSWORD"
          placeholder="Your new password"
          type="password"
          error={errors.password}
          onChange={(e) => {
            if (checkPassword(e.target.value)) {
              setErrors({
                ...errors,
                password: "",
              });
            }
            setUserPassword(e.target.value);
          }}
          onBlur={(e) => {
            if (!checkPassword(e.target.value)) {
              setErrors({
                ...errors,
                password:
                  "Password must be 8-12 characters and contain a capital letter and special character",
              });
            } else {
              setErrors({ ...errors, password: "" });
            }
          }}
        />
        <InputField
          label="CONFIRM PASSWORD"
          placeholder="Repeat your password"
          type="password"
          error={errors.verification}
          onChange={(e) => {
            setUserVerificationPassword(e.target.value);
            if (checkVerificationPassword(userPassword, e.target.value)) {
              setErrors({ ...errors, verification: "" });
            }
          }}
          onBlur={(e) => {
            if (!checkVerificationPassword(userPassword, e.target.value)) {
              setErrors({ ...errors, verification: "Passwords don't match" });
            } else {
              setErrors({ ...errors, verification: "" });
            }
          }}
        />

        <div className={styles.savePassword}>
          <GeneralBtn text="SAVE NEW PASSWORD" />
        </div>
      </form>

      {/*This popup will be displayed ONLY after all the user inputs are valid.
      will display different kind of messages according to what the success status.
      if the user was resert the passowrd successfully then the user will be leaded to the login page */}
      {displayMessagePopup.show && (
        <MessagePopup
          message={displayMessagePopup.message}
          type={displayMessagePopup.type}
          onClose={() => {
            if (displayMessagePopup.type === "success") {
              navigate("/loginPage");
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

export default ResetPasswordForm;
