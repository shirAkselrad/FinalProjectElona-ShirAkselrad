import styles from "./loginForm.module.css";
import { useAuth } from "../../../context/AuthContext.jsx";
import BackLink from "../../General/BackLink/BackLink.jsx";
import PageIntro from "../../General/PageIntro/PageIntro.jsx";
import InputField from "../../General/InputField/InputField.jsx";
import GeneralBtn from "../../General/GeneralBtn/GeneralBtn.jsx";
import AlreadyHave from "../../General/AlreadyHave/AlreadyHave.jsx";
import MessagePopup from "../../General/MessagePopup/MessagePopup.jsx";
import ForgotPassword from "../ForgotPassword/ForgotPassword.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { validateLoginField, checkLoginValidation } from "./loginValidation.js";

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [user, setUser] = useState({
    userName: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    userName: "",
    password: "",
  });

  const [lockUntil, setLockUntil] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [displayMessagePopup, setDisplayMessagePopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  const isFormValid = checkLoginValidation(user);
  const isLocked = lockUntil !== null && Date.now() < lockUntil;

  async function loginUser(userData) {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      return await response.json();
    } catch (error) {
      console.error("Error logging in user:", error);

      return {
        success: false,
        message: "Couldn't connect to the server. Please try again.",
      };
    }
  }

  //removes temporary login lock when it expires
  useEffect(() => {
    if (!lockUntil) return;
    const interval = setInterval(() => {
      if (Date.now() >= lockUntil) setLockUntil(null);
    }, 1000);
    return () => clearInterval(interval);
  }, [lockUntil]);

  //updates input values
  function handleChange(field, value) {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  }

  //checks input when leaving the field
  function handleBlur(field, value) {
    setErrors((prev) => ({
      ...prev,
      [field]: validateLoginField(field, value),
    }));
  }

  //submit login details

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isFormValid || isLocked || isSubmitting) return;

    setIsSubmitting(true);

    const data = await loginUser(user);

    setIsSubmitting(false);

    if (data.lockUntil) setLockUntil(data.lockUntil);

    if (data.success) {
      login(data.user);
      setAuthenticatedUser(data.user);
    }

    setDisplayMessagePopup({
      show: true,
      message: data.message || "Invalid username or password",
      type: data.success ? "success" : "error",
    });
  }

  //handles popup closing and navigation
  function handlePopupClose() {
    if (displayMessagePopup.type === "success" && authenticatedUser) {
      const previousPage = location.state?.from;

      if (authenticatedUser.role === "Manager")
        navigate("/managerPage", { replace: true });
      else if (authenticatedUser.role === "Employee")
        navigate("/employeePage", { replace: true });
      else if (authenticatedUser.role === "Client" && previousPage)
        navigate(previousPage.pathname + (previousPage.search || ""), {
          replace: true,
        });
      else navigate("/", { replace: true });
    }

    setDisplayMessagePopup({
      show: false,
      message: "",
      type: "",
    });
  }

  return (
    <div className={styles.loginForm}>
      <div className={styles.back}>
        <BackLink text="BACK TO SHOP" path="/" />
      </div>

      <PageIntro
        title="Welcome back."
        description="Sign in to your ELONA account."
      />

      <form onSubmit={handleSubmit} className={styles.form}>
        <InputField
          label="USERNAME"
          placeholder="Your username"
          type="text"
          maxLength={12}
          error={errors.userName}
          onChange={(e) => handleChange("userName", e.target.value)}
          onBlur={(e) => handleBlur("userName", e.target.value)}
        />

        <InputField
          label="PASSWORD"
          placeholder="Your password"
          type="password"
          error={errors.password}
          onChange={(e) => handleChange("password", e.target.value)}
          onBlur={(e) => handleBlur("password", e.target.value)}
        />

        <div className={styles.forgot}>
          <ForgotPassword />
        </div>

        <div className={styles.signIn}>
          <GeneralBtn
            disabled={!isFormValid || isLocked || isSubmitting}
            text={isSubmitting ? "LOGGING IN..." : "LOGIN"}
          />
        </div>

        <div className={styles.account}>
          <AlreadyHave
            path="/registerPage"
            text="Don't have an account?"
            linkText="Create one"
          />
        </div>
      </form>

      {displayMessagePopup.show && (
        <MessagePopup
          message={displayMessagePopup.message}
          type={displayMessagePopup.type}
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
}

export default LoginForm;
