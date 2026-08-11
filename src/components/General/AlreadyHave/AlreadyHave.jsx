import styles from "./accountText.module.css";

function AccountText({ text, linkText }) {
  return (
    <div className={styles.container}>
      <span className={styles.text}>{text}</span>

      <button className={styles.link}>{linkText}</button>
    </div>
  );
}

export default AccountText;
