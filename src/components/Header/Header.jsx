import styles from "./header.module.css";
import AboutUs from "../General/aboutUs/AboutUs.jsx";
import Welcome from "../Login-Page/Welcome/Welcome.jsx"
import CartBtn from "../General/CartBtn/CartBtn.jsx";
import Login from "../General/LoginBtn/LoginBtn.jsx";
import SignIn from "../General/SignInBtn/SignInBtn.jsx";
import Logo from "../General/Logo/Logo.jsx";
import ShopBtn from "../General/ShopBtn/ShopBtn.jsx";
import UserBtn from "../General/UserBtn/UserBtn.jsx";
import { useState, useEffect } from "react";

function Header() {
  const [firstName, setFirstName] = useState(null);
  useEffect(() => {
    async function getFirstName() {
      try {
        const res = await fetch("/login/firstName");
        const data = await res.json();

        if (!res.ok) {
          console.error("res error", res.status);
          return;
        }

        if (data.success) {
          setFirstName(data.firstName);
        } else {
          setFirstName(null);
        }
      } catch (error) {
        console.error("The error is:", error);
      }
    }

    getFirstName();
  }, []);
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
        <Welcome name={firstName} />

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
