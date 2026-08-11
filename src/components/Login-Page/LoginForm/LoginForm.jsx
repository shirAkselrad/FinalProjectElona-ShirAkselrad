import styles from "./loginForm.module.css";
import InputField from "../../General/InputField/InputField.jsx";
import GeneralBtn from "../../General/GeneralBtn/GeneralBtn.jsx";
import AlreadyHave from "../../General/AlreadyHave/AlreadyHave.jsx";
import ForgotPassword from "../ForgotPassword/ForgotPassword.jsx";
import Welcome from "../Welcome/Welcome.jsx";

function LoginForm() {
  return (
    <section className={styles.loginForm}>
      <LoginTitle welcome="WELCOME BACK" text="Login to your account" />

      <form className={styles.form}>
        <InputField label="USERNAME" placeholder="Your username" />

        <InputField
          label="PASSWORD"
          placeholder="Your password"
          type="password"
        />

        <div className={styles.forgot}>
          <ForgotPassword />
        </div>

        <div className={styles.button}>
          <FormButton text="SIGN IN" />
        </div>
      </form>

      <div className={styles.account}>
        <AccountText text="Don't have an account?" linkText="Create one" />
      </div>
    </section>
  );
}

export default LoginForm;
