import styles from "./header.module.css";
import AboutUs from "../General/aboutUs/AboutUs.jsx";
import Welcome from "../Login-Page/Welcome/Welcome.jsx";
import CartBtn from "../General/CartBtn/CartBtn.jsx";
import Login from "../General/LoginBtn/LoginBtn.jsx";
import SignIn from "../General/SignInBtn/SignInBtn.jsx";
import Logout from "../General/Logout/Logout.jsx";
import Logo from "../General/Logo/Logo.jsx";
import ShopBtn from "../General/ShopBtn/ShopBtn.jsx";
import UserBtn from "../General/UserBtn/UserBtn.jsx";
import { useState, useEffect } from "react";

function Header() {
  const [firstName, setFirstName] = useState(null);

  //The function sends all the inputs values to backend for validation the login inputs
  async function logout() {
    try {
      const response = await fetch("/api/header/logout", {
        method: "GET",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.success) setFirstName(null);
      return data;
    } catch (error) {
      console.error("error logging out user: ", error);
    }
  }

  useEffect(() => {
    async function getFirstName() {
      try {
        const res = await fetch("/api/login/firstName");
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

        {!firstName && <Login />}

        {!firstName && <span className={styles.diamond}></span>}

        {!firstName && <SignIn />}

        {firstName && <Logout out={logout} />}
      </div>
    </header>
  );
}

export default Header;
