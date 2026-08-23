import styles from "./backLink.module.css";
import { Link } from "react-router-dom";
function BackLink({ text, path }) {
  return (
    <Link className={styles.backLink} to={path}>
      <span className={styles.arrow}>←</span>
      <span>{text}</span>
    </Link>
  );
}

export default BackLink;
