import styles from "./registerForm.module.css";

import BackLink from "../../General/BackLink/BackLink.jsx";
import PageIntro from "../../General/PageIntro/PageIntro.jsx";
import InputField from "../../General/InputField/InputField.jsx";
import GeneralBtn from "../../General/GeneralBtn/GeneralBtn.jsx";
import AlreadyHave from "../../General/AlreadyHave/AlreadyHave.jsx";
import MessagePopup from "../../General/MessagePopup/MessagePopup.jsx";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import * as Validation from "../../../utils/inputValidation.js";

//The function sends all the inputs values to backend for creating a new user
async function createUser(userData) {
  try {
    const response = await fetch("/api/register", {
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
  const navigate = useNavigate();

  //keeps all the cities from the given cities list
  const [cities, setCities] = useState([]);

  //keeps the user inputs
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

  //keeps the errors accroding the input type
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

  //This state is for the popup message after an attempt to sign in
  const [displayMessagePopup, setDisplayMessagePopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  //checking that the user doesn't have any empty inputs before sending to info to backend
  const allUserFieldsFilled = Object.values(user).every(
    (value) => value !== "",
  );

  //checking there is no errors in the inputs before sending it to backend
  const noErrors = Object.values(errors).every((error) => error === "");

  const isFormValid = allUserFieldsFilled && noErrors;

  useEffect(() => {
    async function getCities() {
      try {
        const response = await fetch(
          "https://data.gov.il/api/3/action/datastore_search?resource_id=8f714b6f-c35c-4b40-a0e7-547b675eee0e&limit=2000",
        );
        if (!response.ok) {
          throw new Error(`HTTP error, status:  ${response.status}`);
        }
        const data = await response.json();

        //taking all the cities and setting them into the cities state
        const englishCities = data.result.records
          .map((city) => city.city_name_en?.trim())
          .filter((cityName) => cityName);

        setCities(englishCities);
      } catch (error) {
        console.error("Error getting cities list: ", error);
      }
    }
    getCities();
  }, []);

  //The function check if the form is valid if it does, call the createUser function
  async function handleSubmit(e) {
    e.preventDefault();

    if (!isFormValid) return;
    const userData = {
      firstName: Validation.onlyFirstLetterCapital(user.firstName),
      lastName: Validation.onlyFirstLetterCapital(user.lastName),
      ID: user.ID,
      city: Validation.onlyFirstLetterCapital(user.city),
      street: Validation.onlyFirstLetterCapital(user.street),
      houseNum: user.houseNum,
      email: user.email,
      phoneNum: user.phoneNum,
      userName: user.userName,
      password: user.password,
    };

    const data = await createUser(userData);

    //This part check if the user created and sent texts to the popup according to the success state
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

  const filteredCities = user.city
    ? cities.filter((city) =>
        city.toLowerCase().startsWith(user.city.toLowerCase()),
      )
    : [];
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
            maxLength={30}
            error={errors.firstName}
            onChange={(e) => {
              if (Validation.checkStr(e.target.value)) {
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
              if (!Validation.checkStr(e.target.value)) {
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
            maxLength={30}
            error={errors.lastName}
            onChange={(e) => {
              if (Validation.checkStr(e.target.value)) {
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
              if (!Validation.checkStr(e.target.value)) {
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
            maxLength={9}
            error={errors.ID}
            onChange={(e) => {
              if (Validation.onlyNumbers(e.target.value)) {
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
              if (!Validation.onlyNumbers(e.target.value)) {
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
            maxLength={50}
            error={errors.city}
            onChange={(e) => {
              if (Validation.checkStr(e.target.value)) {
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
              if (!Validation.checkStr(e.target.value)) {
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
            maxLength={50}
            error={errors.street}
            onChange={(e) => {
              if (Validation.checkStr(e.target.value)) {
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
              if (!Validation.checkStr(e.target.value)) {
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
            maxLength={5}
            type="text"
            error={errors.houseNum}
            onChange={(e) => {
              if (Validation.onlyNumbers(e.target.value)) {
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
              if (!Validation.onlyNumbers(e.target.value)) {
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
            maxLength={100}
            type="email"
            error={errors.email}
            onChange={(e) => {
              if (Validation.checkEmail(e.target.value)) {
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
              if (!Validation.checkEmail(e.target.value)) {
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
            maxLength={10}
            error={errors.phoneNum}
            onChange={(e) => {
              if (Validation.checkPhoneNum(e.target.value)) {
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
              if (!Validation.checkPhoneNum(e.target.value)) {
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
            maxLength={12}
            type="text"
            error={errors.userName}
            onChange={(e) => {
              if (Validation.checkUsername(e.target.value)) {
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
              if (!Validation.checkUsername(e.target.value)) {
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
            maxLength={12}
            type="password"
            error={errors.password}
            onChange={(e) => {
              if (Validation.checkPassword(e.target.value)) {
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
              if (!Validation.checkPassword(e.target.value)) {
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
            maxLength={12}
            type="password"
            error={errors.verifyPassword}
            onChange={(e) => {
              if (
                Validation.checkVerificationPassword(
                  user.password,
                  e.target.value,
                )
              ) {
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
              if (
                !Validation.checkVerificationPassword(
                  user.password,
                  e.target.value,
                )
              ) {
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
          <AlreadyHave
            path={"/loginPage"}
            text="Already have an account?"
            linkText="Log in"
          />
        </div>
      </form>

      {/*This popup will be displayed ONLY after all the user inputs are valid.
      will display different kind of messages according to what the success status.
      if the user was created then the user will be leaded to the login page  */}
      {displayMessagePopup.show && (
        <MessagePopup
          message={displayMessagePopup.message}
          type={displayMessagePopup.type}
          onClose={() => {
            if (displayMessagePopup.type === "success") {
              navigate("/loginPage");
            } else {
              setDisplayMessagePopup({
                show: false,
                message: "",
                type: "",
              });
            }
          }}
        />
      )}
    </div>
  );
}

export default RegisterForm;
