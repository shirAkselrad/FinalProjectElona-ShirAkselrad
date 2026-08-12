import styles from "./loginRegisterImg.module.css";
import loginImg from "../../../assets/LoginSignInPicture.png";

function LoginRegisterImg() {
  return (
    <div className={styles.container}>
      <img src={loginImg} alt="ELONA" className={styles.image} />

      <div className={styles.overlay}>
        <h2 className={styles.title}>
          EXCLUSIVE FASHION
          <br />
          FOR STRONG WOMEN
        </h2>

        <p className={styles.subtitle}>In honor to Lea (Elona) Weiss</p>

        <div className={styles.decoration}>
          <span className={styles.line}></span>
          <span className={styles.diamond}></span>
          <span className={styles.line}></span>
        </div>
      </div>
    </div>
  );
}

export default LoginRegisterImg;
