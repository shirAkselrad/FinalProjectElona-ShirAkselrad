import styles from "./menuLine.module.css";

/**
 *
 * @param {text} text  is the current title of the line menu (the section's name)
 * @param {icon} icon is the symbol which will be shown next to the title of the section
 * @param {active} active controls which line will be shown as "active" style
 * @param {onClick} onClick is the event which will accure when the line is clicked
 * @returns
 */
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
