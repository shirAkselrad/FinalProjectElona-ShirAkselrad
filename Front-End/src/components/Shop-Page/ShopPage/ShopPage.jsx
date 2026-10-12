import styles from "./shopPage.module.css";
import MessagePopup from "../../General/MessagePopup/MessagePopup.jsx";
import SearchBar from "../../General/SearchBar/SearchBar.jsx";
import CategoryBtn from "../CategoryBtn/CategoryBtn.jsx";
import ProductsGrid from "../ProductsGrid/ProductsGrid.jsx";
import { useState, useEffect } from "react";
import { useCart } from "../../../context/CartContext.jsx";
import ProductPopup from "../ProductInfoPopup/ProductPopup/ProductPopup.jsx";
function ShopPage() {
  const [products, setProducts] = useState([]);
  const [frontImgs, setFrontImgs] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductImgs, setSelectedProductImgs] = useState([]);
  const {getCartAmount}=useCart(); 
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "",
    autoClose: false,
  });

  //getting all the products from back end to front-end to be presented to the user
  async function getProducts() {
    try {
      const response = await fetch("/api/shop/getProducts", {
        method: "GET",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (!response.ok || !data.success) {
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
        return false;
      }
      setSelectedProductImgs(data.imgs);
      return true;
    } catch (error) {
      setPopup({
        show: true,
        message: "Couldn't get product images",
        type: "error",
      });
      return false;
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
      console.log("Card order id: ", data.order_id);
      await getCartAmount(); 
      if(selectedProduct)
      {
        setSelectedProduct(null);
        setSelectedProductImgs([]);
      }
      else
        showAddToCartMessage(); 
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
    const success = await getProductImgs(product.product_id);
    if (success) setSelectedProduct(product);
  }
  useEffect(() => {
    getProducts();
    getFrontImgs();
  }, []);

  //This function will display a popup which will be closed automaticly after the client added a product to the cart
  function showAddToCartMessage() {
    setPopup({
      show: true,
      message: "Product added to your cart!",
      type: "success",
      autoClose: true,
    });
  }

  return (
    <div className={styles.shopPage}>
      <div className={styles.controls}>
        {/**opening a popup according to the success status  */}
        {popup.show && (
          <MessagePopup
            message={popup.message}
            type={popup.type}
            autoClose={popup.autoClose}
            onClose={() => {
              setPopup({
                show: false,
                message: "",
                type: "",
                autoClose: false,
              });
            }}
          />
        )}
        <SearchBar />

        <div className={styles.categories}>
          <CategoryBtn text="ALL" />
          <CategoryBtn text="BROOCHES" />
          <CategoryBtn text="PENDANTS" />
          <CategoryBtn text="HANDBAGS" />
          <CategoryBtn text="WATCHES" />
          <CategoryBtn text="ACCESSORIES" />
        </div>
      </div>

      {/**In case one of them is empty (the info didn't arrive yet from the back-end) */}
      {products.length > 0 && frontImgs.length > 0 && (
        <ProductsGrid
          products={products}
          frontImgs={frontImgs}
          onViewDetails={handleViewDetails}
          onAddToCart={handleAddToCart}
        />
      )}
      {selectedProduct && (
        <ProductPopup
          product={selectedProduct}
          images={selectedProductImgs}
          onAddToCart={handleAddToCart}
          onClose={() => {
            setSelectedProduct(null);
            setSelectedProductImgs([]);
          }}
        />
      )}
    </div>
  );
}

export default ShopPage;
