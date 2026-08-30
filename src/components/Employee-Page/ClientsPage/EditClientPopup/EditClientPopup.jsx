import styles from "./editClientPopup.module.css";

import InputLabel from "../../../General/InputLabel/InputLabel.jsx";
import EmptyInput from "../../../General/EmptyInput/EmptyInput.jsx";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn.jsx";
import Remove from "../../../General/Remove/Remove.jsx";
import GeneralSelection from "../../../General/GeneralSelection/GeneralSelection.jsx";
import * as Validation from "../../../../utils/inputValidation.js";
import { useState } from "react";

/**
 *
 * @returns EditClientPopup
 */
function EditClientPopup({ client, onClose, onSave }) {
  //The function sends all the inputs values to backend for updating an existing client
  async function updateClient(clientData) {
    try {
      const response = await fetch("/api/employee/updateClient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("error updating client's details: ", error);
    }
  }

  //state which will save the client details after the update
  const [clientToUpdate, setClientToUpdate] = useState(client);

  //state variable which holds all the errors which might accore while updating
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    phone_num: "",
    city: "",
    street: "",
    house_num: "",
    email: "",
    status: "",
  });

  //The function check if the form is valid if it does, call the createUser function
  async function handleSubmit(e) {
    e.preventDefault();

    if (!isFormValid) return;
    const userData = {
      first_name: Validation.onlyFirstLetterCapital(clientToUpdate.first_name),
      last_name: Validation.onlyFirstLetterCapital(clientToUpdate.last_name),
      user_id: clientToUpdate.user_id,
      city: Validation.onlyFirstLetterCapital(clientToUpdate.city),
      street: Validation.onlyFirstLetterCapital(clientToUpdate.street),
      house_num: clientToUpdate.house_num,
      email: clientToUpdate.email,
      phone_num: clientToUpdate.phone_num,
      status: clientToUpdate.status,
    };

    const data = await updateClient(userData);
    if (data.success) {
      onSave(clientToUpdate);
      onClose();
    }
  }

  //checking that the user doesn't have any empty inputs before sending to info to backend
  const allUserFieldsFilled = Object.values(clientToUpdate).every(
    (value) => value !== "",
  );

  //checking there is no errors in the inputs before sending it to backend
  const noErrors = Object.values(errors).every((error) => error === "");

  //checks if there is no errors or empty inputs before sending to backend
  const isFormValid = allUserFieldsFilled && noErrors;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.top}>
          <h2 className={styles.title}>Edit Client</h2>
          <Remove onClick={onClose} className={styles.closeBtn} />
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <InputLabel text="FIRST NAME" />
            <EmptyInput
              value={clientToUpdate.first_name}
              error={errors.first_name}
              maxLength={30}
              onChange={(e) => {
                setClientToUpdate({
                  ...clientToUpdate,
                  first_name: e.target.value,
                });
                if (Validation.checkStr(e.target.value)) {
                  setErrors({
                    ...errors,
                    first_name: "",
                  });
                }
              }}
              onBlur={(e) => {
                if (!Validation.checkStr(e.target.value)) {
                  setErrors({
                    ...errors,
                    first_name: "Only letters and spaces are allowed",
                  });
                } else {
                  setErrors({
                    ...errors,
                    first_name: "",
                  });
                }
              }}
            />
          </div>

          <div className={styles.field}>
            <InputLabel text="LAST NAME" />
            <EmptyInput
              value={clientToUpdate.last_name}
              error={errors.last_name}
              maxLength={30}
              onChange={(e) => {
                setClientToUpdate({
                  ...clientToUpdate,
                  last_name: e.target.value,
                });
                if (Validation.checkStr(e.target.value)) {
                  setErrors({
                    ...errors,
                    last_name: "",
                  });
                }
              }}
              onBlur={(e) => {
                if (!Validation.checkStr(e.target.value)) {
                  setErrors({
                    ...errors,
                    last_name: "Only letters and spaces are allowed",
                  });
                } else {
                  setErrors({
                    ...errors,
                    last_name: "",
                  });
                }
              }}
            />
          </div>

          <div className={styles.field}>
            <InputLabel text="PHONE NUMBER" />
            <EmptyInput
              value={clientToUpdate.phone_num}
              error={errors.phone_num}
              maxLength={10}
              onChange={(e) => {
                setClientToUpdate({
                  ...clientToUpdate,
                  phone_num: e.target.value,
                });
                if (Validation.checkPhoneNum(e.target.value)) {
                  setErrors({
                    ...errors,
                    phone_num: "",
                  });
                }
              }}
              onBlur={(e) => {
                if (!Validation.checkPhoneNum(e.target.value)) {
                  setErrors({
                    ...errors,
                    phone_num: "Invalid phone number format",
                  });
                } else {
                  setErrors({
                    ...errors,
                    phone_num: "",
                  });
                }
              }}
            />
          </div>

          <div className={styles.field}>
            <InputLabel text="CITY" />
            <EmptyInput
              value={clientToUpdate.city}
              maxLength={50}
              error={errors.city}
              onChange={(e) => {
                setClientToUpdate({
                  ...clientToUpdate,
                  city: e.target.value,
                });
                if (Validation.checkStr(e.target.value)) {
                  setErrors({
                    ...errors,
                    city: "",
                  });
                }
              }}
              onBlur={(e) => {
                if (!Validation.checkStr(e.target.value)) {
                  setErrors({
                    ...errors,
                    city: "Only letters and spaces are allowed",
                  });
                } else {
                  setErrors({
                    ...errors,
                    city: "",
                  });
                }
              }}
            />
          </div>

          <div className={styles.field}>
            <InputLabel text="STREET" />
            <EmptyInput
              value={clientToUpdate.street}
              error={errors.street}
              maxLength={50}
              onChange={(e) => {
                setClientToUpdate({
                  ...clientToUpdate,
                  street: e.target.value,
                });
                if (Validation.checkStr(e.target.value)) {
                  setErrors({
                    ...errors,
                    street: "",
                  });
                }
              }}
              onBlur={(e) => {
                if (!Validation.checkStr(e.target.value)) {
                  setErrors({
                    ...errors,
                    street: "Only letters and spaces are allowed",
                  });
                } else {
                  setErrors({
                    ...errors,
                    street: "",
                  });
                }
              }}
            />
          </div>

          <div className={styles.field}>
            <InputLabel text="HOUSE NUMBER" />
            <EmptyInput
              value={clientToUpdate.house_num}
              error={errors.house_num}
              maxLength={5}
              onChange={(e) => {
                setClientToUpdate({
                  ...clientToUpdate,
                  house_num: e.target.value,
                });
                if (Validation.onlyNumbers(e.target.value)) {
                  setErrors({
                    ...errors,
                    house_num: "",
                  });
                }
              }}
              onBlur={(e) => {
                if (!Validation.onlyNumbers(e.target.value)) {
                  setErrors({
                    ...errors,
                    house_num: "Only numbers allowed",
                  });
                } else {
                  setErrors({
                    ...errors,
                    house_num: "",
                  });
                }
              }}
            />
          </div>

          <div className={styles.field}>
            <InputLabel text="EMAIL" />
            <EmptyInput
              value={clientToUpdate.email}
              error={errors.email}
              maxLength={100}
              onChange={(e) => {
                setClientToUpdate({
                  ...clientToUpdate,
                  email: e.target.value,
                });
                if (Validation.checkEmail(e.target.value)) {
                  setErrors({
                    ...errors,
                    email: "",
                  });
                }
              }}
              onBlur={(e) => {
                if (!Validation.checkEmail(e.target.value)) {
                  setErrors({
                    ...errors,
                    email: "Inavlid email format",
                  });
                } else {
                  setErrors({
                    ...errors,
                    email: "",
                  });
                }
              }}
            />
          </div>

          <div className={styles.field}>
            <InputLabel text="STATUS" />
            <GeneralSelection
              value={clientToUpdate.status}
              options={["Active", "Not Active"]}
              onChange={(e) => {
                setClientToUpdate({
                  ...clientToUpdate,
                  status: e.target.value,
                });
              }}
            />
          </div>

          <div className={styles.save}>
            <GeneralBtn
              type="submit"
              text="SAVE CHANGES"
              disabled={!isFormValid}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditClientPopup;
