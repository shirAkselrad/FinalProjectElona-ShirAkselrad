import styles from "./title.module.css";

function Title({ text }) {
  return <h1 className={styles.title}>{text}</h1>;
}

export default Title;
