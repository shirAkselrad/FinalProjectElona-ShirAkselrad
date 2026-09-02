import styles from "./resetPasswordPage.module.css";

import LoginRegisterImg from "../../General/LoginRegisterImg/LoginRegisterImg.jsx";
import ResetPasswordForm from "../ResetPasswordForm/ResetPasswordForm.jsx";

function ResetPasswordPage() {
  return (
    <main className={styles.resetPasswordPage}>
      <section className={styles.imageSide}>
        <LoginRegisterImg />
      </section>

      <section className={styles.formSide}>
        <ResetPasswordForm />
      </section>
    </main>
  );
}

export default ResetPasswordPage;
