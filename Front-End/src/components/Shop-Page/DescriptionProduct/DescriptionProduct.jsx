import { useRef, useLayoutEffect } from "react";
import styles from "./descriptionProduct.module.css";

function DescriptionProduct({ category, name, description }) {
  const nameRef = useRef(null);

  useLayoutEffect(() => {
    const element = nameRef.current;
    if (!element) return;

    const adjustFontSize = () => {
      const maxSize = 24;
      const minSize = 14;

      let size = maxSize;
      element.style.fontSize = `${size}px`;

      while (element.scrollWidth > element.clientWidth && size > minSize) {
        size--;
        element.style.fontSize = `${size}px`;
      }
    };

    adjustFontSize();

    const observer = new ResizeObserver(adjustFontSize);
    observer.observe(nameRef.current);

    return () => observer.disconnect();
  }, [name]);

  return (
    <div className={styles.descriptionProduct}>
      <p className={styles.category}>{category}</p>

      <h2 ref={nameRef} className={styles.name}>
        {name}
      </h2>

      <p className={styles.description}>{description}</p>

      <div className={styles.line}></div>
    </div>
  );
}

export default DescriptionProduct;
