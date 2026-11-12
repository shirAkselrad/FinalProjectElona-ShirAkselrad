import styles from "./pageIntro.module.css";

function PageIntro({ title, description }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>

      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}

export default PageIntro;
