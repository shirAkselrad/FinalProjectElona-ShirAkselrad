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
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isShopPage = location.pathname === "/";

  const showBackToSystem =
    isShopPage && (user?.role === "Manager" || user?.role === "Employee");

  function backToSystem() {
    if (user?.role === "Manager") navigate("/managerPage");
    else if (user?.role === "Employee") navigate("/employeePage");
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <AboutUs />

        <span className={styles.diamond}></span>

        <ShopBtn />

        {showBackToSystem && (
          <div>
            <span className={styles.diamond}></span>

            <button
              type="button"
              onClick={backToSystem}
              className={styles.systemBtn}
            >
              {user.role === "Manager" ? "Manager" : "Employee"}
            </button>
          </div>
        )}
      </div>

      <div className={styles.center}>
        <Logo />
      </div>

      <div className={styles.right}>
        <CartBtn />

        <span className={styles.diamond}></span>

        <Welcome name={user?.firstName} />

        <span className={styles.diamond}></span>

        <UserBtn />

        {!user && (
          <div>
            <Login />

            <span className={styles.diamond}></span>

            <SignIn />
          </div>
        )}

        {user && <Logout out={logout} />}
      </div>
    </header>
  );
}

export default Header;
