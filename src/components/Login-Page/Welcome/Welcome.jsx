import styles from "./welcome.module.css";

function Welcome({ name }) {
  return <div className={styles.welcome}>WELCOME, {name || "HOST"}</div>;
}

export default Welcome;
