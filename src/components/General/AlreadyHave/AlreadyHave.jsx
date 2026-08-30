import styles from "./alreadyHave.module.css";
import { Link } from "react-router-dom";

function AlreadyHave({ path, text, linkText }) {
  return (
    <div className={styles.container}>
      <span className={styles.text}>{text}</span>

      <Link className={styles.link} to={path}>
        {linkText}
      </Link>
    </div>
  );
}

export default AlreadyHave;
