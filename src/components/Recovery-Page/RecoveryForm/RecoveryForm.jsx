import styles from "./recoveryForm.module.css";

import BackLink from "../../General/BackLink/BackLink.jsx";
import PageIntro from "../../General/PageIntro/PageIntro.jsx";
import InputField from "../../General/InputField/InputField.jsx";
import GeneralBtn from "../../General/GeneralBtn/GeneralBtn.jsx";
import MessagePopup from "../../General/MessagePopup/MessagePopup.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function RecoveryForm() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  //This state is for the popup message after an attempt to login
  const [displayMessagePopup, setDisplayMessagePopup] = useState({
    show: false,
    message: "",
    type: "",
  });
  //The function send to backend the recovery code which has been entered by the user
  async function recoveryCode(code) {
    try {
      const response = await fetch("/api/recoveryPage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
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

  async function handleSubmit(e) {
    e.preventDefault();

    if (code.length !== 6) {
      setDisplayMessagePopup({
        show: true,
        message:
          "Inavlid amount of digits in the recovery code, please try again",
        type: "error",
      });
      return;
    }
    const data = await recoveryCode(code);
    //This part check if the user entered a valid recovery code and sent texts to the popup according to the success state
    if (data?.success) {
      navigate("/ResetPasswordPage");
    } else {
      setDisplayMessagePopup({
        show: true,
        message: "Incorrect recovery code, please try again",
        type: "error",
      });
    }
  }

  return (
    <div className={styles.recoveryForm}>
      <div className={styles.back}>
        <BackLink path="/ForgotPasswordPage" text="BACK" />
      </div>

      <PageIntro
        smallTitle="VERIFICATION"
        title="Enter your"
        italicText="code"
        description="A 6-digit code was sent to your email."
      />

      <form onSubmit={handleSubmit} className={styles.form}>
        <InputField
          label="VERIFICATION CODE"
          placeholder="000000"
          type="text"
          value={code}
          maxLength={6}
          onChange={(e) => {
            const value = e.target.value;

            if (/^\d*$/.test(value)) {
              setCode(value);
            }
          }}
        />

        <div className={styles.verify}>
          <GeneralBtn text="VERIFY" />
        </div>
      </form>

      {displayMessagePopup.show && (
        <MessagePopup
          message={displayMessagePopup.message}
          type={displayMessagePopup.type}
          onClose={() => {
            if (displayMessagePopup.type !== "success") {
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

export default RecoveryForm;
