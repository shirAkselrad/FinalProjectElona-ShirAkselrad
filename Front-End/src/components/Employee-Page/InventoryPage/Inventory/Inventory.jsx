import styles from "./inventory.module.css";
import SearchBar from "../../../General/SearchBar/SearchBar";
import InventoryTable from "../InventoryTable/InventoryTable";
import SectionTitle from "../../SectionTitle/SectionTitle";
import CategoriesTable from "../CategoriesManagement/CategoriesTable/CategoriesTable.jsx";
import ManagementFilters from "../../../General/ManagmentFilters/ManagementFilters.jsx";
import ManagementLegend from "../../../General/ManagementLegend/ManagementLegend.jsx";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn.jsx";
import AddProduct from "../AddProductPopup/AddProduct/AddProduct.jsx";
import AddCategoryPopup from "../../../Manager-Page/ProductCategory/AddCategoryPopup/AddCategoryPopup.jsx";
import { useState, useEffect } from "react";

function Inventory({ isManager = false }) {
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedStock, setSelectedStock] = useState("All Stock");
  const [searchValue, setSearchValue] = useState("");

  const [refresh, setRefresh] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const [statusOptions, setStatusOptions] = useState(["All Statuses"]);
  const [stockOptions, setStockOptions] = useState(["All Stock"]);

  async function getFilterOptions() {
    try {
      const url = isManager
        ? "/api/manager/inventory/filterOptions"
        : "/api/employee/inventory/filterOptions";

      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (data.success) {
        setStatusOptions(["All Statuses", ...data.statuses]);
        setStockOptions(["All Stock", ...data.stocks]);
      }
    } catch (error) {
      console.error("Error getting filter options:", error);
    }
  }

  async function getInventory() {
    try {
      const url = isManager
        ? "/api/manager/inventory"
        : "/api/employee/inventory";

      const params = new URLSearchParams({
        category: selectedCategory,
        type: selectedType,
        status: selectedStatus,
        stock: selectedStock,
        search: searchValue,
      });

      const response = await fetch(`${url}?${params}`, {
        method: "GET",
      });

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
      console.error("Error getting categories:", error);
    }
  }

  useEffect(() => {
    getCategories();
    getFilterOptions();
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

  //updates inventory after editing a product
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

  //updates product images
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
        body: JSON.stringify({ imgsData }),
      });

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error("Error updating product images:", error);
      return false;
    }
  }

  //updates inventory after changing product status
  const onRemove = (invToRemove) => {
    setInventory((prev) =>
      prev.map((inv) =>
        inv.product_id === invToRemove.product_id
          ? { ...inv, status: invToRemove.status }
          : inv,
      ),
    );

    setRefresh((prev) => prev + 1);
  };

  //refreshes inventory after adding a product
  function handleProductAdded() {
    setShowAddProduct(false);
    setRefresh((prev) => prev + 1);
  }

  //refreshes categories after adding a category
  function handleCategoryAdded() {
    setShowAddCategory(false);
    getCategories();
  }

  const categoryOptions = [
    "All Categories",
    ...categories.map((category) => category.name),
  ];

  const selectedCategoryData = categories.find(
    (category) => category.name === selectedCategory,
  );

  const typeOptions = [
    "All Types",
    ...(selectedCategoryData?.types || []).map((type) => type.name),
  ];

  const filters = [
    {
      title: "CATEGORY",
      options: categoryOptions,
      selected: selectedCategory,
      setSelected: (category) => {
        setSelectedCategory(category);
        setSelectedType("All Types");
      },
      defaultValue: "All Categories",
    },
    {
      title: "TYPE",
      options: typeOptions,
      selected: selectedType,
      setSelected: setSelectedType,
      defaultValue: "All Types",
      nested: true,
    },
    {
      title: "STATUS",
      options: statusOptions,
      selected: selectedStatus,
      setSelected: setSelectedStatus,
      defaultValue: "All Statuses",
    },
    {
      title: "STOCK",
      options: stockOptions,
      selected: selectedStock,
      setSelected: setSelectedStock,
      defaultValue: "All Stock",
    },
  ];

  const lowStockCount = inventory.filter(
    (inv) =>
      Number(inv.quantity) > 0 &&
      Number(inv.restock_required) === 1 &&
      Number(inv.quantity) <= Number(inv.min_stock ?? 0),
  ).length;

  const outOfStockCount = inventory.filter(
    (inv) => Number(inv.quantity) === 0,
  ).length;

  const normalStockCount = inventory.filter(
    (inv) =>
      Number(inv.quantity) > 0 &&
      (Number(inv.restock_required ?? 0) !== 1 ||
        Number(inv.quantity) > Number(inv.min_stock ?? 0)),
  ).length;

  const activeFilterCount = filters.filter(
    (filter) => filter.selected !== filter.defaultValue,
  ).length;

  const legendItems = [
    {
      label: "Out of Stock",
      count: outOfStockCount,
      className: styles.outOfStock,
    },
    {
      label: "Low Stock",
      count: lowStockCount,
      className: styles.lowStock,
    },
    {
      label: "Normal Stock",
      count: normalStockCount,
      className: styles.normalStock,
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

      <div className={styles.inventoryToolbar}>
        <ManagementLegend items={legendItems} />

        <div className={styles.filtersArea}>
          <GeneralBtn
            type="button"
            text={`Filters${activeFilterCount ? ` (${activeFilterCount})` : ""} ${
              showFilters ? "−" : "+"
            }`}
            className={`${styles.filtersToggle} ${
              showFilters ? styles.filtersToggleActive : ""
            }`}
            onClick={() => setShowFilters((prev) => !prev)}
          />

          <GeneralBtn
            type="button"
            text="+ ADD PRODUCT"
            className={styles.addProduct}
            onClick={() => setShowAddProduct(true)}
          />

          {isManager && (
            <GeneralBtn
              type="button"
              text="+ ADD CATEGORY"
              className={styles.addProduct}
              onClick={() => setShowAddCategory(true)}
            />
          )}

          {showFilters && (
            <div className={styles.filtersDropdown}>
              <ManagementFilters title="FILTER INVENTORY" filters={filters} />
            </div>
          )}
        </div>
      </div>

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

      {showAddProduct && (
        <AddProduct
          onClose={() => setShowAddProduct(false)}
          onProductAdded={handleProductAdded}
          isManager={isManager}
        />
      )}

      {isManager && showAddCategory && (
        <AddCategoryPopup
          onClose={() => setShowAddCategory(false)}
          onRefreshCategories={handleCategoryAdded}
        />
      )}
    </div>
  );
}

export default Inventory;
