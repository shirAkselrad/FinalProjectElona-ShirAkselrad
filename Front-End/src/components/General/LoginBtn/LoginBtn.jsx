import styles from "./loginBtn.module.css";
import {Link} from "react-router-dom"
function LoginBtn() {
  // return <button className={styles.login}>LOGIN</button>;
  return <Link className={styles.login} to="/loginPage">LOGIN</Link>
}

export default LoginBtn;
