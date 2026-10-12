import styles from "./imageArrows.module.css";
function ImageArrows({ onNext, onPrev }) {
  return (
    <div>
      <button
        type="button"
        className={`${styles.arrow} ${styles.prevArrow}`}
        onClick={onPrev}
        aria-label="Previous image"
      >
        ‹
      </button>

      <button
        type="button"
        className={`${styles.arrow} ${styles.nextArrow}`}
        onClick={onNext}
        aria-label="Next image"
      >
        ›
      </button>
    </div>
  );
}
export default ImageArrows;
