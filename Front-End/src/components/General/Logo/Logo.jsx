// import styles from "./logo.module.css";
// import logo from "../../../assets/Logo-Elona.png";
// import { Link } from "react-router-dom";
// function Logo() {
//   return (
//     <div className={styles.logoContainer}>
//       <Link to="/">
//         <img src={logo} alt="ELONA" className={styles.logo} />
//       </Link>
//     </div>
//   );
// }

// export default Logo;


import styles from "./logo.module.css";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <div className={styles.logoContainer}>
      <Link to="/" className={styles.logo}>
        <span className={styles.brandName}>ELONA</span>
        <span className={styles.slogan}>
          EXCLUSIVE FASHION FOR STRONG WOMEN
        </span>
      </Link>
    </div>
  );
}

export default Logo;
