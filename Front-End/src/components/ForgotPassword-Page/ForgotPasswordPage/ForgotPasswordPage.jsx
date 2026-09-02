import styles from "./forgotPasswordPage.module.css";

import LoginRegisterImg from "../../General/LoginRegisterImg/LoginRegisterImg.jsx";
import ForgotPasswordForm from "../ForgotPasswordForm/ForgotPasswordForm.jsx";

function ForgotPasswordPage() {
  return (
    <main className={styles.forgotPasswordPage}>
      <section className={styles.imageSide}>
        <LoginRegisterImg />
      </section>

      <section className={styles.formSide}>
        <ForgotPasswordForm />
      </section>
    </main>
  );
}

export default ForgotPasswordPage;
