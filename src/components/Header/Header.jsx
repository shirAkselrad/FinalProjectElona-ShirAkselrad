import styles from "./header.module.css";

import AboutUs from "../aboutUs/AboutUs.jsx";
import Welcome from "../Welcome/Welcome.jsx";
import Cart from "../Cart/Cart.jsx";
import Login from "../LoginBtn/LoginBtn.jsx";
import SignIn from "../SignInBtn/SignInBtn.jsx";
import Logo from "../Logo/Logo.jsx";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <AboutUs />
      </div>

      <div className={styles.center}>
        <Logo />
      </div>

      <div className={styles.right}>
        <Welcome />

        <span className={styles.diamond}></span>

        <Cart />

        <span className={styles.diamond}></span>

        <Login />

        <span className={styles.diamond}></span>

        <SignIn />
      </div>
    </header>
  );
}

export default Header;
