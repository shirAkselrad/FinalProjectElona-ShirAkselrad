import styles from "./logo.module.css";
import logo from "../../../assets/Logo-Elona.png";

function Logo() {
  return (
    <div className={styles.logoContainer}>
      <img src={logo} alt="ELONA" className={styles.logo} />
    </div>
  );
}

export default Logo;
