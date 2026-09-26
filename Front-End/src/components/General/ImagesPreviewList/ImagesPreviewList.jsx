import styles from "./imagesPreviewList.module.css";
import ImagePreview from "../ImagePreview/ImagePreview.jsx";

/**
 * This component displays all the images of the current product
 * @param {array} props.images all the images of the product
 * @param {function} props.onRemove this function removes a specific image from the images array
 * @returns {JSX.Element}
 */
function ImagesPreviewList({ images, onRemove }) {
  return (
    <div className={styles.container}>
      {images.map((image, index) => {
        let src = null;
        let name = null;
        {
          /** checking if the current img is a file front the user computer or an img which is saved in the data base */
        }
        if (image.file instanceof File) {
          src = URL.createObjectURL(image.file);
          name = image.file.name;
        } else {
             src = `http://localhost:3001/src/assets/productsFiles/${image.auto_file_name}`;
          name = image.file_name;
        }

        console.log("IMAGE:", image);
        console.log("SRC:", src);

        return (
          <ImagePreview
            key={index}
            src={src}
            name={name}
            onRemove={image.frontImg === 1 ? null : () => onRemove(index)}
          />
        );
      })}
    </div>
  );
}

export default ImagesPreviewList;
