import styles from "./signInBtn.module.css";
import {Link} from "react-router-dom"
function SignInBtn() {
  // return <button className={styles.signIn}>SIGN IN</button>;
  return (
    <Link to="/registerPage" className={styles.signIn}>
      SIGN IN
    </Link>
  );
}

export default SignInBtn;
