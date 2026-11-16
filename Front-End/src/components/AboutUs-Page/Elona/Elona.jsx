import styles from "./elona.module.css";
import elonaPhoto from "../../../assets/Photo-Elona.png";

function Elona() {
  return (
    <figure className={styles.container}>
      <div className={styles.imageWrapper}>
        <img
          src={elonaPhoto}
          alt="Elona (Lea) Weiss"
          className={styles.image}
        />
      </div>

      <figcaption className={styles.caption}>
        Elona (Lea) Weiss
        <span>1927 – 2021</span>
      </figcaption>
    </figure>
  );
}

export default Elona;
