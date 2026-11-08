import styles from "./shopPage.module.css";
import MessagePopup from "../../General/MessagePopup/MessagePopup.jsx";
import SearchBar from "../../General/SearchBar/SearchBar.jsx";
import CategoryBtn from "../CategoryBtn/CategoryBtn.jsx";
import ProductsGrid from "../ProductsGrid/ProductsGrid.jsx";
import { useState, useEffect } from "react";
import { useCart } from "../../../context/CartContext.jsx";
import ProductPopup from "../ProductInfoPopup/ProductPopup/ProductPopup.jsx";
import PromotionBanner from "../PromotionBanner/PromotionBanner.jsx";
import FilterPanel from "../Filter/FilterPanel/FilterPanel.jsx";
import GeneralBtn from "../../General/GeneralBtn/GeneralBtn.jsx";
function ShopPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category_id: "",
    type_id: "",
    search: "",
    sort: "",
    minPrice: "",
    maxPrice: "",
    colors: [],
  });
  const [filterOptions, setFilterOptions] = useState({
    minPrice: 0,
    maxPrice: 0,
    colors: [],
  });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [frontImgs, setFrontImgs] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { getCartAmount } = useCart();

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "",
    autoClose: false,
  });

  //this function gets all the categories from BE
  async function getCategories() {
    try {
      const response = await fetch("/api/shop/getCategories", {
        method: "GET",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCategories(
        data.categories
          .filter((category) => category.status === "Active")
          .map((category) => ({
            ...category,
            types: category.types.filter((type) => type.status === "Active"),
          })),
      );
    } catch (error) {
      console.error("Couldn't get categories: ", error);
    }
  }

  //get avaliable filter options
  async function getFilterOptions() {
    try {
      const response = await fetch("/api/shop/getFilterOptions", {
        method: "GET",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log("Filter options:", data);
      if (data.success) {
        setFilterOptions({
          minPrice: data.minPrice,
          maxPrice: data.maxPrice,
          colors: data.colors,
        });
      }
    } catch (error) {
      console.error("Couldn't get filter options: ", error);
    }
  }

  //getting all the products from back end to front-end to be presented to the user
  async function getProducts() {
    try {
      const url = `/api/shop/getProducts?category_id=${filters.category_id}&type_id=${filters.type_id}&search=${encodeURIComponent(filters.search)}&sort=${filters.sort}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}&colors=${filters.colors.join(",")}`;
      const response = await fetch(url, {
        method: "GET",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (!data.success) {
        setPopup({
          show: true,
          message: data.message,
          type: "error",
        });
        return;
      }
      setProducts(
        data.products.map((product) => ({
          ...product,
          colors: product.colors
            ? product.colors.split(",").map((color) => color.trim())
            : [],
        })),
      );
    } catch (error) {
      console.log("Error getting products, error: ", error);
      setPopup({
        show: true,
        message: "Couldn't connect to the server",
        type: "error",
      });
    }
  }

  async function getFrontImgs() {
    try {
      const response = await fetch("/api/shop/getFrontImgs", {
        method: "GET",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setFrontImgs(data.imgs);
    } catch (error) {
      console.log("Error getting front imgs, error: ", error);
    }
  }

  async function getProductImgs(product_id) {
    try {
      const response = await fetch(`/api/shop/getProductImgs/${product_id}`, {
        method: "GET",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (!data.success) {
        setPopup({
          show: true,
          message: data.message,
          type: "error",
        });
        return null;
      }
      return data.imgs;
    } catch (error) {
      setPopup({
        show: true,
        message: "Couldn't get product images",
        type: "error",
      });
      return null;
    }
  }

  async function handleAddToCart(product, quantity) {
    try {
      const response = await fetch("/api/cart/addToCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: product.product_id,
          quantity: quantity,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setPopup({
          show: true,
          message: data.message,
          type: "error",
          autoClose: false,
        });
        return;
      }

      await getCartAmount();
      if (selectedProduct) {
        setSelectedProduct(null);
      } else showAddToCartMessage();
    } catch (error) {
      console.error("Error adding product to cart: ", error);
      setPopup({
        show: true,
        message: "Couldn't connect to the server",
        type: "error",
        autoClose: false,
      });
    }
  }

  //this function gets a product and save the product as the selected product to view all of it's details in the productInfoPopup
  async function handleViewDetails(product) {
    const images = await getProductImgs(product.product_id);
    if (images) {
      setSelectedProduct({
        ...product,
        images,
      });
    }
  }

  useEffect(() => {
    getFrontImgs();
    getCategories();
    getFilterOptions();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getProducts();
    }, 350);
     return () => clearTimeout(timeout);
  }, [filters]);

  //This function will display a popup which will be closed automaticly after the client added a product to the cart
  function showAddToCartMessage() {
    setPopup({
      show: true,
      message: "Product added to your cart!",
      type: "success",
      autoClose: true,
    });
  }

  const handleCategoryChange = (categoryId) => {
    setFilters((prev) => ({
      ...prev,
      category_id: categoryId,
      type_id: "",
    }));
  };

  const handleTypeChange = (typeId) => {
    setFilters((prev) => ({
      ...prev,
      type_id: typeId,
    }));
  };

  return (
    <div>
      <PromotionBanner />

      <div className={styles.shopPage}>
        {showFilters && (
          <div className={styles.filterPanelWrapper}>
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              filterOptions={filterOptions}
              onClose={() => setShowFilters(false)}
            />
          </div>
        )}
        <div className={styles.controls}>
          {popup.show && (
            <MessagePopup
              message={popup.message}
              type={popup.type}
              autoClose={popup.autoClose}
              onClose={() =>
                setPopup({
                  show: false,
                  message: "",
                  type: "",
                  autoClose: false,
                })
              }
            />
          )}

          <div className={styles.searchRow}>
            <GeneralBtn
              text="FILTER ☷"
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className={styles.filterBtn}
            />
            <SearchBar
              searchValue={filters.search}
              setSearchValue={(search) =>
                setFilters((prev) => ({ ...prev, search }))
              }
            />
          </div>

          <div className={styles.categories}>
            <CategoryBtn
              text="ALL"
              active={filters.category_id === ""}
              onClick={() => handleCategoryChange("")}
            />

            {categories.map((category) => (
              <CategoryBtn
                key={category.category_id}
                text={category.name.toUpperCase()}
                active={filters.category_id === category.category_id}
                onClick={() => handleCategoryChange(category.category_id)}
              />
            ))}
          </div>

          {filters.category_id !== "" && (
            <div className={styles.subcategories}>
              <CategoryBtn
                text="ALL TYPES"
                active={filters.type_id === ""}
                onClick={() => handleTypeChange("")}
              />

              {categories
                .find(
                  (category) => category.category_id === filters.category_id,
                )
                ?.types.filter((type) => type.status === "Active")
                .map((type) => (
                  <CategoryBtn
                    key={type.type_id}
                    text={type.name.toUpperCase()}
                    active={filters.type_id == type.type_id}
                    onClick={() => handleTypeChange(type.type_id)}
                  />
                ))}
            </div>
          )}
        </div>

        <div className={styles.productsSection}>
          <div className={styles.productsArea}>
            {products.length > 0 ? (
              <ProductsGrid
                products={products}
                frontImgs={frontImgs}
                onViewDetails={handleViewDetails}
                onAddToCart={handleAddToCart}
              />
            ) : (
              <div className={styles.noResults}>
                <h3>NO MATCHING PRODUCTS</h3>
                <p>Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>

        {selectedProduct && (
          <ProductPopup
            product={selectedProduct}
            images={selectedProduct.images}
            onAddToCart={handleAddToCart}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </div>
  );
}

export default ShopPage;
