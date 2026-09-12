import styles from "./inventory.module.css";
import AddProductPopup from "../AddProductPopup/AddProductPopup.jsx";
import SearchBar from "../../../General/SearchBar/SearchBar.jsx";
import InventoryTable from "../InventoryTable/InventoryTable.jsx";
import SectionTitle from "../../SectionTitle/SectionTitle.jsx";
import { useState, useEffect } from "react";

/**
 *
 * @param {inventory} inventory array
 * @returns Inventory
 */
function Inventory() {
  const [inventory, setInventory] = useState([]);
  async function getInventory() {
    const response = await fetch("/api/employee/inventory");
    const data = await response.json();
    if (data.success) setInventory(data.inventory);
  }
  useEffect(() => {
    getInventory();
  }, []);

  const [showPopup, setShowPopup] = useState(false);

  function handleOpenPopup() {
    setShowPopup(true);
  }

  function handleClosePopup() {
    setShowPopup(false);
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

  //This function removes the inv which it's remove btn was pressed
const onRemove = (invToRemove) => {
  const updatedInventory = inventory.map((inv) =>
    inv.product_id === invToRemove.product_id? { ...inv, removed: !inv.removed } : inv,
  );

  setInventory(updatedInventory);
};
  return (
    <div className={styles.inventory}>
      <div className={styles.top}>
        <SectionTitle title="Inventory" />

        <div className={styles.topActions}>
          <button className={styles.saveBtn}>SAVE</button>

          <button onClick={handleOpenPopup} className={styles.addProduct}>
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
        onRemove={onRemove}
        inventory={filterInventory}
      />
      {showPopup && <AddProductPopup onClose={handleClosePopup} />}
    </div>
  );
}

export default Inventory;
