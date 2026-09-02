import styles from "./editInventoryPopup.module.css";

import InputLabel from "../../../General/InputLabel/InputLabel.jsx";
import EmptyInput from "../../../General/EmptyInput/EmptyInput.jsx";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn.jsx";
import Remove from "../../../General/Remove/Remove.jsx";
import { useState } from "react";

/**
 *
 * @param {inv} inv the current inv to be edit
 * @param {onSave} onSave the event which will accure when the user will click on the save btn
 * @param {onClose} onClose the even which will accure when the use will click on the x btn
 * @returns EditInventoryPopup
 */
function EditInventoryPopup({ inv, onSave, onClose }) {
  //state which will save the inv after the update
  const [invToUpdate, setInvToUpdate] = useState(inv);

  //keep the changes of the current edited inv
  const updateInv = (field, value) => {
    const editedInv = {
      ...invToUpdate,
      [field]: value,
    };

    setInvToUpdate(editedInv);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.top}>
          <h2 className={styles.title}>Edit Product</h2>
          <Remove onClick={onClose} className={styles.closeBtn} />
        </div>

        <div className={styles.form}>
          <div className={styles.field}>
            <InputLabel text="PRODUCT NAME" />
            {/**for each empty input there is onChange event which takes the value enter to the invToUpdate function by the editedInv variable when the user press save  */}
            <EmptyInput
              value={invToUpdate.name}
              onChange={(e) => updateInv("name", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <InputLabel text="CATEGORY" />
            <EmptyInput
              value={invToUpdate.category}
              onChange={(e) => updateInv("category", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <InputLabel text="PRICE" />
            <EmptyInput
              value={invToUpdate.price}
              onChange={(e) => updateInv("price", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <InputLabel text="STOCK" />
            <EmptyInput
              value={invToUpdate.stock}
              onChange={(e) => updateInv("stock", e.target.value)}
            />
          </div>

          <div className={styles.save}>
            <GeneralBtn
              text="SAVE CHANGES"
              onClick={() => {
                onSave(invToUpdate);
                onClose();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditInventoryPopup;
