import styles from "./registerForm.module.css";
import BackLink from "../../General/BackLink/BackLink.jsx";
import PageIntro from "../../General/PageIntro/PageIntro.jsx";
import InputField from "../../General/InputField/InputField.jsx";
import GeneralBtn from "../../General/GeneralBtn/GeneralBtn.jsx";
import AlreadyHave from "../../General/AlreadyHave/AlreadyHave.jsx";
import MessagePopup from "../../General/MessagePopup/MessagePopup.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  validateRegisterChange,
  validateRegisterBlur,
  checkRegisterValidation,
} from "./registerValidation.js";
import * as Validation from "../../../utils/inputValidation.js";

function RegisterForm() {
  const navigate = useNavigate();

  //keeps the user inputs
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    city: "",
    street: "",
    houseNum: "",
    email: "",
    phoneNum: "",
    userName: "",
    password: "",
    verifyPassword: "",
  });

  //keeps the errors accroding the input type
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    city: "",
    street: "",
    houseNum: "",
    email: "",
    phoneNum: "",
    userName: "",
    password: "",
    verifyPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  //This state is for the popup message after an attempt to sign in
  const [displayMessagePopup, setDisplayMessagePopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  const isFormValid = checkRegisterValidation(user);

  //The function sends all the inputs values to backend for creating a new user
  async function createUser(userData) {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } catch (error) {
      console.error("error creating new user: ", error);
      return {
        success: false,
        message: "Couldn't connect to the server",
      };
    }
  }

  //updates input values and their errors
  function handleChange(field, value) {
    const updatedUser = {
      ...user,
      [field]: value,
    };
    setUser(updatedUser);
    setErrors((prev) => validateRegisterChange(field, updatedUser, prev));
  }

  //validates the input after leaving it
  function handleBlur(field) {
    setErrors((prev) => validateRegisterBlur(field, user, prev));
  }

  //The function check if the form is valid if it does, call the createUser function
  async function handleSubmit(e) {
    e.preventDefault();

    if (!isFormValid || isSubmitting) return;

    const userData = {
      firstName: Validation.onlyFirstLetterCapital(user.firstName),
      lastName: Validation.onlyFirstLetterCapital(user.lastName),
      city: user.city.trim(),
      street: user.street.trim(),
      houseNum: user.houseNum.trim(),
      email: user.email.trim(),
      phoneNum: user.phoneNum.trim(),
      userName: user.userName.trim(),
      password: user.password
    };
    setIsSubmitting(true);
    try {
      const data = await createUser(userData);
      setDisplayMessagePopup({
        show: true,
        message:
          data.message ||
          (data.success
            ? "Account created successfully"
            : "Couldn't create your account"),
        type: data.success ? "success" : "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  //handles popup closing
  function handlePopupClose() {
    if (displayMessagePopup.type === "success") {
      navigate("/loginPage");
    } else {
      setDisplayMessagePopup({
        show: false,
        message: "",
        type: "",
      });
    }
  }

  return (
    <div className={styles.registerForm}>
      <div className={styles.back}>
        <BackLink text="BACK TO SHOP" path="/" />
      </div>

      <PageIntro
        title="Create your account."
        description="Join ELONA and discover exclusive fashion."
      />

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <InputField
            label="FIRST NAME"
            placeholder="Your first name"
            type="text"
            maxLength={30}
            value={user.firstName}
            error={errors.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            onBlur={() => handleBlur("firstName")}
          />

          <InputField
            label="LAST NAME"
            placeholder="Your last name"
            type="text"
            maxLength={30}
            value={user.lastName}
            error={errors.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            onBlur={() => handleBlur("lastName")}
          />
        </div>

        <div className={styles.row}>
          <InputField
            label="CITY"
            placeholder="Your city"
            type="text"
            maxLength={50}
            value={user.city}
            error={errors.city}
            onChange={(e) => handleChange("city", e.target.value)}
            onBlur={() => handleBlur("city")}
          />
        </div>

        <div className={styles.row}>
          <InputField
            label="STREET"
            placeholder="Your street"
            type="text"
            maxLength={50}
            value={user.street}
            error={errors.street}
            onChange={(e) => handleChange("street", e.target.value)}
            onBlur={() => handleBlur("street")}
          />

          <InputField
            label="HOUSE NUMBER"
            placeholder="House number"
            type="text"
            maxLength={5}
            value={user.houseNum}
            error={errors.houseNum}
            onChange={(e) => handleChange("houseNum", e.target.value)}
            onBlur={() => handleBlur("houseNum")}
          />
        </div>

        <div className={styles.row}>
          <InputField
            label="EMAIL ADDRESS"
            placeholder="your@email.com"
            type="email"
            maxLength={100}
            value={user.email}
            error={errors.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
          />

          <InputField
            label="PHONE NUMBER"
            placeholder="Your phone number"
            type="tel"
            maxLength={10}
            value={user.phoneNum}
            error={errors.phoneNum}
            onChange={(e) => handleChange("phoneNum", e.target.value)}
            onBlur={() => handleBlur("phoneNum")}
          />
        </div>

        <div className={styles.row}>
          <InputField
            label="USERNAME"
            placeholder="Choose a username"
            type="text"
            maxLength={12}
            value={user.userName}
            error={errors.userName}
            onChange={(e) => handleChange("userName", e.target.value)}
            onBlur={() => handleBlur("userName")}
          />

          <InputField
            label="PASSWORD"
            placeholder="Your password"
            type="password"
            maxLength={12}
            value={user.password}
            error={errors.password}
            onChange={(e) => handleChange("password", e.target.value)}
            onBlur={() => handleBlur("password")}
          />
        </div>

        <div className={styles.verifyPassword}>
          <InputField
            label="VERIFY PASSWORD"
            placeholder="Repeat your password"
            type="password"
            maxLength={12}
            value={user.verifyPassword}
            error={errors.verifyPassword}
            onChange={(e) => handleChange("verifyPassword", e.target.value)}
            onBlur={() => handleBlur("verifyPassword")}
          />
        </div>

        <div className={styles.createAccount}>
          <GeneralBtn
            type="submit"
            text={isSubmitting ? "CREATING..." : "CREATE ACCOUNT"}
            disabled={!isFormValid || isSubmitting}
          />
        </div>

        <div className={styles.account}>
          <AlreadyHave
            path="/loginPage"
            text="Already have an account?"
            linkText="Log in"
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

export default RegisterForm;
