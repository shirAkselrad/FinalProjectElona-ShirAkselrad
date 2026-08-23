import styles from "./loginForm.module.css";

import BackLink from "../../General/BackLink/BackLink.jsx";
import PageIntro from "../../General/PageIntro/PageIntro.jsx";
import InputField from "../../General/InputField/InputField.jsx";
import GeneralBtn from "../../General/GeneralBtn/GeneralBtn.jsx";
import AlreadyHave from "../../General/AlreadyHave/AlreadyHave.jsx";

import ForgotPassword from "../ForgotPassword/ForgotPassword.jsx";

function LoginForm() {
  return (
    <div className={styles.loginForm}>
      <div className={styles.back}>
        <BackLink text="BACK TO SHOP" path="/" />
      </div>

      <PageIntro
        smallTitle="WELCOME BACK"
        title="Login to your"
        italicText="account"
      />

      <form className={styles.form}>
        <InputField label="USERNAME" placeholder="Your username" type="text" />

        <InputField
          label="PASSWORD"
          placeholder="Your password"
          type="password"
        />

        <div className={styles.forgot}>
          <ForgotPassword />
        </div>

        <div className={styles.signIn}>
          <GeneralBtn text="SIGN IN" />
        </div>

        <div className={styles.account}>
          <AlreadyHave text="Don't have an account?" linkText="Create one" />
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
