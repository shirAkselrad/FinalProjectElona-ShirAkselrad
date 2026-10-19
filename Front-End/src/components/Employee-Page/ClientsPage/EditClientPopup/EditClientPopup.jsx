import styles from "./editClientPopup.module.css";
import InputLabel from "../../../General/InputLabel/InputLabel.jsx";
import EmptyInput from "../../../General/EmptyInput/EmptyInput.jsx";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn.jsx";
import Remove from "../../../General/Remove/Remove.jsx";
import * as Validation from "../../../../utils/inputValidation.js";
import useClientForm from "./useClientForm.js";

/**
 *
 * @returns EditClientPopup
 */
function EditClientPopup({ client, onClose, onSave }) {
  const {
    client: clientData,
    errors,
    handleInputChange,
    handleInputBlur,
    isFormValid,
  } = useClientForm(client);

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

  //The function validate the form and sends the updated clients details to back-end
  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid) return;

    const userData = {
      ...client,
      first_name: Validation.onlyFirstLetterCapital(clientData.first_name),
      last_name: Validation.onlyFirstLetterCapital(clientData.last_name),
      phone_num: clientData.phone_num,
      city: clientData.city.trim(),
      street: clientData.street.trim(),
      house_num: clientData.house_num,
    };
    const data = await updateClient(userData);
    if (data?.success) {
      onSave(userData);
      onClose();
    }
  }

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
              value={clientData.first_name}
              error={errors.first_name}
              maxLength={30}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
              onBlur={(e) => handleInputBlur("first_name", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <InputLabel text="LAST NAME" />
            <EmptyInput
              value={clientData.last_name}
              error={errors.last_name}
              maxLength={30}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
              onBlur={(e) => handleInputBlur("last_name", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <InputLabel text="PHONE NUMBER" />
            <EmptyInput
              value={clientData.phone_num}
              error={errors.phone_num}
              maxLength={10}
              onChange={(e) => handleInputChange("phone_num", e.target.value)}
              onBlur={(e) => handleInputBlur("phone_num", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <InputLabel text="CITY" />
            <EmptyInput
              value={clientData.city}
              maxLength={50}
              error={errors.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              onBlur={(e) => handleInputBlur("city", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <InputLabel text="STREET" />
            <EmptyInput
              value={clientData.street}
              error={errors.street}
              maxLength={50}
              onChange={(e) => handleInputChange("street", e.target.value)}
              onBlur={(e) => handleInputBlur("street", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <InputLabel text="HOUSE NUMBER" />
            <EmptyInput
              value={clientData.house_num}
              error={errors.house_num}
              maxLength={5}
              onChange={(e) => handleInputChange("house_num", e.target.value)}
              onBlur={(e) => handleInputBlur("house_num", e.target.value)}
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
