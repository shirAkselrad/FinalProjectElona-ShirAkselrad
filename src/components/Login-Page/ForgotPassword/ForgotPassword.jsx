import styles from "./forgotPassword.module.css";
import { Link } from "react-router-dom";
function ForgotPassword() {
  return (
    <Link to="/ForgotPasswordPage" className={styles.forgotPassword}>
      Forgot password?
    </Link>
  );
}

export default ForgotPassword;
