import styles from "./orderSummaryClientDetails.module.css";
import InputLabel from "../../../General/InputLabel/InputLabel";
import EmptyInput from "../../../General/EmptyInput/EmptyInput";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn";
import useClientForm from "../../../Employee-Page/ClientsPage/EditClientPopup/useClientForm";
import * as Validation from "../../../../utils/inputValidation.js";

function OrderSummaryClientDetails({ client, onSave, onContinue, onBack }) {
  const {
    client: clientData,
    errors,
    handleInputChange,
    handleInputBlur,
    isFormValid,
  } = useClientForm(client);

  async function updateClient(clientData) {
    try {
      const response = await fetch("/api/client/updateDetails", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error updating client details: ", error);
      return null;
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid) return;

    const updatedClient = {
      first_name: Validation.onlyFirstLetterCapital(clientData.first_name),
      last_name: Validation.onlyFirstLetterCapital(clientData.last_name),
      phone_num: clientData.phone_num,
      city: Validation.onlyFirstLetterCapital(clientData.city),
      street: Validation.onlyFirstLetterCapital(clientData.street),
      house_num: clientData.house_num,
    };

    const data = await updateClient(updatedClient);
    if (data?.success) {
      onSave(updatedClient);
      onContinue();
    }
  }

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>CLIENT DETAILS</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fields}>
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
              error={errors.city}
              maxLength={50}
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
        </div>

        <div className={styles.save}>
          <div className={styles.actions}>
            <GeneralBtn
              type="button"
              text="BACK TO SHOP"
              onClick={onBack}
              className={styles.backButton}
            />

            <GeneralBtn
              type="submit"
              text="SAVE AND CONTINUE TO PAYMENT"
              disabled={!isFormValid}
              className={styles.paymentButton}
            />
          </div>
        </div>
      </form>
    </section>
  );
}
export default OrderSummaryClientDetails;
