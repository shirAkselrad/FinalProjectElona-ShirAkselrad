import styles from "./welcomeRegisterLogin.module.css";

function WelcomeRegisterLogin({ smallTitle, title, italicText }) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.smallTitle}>{smallTitle}</p>

      <h1 className={styles.title}>
        {title} <span>{italicText}</span>
      </h1>

      <div className={styles.decoration}>
        <span className={styles.line}></span>
        <span className={styles.diamond}></span>
        <span className={styles.line}></span>
      </div>
    </div>
  );
}

export default WelcomeRegisterLogin;
