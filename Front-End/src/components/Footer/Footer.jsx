import styles from "./footer.module.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.brand}>
        <h2>ELONA</h2>
        <p>EXCLUSIVE FASHION FOR STRONG WOMEN</p>
      </div>

      <nav className={styles.links}>
        <Link to="/shop">SHOP</Link>
        <Link to="/aboutUs">ABOUT US</Link>
        <Link to="/contact">CONTACT</Link>
      </nav>

      <div className={styles.copyright}>© 2026 Elona · Israel</div>
    </footer>
  );
}

export default Footer;
