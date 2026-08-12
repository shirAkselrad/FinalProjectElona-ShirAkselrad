import styles from "./loginPage.module.css";

import LoginRegisterImg from "../../General/LoginRegisterImg/LoginRegisterImg.jsx"
import LoginForm from "../LoginForm/LoginForm.jsx"

function LoginPage() {
  return (
    <main className={styles.loginPage}>
      <section className={styles.imageSide}>
        <LoginRegisterImg />
      </section>

      <section className={styles.formSide}>
        <LoginForm />
      </section>
    </main>
  );
}

export default LoginPage;
