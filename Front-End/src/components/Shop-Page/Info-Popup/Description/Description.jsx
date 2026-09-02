import styles from "./description.module.css";

function Description({ text, materials }) {
  return (
    <div className={styles.description}>
      <p className={styles.text}>{text}</p>

      <h3 className={styles.title}>MATERIALS:</h3>

      <ul className={styles.materials}>
        {materials.map((material, index) => (
          <li key={index}>{material}</li>
        ))}
      </ul>
    </div>
  );
}

export default Description;
