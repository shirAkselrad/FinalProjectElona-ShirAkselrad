import styles from "./sentence.module.css";

function Sentence() {
  return (
    <section className={styles.sentence}>
      <div className={styles.content}>
        <p className={styles.text}>
          She survived the darkest chapter of history and
          <br />
          built a life of grace, love, and dignity. She was,
          <br />
          and always will be, the definition of a strong
          <br />
          woman.
        </p>

        <div className={styles.divider}>
          <span className={styles.line}></span>
          <span className={styles.diamond}></span>
          <span className={styles.line}></span>
        </div>

        <p className={styles.signature}>ELONA</p>
      </div>
    </section>
  );
}

export default Sentence;
