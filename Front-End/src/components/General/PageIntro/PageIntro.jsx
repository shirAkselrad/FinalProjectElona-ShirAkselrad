import styles from "./pageIntro.module.css";

function PageIntro({ smallTitle, title, italicText, description }) {
  return (
    <div className={styles.container}>
      <p className={styles.smallTitle}>{smallTitle}</p>

      <h1 className={styles.title}>
        {title} <span>{italicText}</span>
      </h1>

      <div className={styles.decoration}>
        <span className={styles.line}></span>
        <span className={styles.diamond}></span>
        <span className={styles.line}></span>
      </div>

      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}

export default PageIntro;
