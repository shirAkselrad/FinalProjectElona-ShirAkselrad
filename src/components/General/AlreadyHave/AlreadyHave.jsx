import styles from "./alreadyHave.module.css";

function AlreadyHave({ text, linkText }) {
  return (
    <div className={styles.container}>
      <span className={styles.text}>{text}</span>

      <button type="button" className={styles.link}>
        {linkText}
      </button>
    </div>
  );
}

export default AlreadyHave;
