import { useState } from "react";
function useProductImages() {
  //this state variable hold all the products images info
  const [productImgs, setProductImgs] = useState([]);

  //this function gets all the files that have been uploaded from the file's input, convert them into array and sets it in the productImgs state variable
  function handleImagesChange(e) {
    const files = Array.from(e.target.files);

    //creating images format which will be prepared to be sent to back-end
    const newImages = files.map((file, index) => ({
      file_name: file.name,
      file: file,
      number: -1,
    }));

    setProductImgs((prev) => [...prev, ...newImages]);
  }

  //This function connect to the small x on each uploaded images, resposible to remove the exact unwanted image (taking care of indexing the remaining images)
  function handleRemoveImage(indexToRemove) {
    setProductImgs((prev) =>
      prev
        .filter((_, index) => index !== indexToRemove)
        .map((image, index) => ({
          ...image,
          number: index + 1,
        })),
    );
  }

  //This function connect to the Remove All btn which removes all the uploaded images
  function handleRemoveAllImages() {
    setProductImgs([]);
  }
  return {
    productImgs,
    handleImagesChange,
    handleRemoveImage,
    handleRemoveAllImages,
  };
}
export default useProductImages;
