import styles from "./sentence.module.css";

function Sentence() {
  return (
    <section className={styles.sentence}>
      <div className={styles.content}>
        <p className={styles.text}>
          “As long as someone remembers me, I am alive.”
        </p>

        <p className={styles.author}>— Carlos Ruiz Zafón</p>

        <p className={styles.memory}>IN LOVING MEMORY OF ELONA (LEA) WEISS</p>
      </div>
    </section>
  );
}

export default Sentence;
