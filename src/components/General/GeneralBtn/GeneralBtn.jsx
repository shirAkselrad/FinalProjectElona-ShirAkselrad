import styles from "./generalBtn.module.css";

function GeneralBtn({ text }) {
  return <button className={styles.button}>{text}</button>;
}

export default GeneralBtn;
