import styles from "./registerPage.module.css";

import LoginRegisterImg from "../../General/LoginRegisterImg/LoginRegisterImg.jsx";
import RegisterForm from "../RegisterForm/RegisterForm.jsx";

function RegisterPage() {
  return (
    <main className={styles.registerPage}>
      <section className={styles.imageSide}>
        <LoginRegisterImg />
      </section>

      <section className={styles.formSide}>
        <RegisterForm />
      </section>
    </main>
  );
}

export default RegisterPage;
