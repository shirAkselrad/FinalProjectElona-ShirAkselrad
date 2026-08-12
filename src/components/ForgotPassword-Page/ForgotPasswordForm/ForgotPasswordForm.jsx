import styles from "./forgotPasswordForm.module.css";

import BackLink from "../../General/BackLink/BackLink.jsx";
import PageIntro from "../../General/PageIntro/PageIntro.jsx";
import InputField from "../../General/InputField/InputField.jsx";
import GeneralBtn from "../../General/GeneralBtn/GeneralBtn.jsx";

function ForgotPasswordForm() {
  return (
    <div className={styles.forgotPasswordForm}>
      <div className={styles.back}>
        <BackLink text="BACK TO LOGIN" />
      </div>

      <PageIntro
        smallTitle="ACCOUNT RECOVERY"
        title="Forgot your"
        italicText="password?"
        description="Enter the email address linked to your account. We will send you a verification code."
      />

      <form className={styles.form}>
        <InputField
          label="EMAIL ADDRESS"
          placeholder="your@email.com"
          type="email"
        />

        <div className={styles.sendCode}>
          <GeneralBtn text="SEND CODE" />
        </div>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;
