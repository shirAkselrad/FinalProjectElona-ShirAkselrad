import styles from "./imagesPreviewList.module.css";
import ImagePreview from "../ImagePreview/ImagePreview.jsx";
import { useState } from "react";
/**
 * This component displays all the images of the current product
 * @param {array} props.images all the images of the product
 * @param {function} props.onRemove this function removes a specific image from the images array
 * @param {function} props.onReorder this function changes the images order
 * @returns {JSX.Element}
 */
function ImagesPreviewList({ images, onRemove, onReorder }) {
  //this state variable keeps which images are been dragged right now, at the begining no image are being dragged so null
  const [draggedIndex, setDraggedIndex] = useState(null);
  //giving an index for each image
  const imagesPreview = images.map((image, index) => {
    let src = null;
    if (image.file instanceof File) src = URL.createObjectURL(image.file);
    else src = image.path;
    return (
      //the object which is getting dragged
      <div
        key={index}
        draggable
        //while starting dragging- saving the index of the image that is being dragged
        onDragStart={() => setDraggedIndex(index)}
        //helps dropping the image
        onDragOver={(e) => e.preventDefault()}
        //while dropping the image making the index changes
        onDrop={() => {
          //in case we we don't know which image's index is being dragged/ no change at the places (dragging 2 to 2)
          if (draggedIndex == null || draggedIndex == index) return;
          //changing the position of the dragged image
          onReorder(draggedIndex, index);
          //now no image is being dragged so back to null
          setDraggedIndex(null);
        }}
      >
        <ImagePreview
          src={src}
          name={image.file_name}
          onRemove={() => onRemove(index)}
        />
      </div>
    );
  });
  return (
    <div className={styles.container}>
      <div
        className={styles.startDropArea}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => {
          if (draggedIndex == null) return;

          onReorder(draggedIndex, 0);
          setDraggedIndex(null);
        }}
      />

      {imagesPreview}

      <div
        className={styles.endDropArea}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => {
          if (draggedIndex == null) return;

          onReorder(draggedIndex, images.length - 1);
          setDraggedIndex(null);
        }}
      />
    </div>
  );
}

export default ImagesPreviewList;
