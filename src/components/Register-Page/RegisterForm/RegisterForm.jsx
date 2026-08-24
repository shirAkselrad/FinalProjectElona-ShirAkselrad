import styles from "./registerForm.module.css";

import BackLink from "../../General/BackLink/BackLink.jsx";
import PageIntro from "../../General/PageIntro/PageIntro.jsx";
import InputField from "../../General/InputField/InputField.jsx";
import GeneralBtn from "../../General/GeneralBtn/GeneralBtn.jsx";
import AlreadyHave from "../../General/AlreadyHave/AlreadyHave.jsx";
import MessagePopup from "../../General/MessagePopup/MessagePopup.jsx";
import { useState } from "react";

//The function gets str and check that the str includes ONLY letters or spaces
function checkStr(str) {
  if (str.length == 0) return false;
  for (let i = 0; i < str.length; i++)
    if (
      (str[i] < "a" || str[i] > "z") &&
      (str[i] < "A" || str[i] > "Z") &&
      str[i] !== " "
    )
      return false;
  return true;
}

//The function check that str contains ONLY char numbers
function onlyNumbers(str) {
  if (str.length == 0) return false;
  for (let i = 0; i < str.length; i++)
    if (str[i] < "0" || str[i] > "9") return false;
  return true;
}

//The function check that str is an email address
function checkEmail(str) {
  const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
  return emailRegex.test(str);
}

//The function check that str is a valid username (must include 8-12 chars and 2 capital letters)
function checkUsername(str) {
  if (str.length < 8 || str.length > 12) return false;
  let count = 0;
  for (let i = 0; i < str.length; i++)
    if (str[i] >= "A" && str[i] <= "Z") count++;

  if (count >= 2) return true;
  return false;
}

//The function check if str is a valid password
function checkPassword(str) {
  if (str.length < 8 || str.length > 12) return false;
  const specialChars = "!@#$%^&*?";
  let special = false;
  let capital = false;
  for (let i = 0; i < str.length; i++) {
    if (specialChars.includes(str[i])) special = true;
    if (str[i] >= "A" && str[i] <= "Z") capital = true;
  }

  return capital && special;
}

//The function checks if str is a valid phone number pattern
function checkPhoneNum(str) {
  const phoneRegex = /0\d{1,2}-?\d{7}/;
  return phoneRegex.test(str);
}
//The function check that both passwords are equal
function checkVerificationPassword(password, str) {
  if (password === str) return true;
  return false;
}

//The function sends all the inputs values to backend for creating a new user
async function createUser(userData) {
  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("error creating new user: ", error);
  }
}

