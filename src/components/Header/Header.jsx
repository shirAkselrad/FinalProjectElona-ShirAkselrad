import styles from "./header.module.css";
import AboutUs from "../General/aboutUs/AboutUs.jsx";
import Welcome from "../General/Welcome/Welcome.jsx";
import CartBtn from "../General/CartBtn/CartBtn.jsx";
import Login from "../General/LoginBtn/LoginBtn.jsx";
import SignIn from "../General/SignInBtn/SignInBtn.jsx";
import Logo from "../General/Logo/Logo.jsx";
import ShopBtn from "../General/ShopBtn/ShopBtn.jsx";
import UserBtn from "../General/UserBtn/UserBtn.jsx";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <AboutUs />
        <span className={styles.diamond}></span>
        <ShopBtn />
      </div>

      <div className={styles.center}>
        <Logo />
      </div>

      <div className={styles.right}>
        <CartBtn />
        <span className={styles.diamond}></span>
        <Welcome />

        <span className={styles.diamond}></span>
        <UserBtn />

        <span className={styles.diamond}></span>

        <Login />

        <span className={styles.diamond}></span>

        <SignIn />
      </div>
    </header>
  );
}

export default Header;
