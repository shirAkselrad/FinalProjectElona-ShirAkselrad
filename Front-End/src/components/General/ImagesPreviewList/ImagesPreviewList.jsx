import styles from "./imagesPreviewList.module.css";
import ImagePreview from "../ImagePreview/ImagePreview.jsx";

function ImagesPreviewList({ images, onRemove }) {
  return (
    <div className={styles.container}>
      {images.map((image, index) => (
        <ImagePreview
          key={index}
          src={URL.createObjectURL(image)}
          name={image.name}
          onRemove={() => onRemove(index)}
        />
      ))}
    </div>
  );
}

export default ImagesPreviewList;