function RegisterForm() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    ID: "",
    city: "",
    street: "",
    houseNum: "",
    email: "",
    phoneNum: "",
    userName: "",
    password: "",
    verifyPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    ID: "",
    city: "",
    street: "",
    houseNum: "",
    email: "",
    phoneNum: "",
    userName: "",
    password: "",
    verifyPassword: "",
  });

  const [displayMessagePopup, setDisplayMessagePopup] = useState({
    show: false,
    message: "",
    type: "",
  });
  const allUserFieldsFilled = Object.values(user).every(
    (value) => value !== "",
  );

  const noErrors = Object.values(errors).every((error) => error === "");

  const isFormValid = allUserFieldsFilled && noErrors;

  //The function check if the form is valid if it does, call the createUser function
  async function handleSubmit(e) {
    e.preventDefault();

    if (!isFormValid) return;
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      ID: user.ID,
      city: user.city,
      street: user.street,
      houseNum: user.houseNum,
      email: user.email,
      phoneNum: user.phoneNum,
      userName: user.userName,
      password: user.password,
    };

    const data = await createUser(userData);

    if (data?.success) {
      setDisplayMessagePopup({
        show: true,
        message: data.message,
        type: "success",
      });
    } else {
      setDisplayMessagePopup({
        show: true,
        message: data?.message || "This User already exists",
        type: "error",
      });
    }
  }

  return (
    <div className={styles.registerForm}>
      <div className={styles.back}>
        <BackLink text="BACK TO SHOP" path="/" />
      </div>

      <PageIntro
        smallTitle="JOIN ELONA"
        title="Create your"
        italicText="account"
      />

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <InputField
            label="FIRST NAME"
            placeholder="Your first name"
            type="text"
            error={errors.firstName}
            onChange={(e) => {
              if (checkStr(e.target.value)) {
                setErrors({
                  ...errors,
                  firstName: "",
                });
              }
              setUser({
                ...user,
                firstName: e.target.value,
              });
            }}
            onBlur={(e) => {
              if (!checkStr(e.target.value)) {
                setErrors({
                  ...errors,
                  firstName: "Only letters and spaces are allowed",
                });
              } else {
                setErrors({
                  ...errors,
                  firstName: "",
                });
              }
            }}
          />

          <InputField
            label="LAST NAME"
            placeholder="Your last name"
            type="text"
            error={errors.lastName}
            onChange={(e) => {
              if (checkStr(e.target.value)) {
                setErrors({
                  ...errors,
                  lastName: "",
                });
              }
              setUser({
                ...user,
                lastName: e.target.value,
              });
            }}
            onBlur={(e) => {
              if (!checkStr(e.target.value)) {
                setErrors({
                  ...errors,
                  lastName: "Only letters and spaces are allowed",
                });
              } else {
                setErrors({
                  ...errors,
                  lastName: "",
                });
              }
            }}
          />
        </div>

        <div className={styles.row}>
          <InputField
            label="ID"
            placeholder="Your ID"
            type="text"
            error={errors.ID}
            onChange={(e) => {
              if (onlyNumbers(e.target.value)) {
                setErrors({
                  ...errors,
                  ID: "",
                });
              }
              setUser({
                ...user,
                ID: e.target.value,
              });
            }}
            onBlur={(e) => {
              if (!onlyNumbers(e.target.value)) {
                setErrors({
                  ...errors,
                  ID: "Only numbers allowed",
                });
              } else {
                setErrors({
                  ...errors,
                  ID: "",
                });
              }
            }}
          />

          <InputField
            label="CITY"
            placeholder="Your city"
            type="text"
            error={errors.city}
            onChange={(e) => {
              if (checkStr(e.target.value)) {
                setErrors({
                  ...errors,
                  city: "",
                });
              }
              setUser({
                ...user,
                city: e.target.value,
              });
            }}
            onBlur={(e) => {
              if (!checkStr(e.target.value)) {
                setErrors({
                  ...errors,
                  city: "Only letters and spaces are allowed",
                });
              } else {
                setErrors({
                  ...errors,
                  city: "",
                });
              }
            }}
          />
        </div>

        <div className={styles.row}>
          <InputField
            label="STREET"
            placeholder="Your street"
            type="text"
            error={errors.street}
            onChange={(e) => {
              if (checkStr(e.target.value)) {
                setErrors({
                  ...errors,
                  street: "",
                });
              }
              setUser({
                ...user,
                street: e.target.value,
              });
            }}
            onBlur={(e) => {
              if (!checkStr(e.target.value)) {
                setErrors({
                  ...errors,
                  street: "Only letters and spaces are allowed",
                });
              } else {
                setErrors({
                  ...errors,
                  street: "",
                });
              }
            }}
          />

          <InputField
            label="HOUSE NUMBER"
            placeholder="House number"
            type="text"
            error={errors.houseNum}
            onChange={(e) => {
              if (onlyNumbers(e.target.value)) {
                setErrors({
                  ...errors,
                  houseNum: "",
                });
              }
              setUser({
                ...user,
                houseNum: e.target.value,
              });
            }}
            onBlur={(e) => {
              if (!onlyNumbers(e.target.value)) {
                setErrors({
                  ...errors,
                  houseNum: "Only numbers allowed",
                });
              } else {
                setErrors({
                  ...errors,
                  houseNum: "",
                });
              }
            }}
          />
        </div>

        <div className={styles.row}>
          <InputField
            label="EMAIL ADDRESS"
            placeholder="your@email.com"
            type="email"
            error={errors.email}
            onChange={(e) => {
              if (checkEmail(e.target.value)) {
                setErrors({
                  ...errors,
                  email: "",
                });
              }
              setUser({
                ...user,
                email: e.target.value,
              });
            }}
            onBlur={(e) => {
              if (!checkEmail(e.target.value)) {
                setErrors({
                  ...errors,
                  email: "Invalid email",
                });
              } else {
                setErrors({
                  ...errors,
                  email: "",
                });
              }
            }}
          />

          <InputField
            label="PHONE NUMBER"
            placeholder="Your phone number"
            type="tel"
            error={errors.phoneNum}
            onChange={(e) => {
              if (checkPhoneNum(e.target.value)) {
                setErrors({
                  ...errors,
                  phoneNum: "",
                });
              }
              setUser({
                ...user,
                phoneNum: e.target.value,
              });
            }}
            onBlur={(e) => {
              if (!checkPhoneNum(e.target.value)) {
                setErrors({
                  ...errors,
                  phoneNum: "Invalid phone number",
                });
              } else {
                setErrors({
                  ...errors,
                  phoneNum: "",
                });
              }
            }}
          />
        </div>

        <div className={styles.row}>
          <InputField
            label="USERNAME"
            placeholder="Choose a username"
            type="text"
            error={errors.userName}
            onChange={(e) => {
              if (checkUsername(e.target.value)) {
                setErrors({
                  ...errors,
                  userName: "",
                });
              }
              setUser({
                ...user,
                userName: e.target.value,
              });
            }}
            onBlur={(e) => {
              if (!checkUsername(e.target.value)) {
                setErrors({
                  ...errors,
                  userName:
                    "Username must include 8-12 chars and at least 2 capital letters",
                });
              } else {
                setErrors({
                  ...errors,
                  userName: "",
                });
              }
            }}
          />

          <InputField
            label="PASSWORD"
            placeholder="Your password"
            type="password"
            error={errors.password}
            onChange={(e) => {
              if (checkPassword(e.target.value)) {
                setErrors({
                  ...errors,
                  password: "",
                });
              }
              setUser({
                ...user,
                password: e.target.value,
              });
            }}
            onBlur={(e) => {
              if (!checkPassword(e.target.value)) {
                setErrors({
                  ...errors,
                  password:
                    "Password must include 8-12 chars and at least one special char and one capital letter",
                });
              } else {
                setErrors({
                  ...errors,
                  password: "",
                });
              }
            }}
          />
        </div>

        <div className={styles.verifyPassword}>
          <InputField
            label="VERIFY PASSWORD"
            placeholder="Repeat your password"
            type="password"
            error={errors.verifyPassword}
            onChange={(e) => {
              if (checkVerificationPassword(user.password, e.target.value)) {
                setErrors({
                  ...errors,
                  verifyPassword: "",
                });
              }
              setUser({
                ...user,
                verifyPassword: e.target.value,
              });
            }}
            onBlur={(e) => {
              if (!checkVerificationPassword(user.password, e.target.value)) {
                setErrors({
                  ...errors,
                  verifyPassword: "Passwords don't match",
                });
              } else {
                setErrors({
                  ...errors,
                  verifyPassword: "",
                });
              }
            }}
          />
        </div>

        <div className={styles.createAccount}>
          <GeneralBtn
            type="submit"
            text="CREATE ACCOUNT"
            disabled={!isFormValid}
          />
        </div>

        <div className={styles.account}>
          <AlreadyHave text="Already have an account?" linkText="Log in" />
        </div>
      </form>

      {displayMessagePopup.show && (
        <MessagePopup
          message={displayMessagePopup.message}
          type={displayMessagePopup.type}
          onClose={() =>
            setDisplayMessagePopup({
              show: false,
              message: "",
              type: "",
            })
          }
        />
      )}
    </div>
  );
}

export default RegisterForm;
