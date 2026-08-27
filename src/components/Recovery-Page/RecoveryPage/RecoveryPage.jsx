import styles from "./recoveryPage.module.css";

import LoginRegisterImg from "../../General/LoginRegisterImg/LoginRegisterImg.jsx";
import RecoveryForm from "../RecoveryForm/RecoveryForm.jsx";

function RecoveryPage() {
  return (
    <main className={styles.recoveryPage}>
      <section className={styles.imageSide}>
        <LoginRegisterImg />
      </section>

      <section className={styles.formSide}>
        <RecoveryForm />
      </section>
    </main>
  );
}

export default RecoveryPage;
