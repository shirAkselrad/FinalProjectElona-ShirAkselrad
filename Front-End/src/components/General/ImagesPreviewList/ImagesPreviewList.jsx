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
function ImagesPreviewList({ images, onRemove, onReorder, editable = false }) {
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
        draggable={editable}
        //while starting dragging- saving the index of the image that is being dragged
        onDragStart={editable ? () => setDraggedIndex(index) : undefined}
        //helps dropping the image
        onDragOver={editable ? (e) => e.preventDefault() : undefined}
        //while dropping the image making the index changes
        onDrop={
          editable
            ? () => {
                //in case we we don't know which image's index is being dragged/ no change at the places (dragging 2 to 2)
                if (draggedIndex == null || draggedIndex == index) return;

                //changing the position of the dragged image
                onReorder(draggedIndex, index);

                //now no image is being dragged so back to null
                setDraggedIndex(null);
              }
            : undefined
        }
      >
        <ImagePreview
          src={src}
          name={image.file_name}
          onRemove={editable ? () => onRemove(index) : undefined}
        />
      </div>
    );
  });

  return (
    <div className={styles.container}>
      {editable && (
        <div
          className={styles.startDropArea}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (draggedIndex == null) return;

            onReorder(draggedIndex, 0);
            setDraggedIndex(null);
          }}
        />
      )}

      {imagesPreview}

      {editable && (
        <div
          className={styles.endDropArea}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (draggedIndex == null) return;

            onReorder(draggedIndex, images.length - 1);
            setDraggedIndex(null);
          }}
        />
      )}
    </div>
  );
}

export default ImagesPreviewList;
