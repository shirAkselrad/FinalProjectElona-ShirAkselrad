import styles from "./menuLine.module.css";

function MenuLine({ text, icon, active, onClick }) {
  return (
    <div
      className={`${styles.menuLine} ${active ? styles.active : ""}`}
      onClick={onClick}
    >
      <span className={styles.icon}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

export default MenuLine;
