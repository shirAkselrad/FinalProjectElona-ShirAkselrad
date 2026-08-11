import styles from "./elona.module.css";
import elonaPhoto from "../../../assets/Photo-Elona.png";

function Elona() {
  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <img src={elonaPhoto} alt="Lea Elona Weiss" className={styles.image} />
      </div>

      <p className={styles.caption}>Lea (Elona) Weiss</p>
    </div>
  );
}

export default Elona;
