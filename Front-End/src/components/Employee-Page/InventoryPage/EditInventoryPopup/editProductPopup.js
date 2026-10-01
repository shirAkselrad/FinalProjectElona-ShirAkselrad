import { useState } from "react";

function useEditProductImgs(setProductImgs) {
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "",
  });
  //This function gets an existing products images and add new product's images to the images array (while checking legal extensions)
  function handleAddFiles(files) {
    const filesToAdd = Array.from(files);
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

    //checking if the uploaded files are legal by checking the extensions
    const allowedFiles = filesToAdd.filter((file) =>
      allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext)),
    );

    setProductImgs((prev) => {
      const newFiles = allowedFiles.filter((newFile) => {
        //checking rather the file already exists in data base
        return !prev.some((existingImg) => {
          if (!(existingImg.file instanceof File)) {
            return existingImg.file_name === newFile.name;
          }

          //checking if the same image wasn't uploaded more than once
          return (
            existingImg.file.name === newFile.name &&
            existingImg.file.size === newFile.size &&
            existingImg.file.lastModified === newFile.lastModified
          );
        });
      });

      const newFilesWithId = newFiles.map((file) => ({
        id: crypto.randomUUID(),
        file: file,
      }));
      const duplicateFlag = newFiles.length < allowedFiles.length;
      if (duplicateFlag) {
        setPopup({
          show: true,
          message: "Some images were already added and were skipped",
          type: "info",
        });
      }

      return [...prev, ...newFilesWithId];
    });
  }

  return {
    handleAddFiles,
    popup,
    setPopup,
  };
}

export default useEditProductImgs;
