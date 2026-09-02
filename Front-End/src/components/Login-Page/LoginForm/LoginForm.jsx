import styles from "./loginForm.module.css";

import BackLink from "../../General/BackLink/BackLink.jsx";
import PageIntro from "../../General/PageIntro/PageIntro.jsx";
import InputField from "../../General/InputField/InputField.jsx";
import GeneralBtn from "../../General/GeneralBtn/GeneralBtn.jsx";
import AlreadyHave from "../../General/AlreadyHave/AlreadyHave.jsx";
import MessagePopup from "../../General/MessagePopup/MessagePopup.jsx";
import ForgotPassword from "../ForgotPassword/ForgotPassword.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

//The function gets an str and returns true if str is not empty, else, false
function checkInput(str) {
  return str.length != 0;
}
//The function sends all the inputs values to backend for validation the login inputs
async function loginUser(userData) {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("error logging in user: ", error);

  
  }
}

function LoginForm() {
  const navigate = useNavigate();

  //keeps the user inputs
  const [user, setUser] = useState({
    userName: "",
    password: "",
  });

  //keeps the errors accroding the input type
  const [errors, setErrors] = useState({
    userName: "",
    password: "",
  });

  //This state is for the popup message after an attempt to login
  const [displayMessagePopup, setDisplayMessagePopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [userRole, setUserRole] = useState("");
  //checking that the user doesn't have any empty inputs before sending to info to backend
  const allUserFieldsFilled = Object.values(user).every(
    (value) => value !== "",
  );

  //checking there is no errors in the inputs before sending it to backend
  const noErrors = Object.values(errors).every((error) => error === "");

  const isFormValid = allUserFieldsFilled && noErrors;

  //The function check if the form is valid if it does, call the createUser function
  async function handleSubmit(e) {
    e.preventDefault();

    if (!isFormValid) return;
    const userData = {
      userName: user.userName,
      password: user.password,
    };

    const data = await loginUser(userData);
    console.log("role from backend: ", data?.role);

    //This part check if the user created and sent texts to the popup according to the success state
    if (data?.success) {
      setUserRole(data.role);
      setDisplayMessagePopup({
        show: true,
        message: data.message,
        type: "success",
      });
    } else {
      setDisplayMessagePopup({
        show: true,
        message: data?.message || "Invalid username or password",
        type: "error",
      });
    }
  }
  return (
    <div className={styles.loginForm}>
      <div className={styles.back}>
        <BackLink text="BACK TO SHOP" path="/" />
      </div>

      <PageIntro
        smallTitle="WELCOME BACK"
        title="Login to your"
        italicText="account"
      />

      <form onSubmit={handleSubmit} className={styles.form}>
        <InputField
          label="USERNAME"
          placeholder="Your username"
          type="text"
          error={errors.userName}
          maxLength={12}
          onChange={(e) => {
            if (checkInput(e.target.value)) {
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
            if (!checkInput(e.target.value)) {
              setErrors({
                ...errors,
                userName: "Username cannot be empty",
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
          maxLength={12}
          error={errors.password}
          onChange={(e) => {
            if (checkInput(e.target.value)) {
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
            if (!checkInput(e.target.value)) {
              setErrors({
                ...errors,
                password: "Password cannot be empty",
              });
            } else {
              setErrors({
                ...errors,
                password: "",
              });
            }
          }}
        />

        <div className={styles.forgot}>
          <ForgotPassword />
        </div>

        <div className={styles.signIn}>
          <GeneralBtn disabled={!isFormValid} text="LOGIN" />
        </div>

        <div className={styles.account}>
          <AlreadyHave
            path={"/registerPage"}
            text="Don't have an account?"
            linkText="Create one"
          />
        </div>
      </form>

      {/*This popup will be displayed ONLY after all the user inputs are valid.
      will display different kind of messages according to what the success status.
      if the user was logged in successfully then the user will be leaded to the shop website  */}
      {displayMessagePopup.show && (
        <MessagePopup
          message={displayMessagePopup.message}
          type={displayMessagePopup.type}
          onClose={() => {
            if (displayMessagePopup.type === "success") {
              if (userRole === "Manager") navigate("/managerPage");
              else if (userRole === "Employee") navigate("/employeePage");
              else navigate("/");
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

export default LoginForm;
