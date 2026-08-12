import styles from "./backLink.module.css";

function BackLink({ text, onClick }) {
  return (
    <button className={styles.backLink} onClick={onClick}>
      <span className={styles.arrow}>←</span>
      <span>{text}</span>
    </button>
  );
}

export default BackLink;
