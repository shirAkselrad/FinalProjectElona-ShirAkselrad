import styles from "./welcomeRegister.module.css";

function WelcomeRegister() {
  return (
    <div className={styles.container}>
      <p className={styles.smallTitle}>JOIN ELONA</p>

      <h1 className={styles.title}>
        Create your <span>account</span>
      </h1>

      <div className={styles.decoration}>
        <span className={styles.line}></span>
        <span className={styles.diamond}></span>
        <span className={styles.line}></span>
      </div>
    </div>
  );
}

export default WelcomeRegister;
