import styles from "./Welcome.module.css";

function Welcome({ welcome, text }) {
  return (
    <div className={styles.container}>
      <p className={styles.welcome}>{welcome}</p>

      <h1 className={styles.text}>{text}</h1>

      <div className={styles.decoration}>
        <span className={styles.line}></span>
        <span className={styles.diamond}></span>
        <span className={styles.line}></span>
      </div>
    </div>
  );
}

export default Welcome;
