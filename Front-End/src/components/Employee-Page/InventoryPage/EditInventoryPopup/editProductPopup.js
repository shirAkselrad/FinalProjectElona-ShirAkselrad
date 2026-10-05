import { useState } from "react";

export function checkFormValidation(errors, editedProduct, productImgs) {
  const noErrors = Object.values(errors).every((error) => error == "");
  const noEmptyInputs =
    editedProduct.name !== "" &&
    editedProduct.category !== "None" &&
    editedProduct.size !== "None" &&
    editedProduct.country_origin !== "None" &&
    editedProduct.colors.length > 0 &&
    editedProduct.price !== "" &&
    editedProduct.cost_price !== "" &&
    editedProduct.quantity !== "" &&
    editedProduct.min_stock !== "" &&
    editedProduct.discount !== "" &&
    editedProduct.min_sales !== "" &&
    editedProduct.sales_check_date !== "" &&
    editedProduct.description !== "";
  const hasImages = productImgs.length > 0;
  return noErrors && noEmptyInputs && hasImages;
}

async function calculateFileHash(file) {
  const buffer = await file.arrayBuffer(); //converting file to a binary data
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer); //getting the sha-256 (bit) algorithem and calculating the hash of the binary data

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join(""); // converting the hash to hex string formate
}
function useEditProductImgs(setProductImgs, frontImg, setFrontImg) {
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "",
  });
  //This function gets an existing products images and add new product's images to the images array (while checking legal extensions)
  async function handleAddFiles(files) {
    const filesToAdd = Array.from(files);
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

    //checking if the uploaded files are legal by checking the extensions
    const allowedFiles = filesToAdd.filter((file) =>
      allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext)),
    );

    //calculating for each of the images that have been uploaded by the user the hash value, later for checking duplacting images
    const filesWithHash = [];
    for (const file of allowedFiles) {
      const fileHash = await calculateFileHash(file);
      filesWithHash.push({
        file: file,
        file_hash: fileHash,
      });
    }

    setProductImgs((prev) => {
      //checking duplicate images by comparing the hash value of the images
      const newFiles = filesWithHash.filter((newFile) => {
        return !prev.some((existingImg) => {
          return existingImg.file_hash === newFile.file_hash;
        });
      });

      //creating the structure for saving the images
      const newFilesWithId = newFiles.map((newFile) => ({
        id: crypto.randomUUID(), //only for map at front-end
        file: newFile.file,
        file_hash: newFile.file_hash,
        frontImg: 0,
      }));

      //the flag which open the info popup that tells the user rather some images are the same
      const duplicateFlag = newFiles.length < filesWithHash.length;
      if (duplicateFlag) {
        setPopup({
          show: true,
          message: "Some images were already added and were skipped",
          type: "info",
        });
      }

      //If there are no existing images, the first uploaded image will be the frontImg by default
      if (prev.length === 0 && newFilesWithId.length > 0) {
        newFilesWithId[0].frontImg = 1;
        setFrontImg(newFilesWithId[0].id);
        setPopup({
          show: true,
          message: `${newFilesWithId[0].file.name} will be the front image of the product by default`,
          type: "info",
        });
      }
      return [...prev, ...newFilesWithId];
    });
  }

  //This function update the selected frontImg by the user in the productsImgs array. also, keeps the id of the frontImg in a state variable
  function handleFrontImgChange(selectedId) {
    setFrontImg(selectedId);
    setProductImgs((prev) =>
      prev.map((img) => ({
        ...img,
        frontImg: img.id === selectedId ? 1 : 0,
      })),
    );
  }

  //this function resposible of removing the chosen images by the user (in case the chosen img is a frontImg takes care of the frontImg state variable )
  function handleRemoveFile(indexToRemove) {
    setProductImgs((prev) => {
      const imgToRemove = prev[indexToRemove];
      if (imgToRemove.id === frontImg) {
        setFrontImg("");
      }
      return prev.filter((img, index) => index !== indexToRemove);
    });
  }

  return {
    handleAddFiles,
    handleFrontImgChange,
    handleRemoveFile,
    popup,
    setPopup,
  };
}

export default useEditProductImgs;
