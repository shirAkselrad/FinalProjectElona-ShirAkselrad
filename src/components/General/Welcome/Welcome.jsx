import styles from "./welcome.module.css";

function Welcome({ name = "Host" }) {
  return <div className={styles.welcome}>Welcome, {name}</div>;
}

export default Welcome;
