import styles from "./registerForm.module.css";

import BackLink from "../../General/BackLink/BackLink.jsx";
import PageIntro from "../../General/PageIntro/PageIntro.jsx";
import InputField from "../../General/InputField/InputField.jsx";
import GeneralBtn from "../../General/GeneralBtn/GeneralBtn.jsx";
import AlreadyHave from "../../General/AlreadyHave/AlreadyHave.jsx";

function RegisterForm() {
  return (
    <div className={styles.registerForm}>
      <div className={styles.back}>
        <BackLink text="BACK TO SHOP" />
      </div>

      <PageIntro
        smallTitle="JOIN ELONA"
        title="Create your"
        italicText="account"
      />

      <form className={styles.form}>
        <InputField
          label="FULL NAME"
          placeholder="Your full name"
          type="text"
        />

        <InputField label="ADDRESS" placeholder="Your address" type="text" />

        <div className={styles.row}>
          <InputField
            label="EMAIL ADDRESS"
            placeholder="your@email.com"
            type="email"
          />

          <InputField
            label="PHONE NUMBER"
            placeholder="+972 00 000 0000"
            type="tel"
          />
        </div>

        <div className={styles.row}>
          <InputField
            label="USERNAME"
            placeholder="Choose a username"
            type="text"
          />

          <InputField
            label="PASSWORD"
            placeholder="Your password"
            type="password"
          />
        </div>

        <div className={styles.verifyPassword}>
          <InputField
            label="VERIFY PASSWORD"
            placeholder="Repeat your password"
            type="password"
          />
        </div>

        <div className={styles.createAccount}>
          <GeneralBtn text="CREATE ACCOUNT" />
        </div>

        <div className={styles.account}>
          <AlreadyHave text="Already have an account?" linkText="Log in" />
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
