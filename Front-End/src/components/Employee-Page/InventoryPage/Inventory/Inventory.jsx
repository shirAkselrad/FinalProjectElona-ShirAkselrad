import styles from "./inventory.module.css";
import AddProduct from "../AddProductPopup/AddProduct/AddProduct.jsx";
import SearchBar from "../../../General/SearchBar/SearchBar.jsx";
import InventoryTable from "../InventoryTable/InventoryTable.jsx";
import SectionTitle from "../../SectionTitle/SectionTitle.jsx";
import MessagePopup from "../../../General/MessagePopup/MessagePopup.jsx";
import { useState, useEffect } from "react";

/**
 *
 * @param {inventory} inventory array
 * @returns Inventory
 */
function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  async function getInventory() {
    const response = await fetch("/api/employee/inventory");
    const data = await response.json();
    if (data.success) setInventory(data.inventory);
  }
  useEffect(() => {
    getInventory();
  }, []);

  const [showPopupAdd, setShowPopupAdd] = useState(false);

  function handleOpenPopupAdd() {
    setShowPopupAdd(true);
  }

  function handleClosePopupAdd() {
    setShowPopupAdd(false);
  }

  // This part is responsible for the search filter in the inventory table begins empty as default
  const [searchValue, setSearchValue] = useState("");

  //for the search bar
  const filterInventory = inventory.filter((inv) =>
    inv.name.includes(searchValue),
  );

  //This function save all the changes while clicking on the SAVE button
  const onSave = (editedInv) => {
    const updatedInventory = inventory.map((inv) =>
      inv.product_id === editedInv.product_id ? editedInv : inv,
    );
    setInventory(updatedInventory);
  };

  //This function update the product images after pressing the save btn at the images popup
  async function onSaveImgs(product_id, imgsData) {
    try {
      const response = await fetch(
        `/api/employee/deleteProductImgs/${product_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imgsData: imgsData,
          }),
        },
      );
      const data = await response.json();
      if (data?.success) {
        //displaying a popup according to the success status
        setPopup({
          show: true,
          message: "Product images deleted successfully",
          type: "success",
        });
        return true;
      } else {
        setPopup({
          show: true,
          message: "Couldn't delete product's images",
          type: "error",
        });
        return false;
      }
    } catch (error) {
      setPopup({
        show: true,
        message: "Couldn't delete product's images",
        type: "error",
      });
      return false;
    }
  }

  //This function removes the inv which it's remove btn was pressed
  const onRemove = (invToRemove) => {
    const updatedInventory = inventory.map((inv) =>
      inv.product_id === invToRemove.product_id
        ? { ...inv, status: invToRemove.status }
        : inv,
    );

    setInventory(updatedInventory);
  };
  return (
    <div className={styles.inventory}>
      {/**opening a popup according to the success status  */}
      {popup.show && (
        <MessagePopup
          message={popup.message}
          type={popup.type}
          onClose={() => {
            setPopup({
              show: false,
              message: "",
              type: "",
            });
          }}
        />
      )}
      <div className={styles.top}>
        <SectionTitle title="Inventory" />

        <div className={styles.topActions}>
          <button onClick={handleOpenPopupAdd} className={styles.addProduct}>
            + ADD PRODUCT
          </button>
        </div>
      </div>

      <div className={styles.search}>
        {/*The search bar will return the value which has been search and will store it in the searchValue for filtering when the rendering accure */}
        <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>

      {/*The onSave and onRemove will operate only when the save and remove btns will be click */}
      <InventoryTable
        onSave={onSave}
        onSaveImgs={onSaveImgs}
        onRemove={onRemove}
        inventory={filterInventory}
      />
      {showPopupAdd && (
        <AddProduct
          onClose={handleClosePopupAdd}
          onProductAdded={getInventory}
        />
      )}
    </div>
  );
}

export default Inventory;
