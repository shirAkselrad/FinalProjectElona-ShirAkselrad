import styles from "./footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.brand}>
        <h2>ELONA</h2>
        <p>EXCLUSIVE FASHION FOR STRONG WOMEN</p>
      </div>

      <nav className={styles.links}>
        <a href="#">SHOP</a>
        <a href="#">ABOUT US</a>
        <a href="#">CONTACT</a>
      </nav>

      <div className={styles.copyright}>© 2026 Elona · Israel</div>
    </footer>
  );
}

export default Footer;
