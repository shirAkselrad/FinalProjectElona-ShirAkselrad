import styles from "./inventory.module.css";
import SearchBar from "../../../General/SearchBar/SearchBar";
import InventoryTable from "../InventoryTable/InventoryTable";
import SectionTitle from "../../SectionTitle/SectionTitle";
import CategoriesTable from "../CategoriesManagement/CategoriesTable/CategoriesTable.jsx";
import ManagementFilters from "../../../General/ManagmentFilters/ManagementFilters.jsx";
import { useState, useEffect } from "react";
/**
 *
 * @param {inventory} inventory array
 * @returns Inventory
 */
function Inventory({ isManager = false }) {
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedStock, setSelectedStock] = useState("All Stock");
  const [searchValue, setSearchValue] = useState("");
  const [refresh, setRefresh] = useState(0);

  async function getInventory() {
    try {
      const url = isManager
        ? "/api/manager/inventory"
        : "/api/employee/inventory";
      const response = await fetch(
        `${url}?category=${selectedCategory}&type=${selectedType}&status=${selectedStatus}&stock=${selectedStock}&search=${searchValue}`,
        { method: "GET" },
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.success) setInventory(data.inventory);
    } catch (error) {
      console.error("Error getting inventory:", error);
    }
  }

  async function getCategories() {
    try {
      const url = isManager
        ? "/api/manager/getCategories"
        : "/api/employee/categories";
      const response = await fetch(url, {
        method: "GET",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success) setCategories(data.categories);
    } catch (error) {
      console.error("Error getting categories: ", error);
    }
  }

  useEffect(() => {
    getCategories();
  }, [isManager]);

  useEffect(() => {
    const timer = setTimeout(() => {
      getInventory();
    }, 300);
    return () => clearTimeout(timer);
  }, [
    selectedCategory,
    selectedType,
    selectedStatus,
    selectedStock,
    searchValue,
    isManager,
    refresh,
  ]);

  //This function save all the changes while clicking on the SAVE button
  const onSave = (editedInv) => {
    setInventory((prev) =>
      prev.map((inv) =>
        inv.product_id === editedInv.product_id
          ? { ...inv, ...editedInv }
          : inv,
      ),
    );
    setRefresh((prev) => prev + 1);
  };

  //This function update the product images after pressing the save btn at the images popup
  async function onSaveImgs(product_id, imgsData) {
    try {
      const url = isManager
        ? `/api/manager/deleteProductImgs/${product_id}`
        : `/api/employee/deleteProductImgs/${product_id}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imgsData: imgsData,
        }),
      });
      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error("Error updating product images: ", error);
    }
  }

  //This function removes the inv which it's remove btn was pressed
  const onRemove = (invToRemove) => {
    setInventory((prev) =>
      prev.map((inv) => inv.product_id === invToRemove.product_id)
        ? { ...inv, status: invToRemove.status }
        : inv,
    );
    setRefresh((prev) => prev + 1);
  };

  //Find the selected category
  const selectedCategoryData = categories.find(
    (category) => category.name === selectedCategory,
  );

  const typeOptions = [
    "All Types",
    ...new Set((selectedCategoryData?.types || []).map((type) => type.name)),
  ];

  const filters = [
    {
      title: "CATEGORY",
      options: [
        "All Categories",
        ...categories.map((category) => category.name),
      ],
      selected: selectedCategory,
      setSelected: (value) => {
        setSelectedCategory(value);
        setSelectedType("All Types");
      },
    },
    {
      title: "TYPE",
      options: typeOptions,
      selected: selectedType,
      setSelected: setSelectedType,
    },
    {
      title: "STATUS",
      options: ["All Statuses", "Active", "Not Active"],
      selected: selectedStatus,
      setSelected: setSelectedStatus,
    },
    {
      title: "STOCK",
      options: ["All Stock", "Normal Stock", "Low Stock", "Out of Stock"],
      selected: selectedStock,
      setSelected: setSelectedStock,
    },
  ];

  return (
    <div className={styles.inventory}>
      <div className={styles.top}>
        <SectionTitle title="Inventory" />
      </div>

      <div className={styles.search}>
        <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>

      <ManagementFilters title="FILTER INVENTORY" filters={filters} />

      {inventory.length > 0 ? (
        <InventoryTable
          onSave={onSave}
          onSaveImgs={onSaveImgs}
          onRemove={onRemove}
          inventory={inventory}
          isManager={isManager}
        />
      ) : (
        <div className={styles.noResults}>
          <h3>NO MATCHING PRODUCTS</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}

      <CategoriesTable
        categories={categories}
        isManager={isManager}
        onRefreshCategories={getCategories}
      />
    </div>
  );
}

export default Inventory;
