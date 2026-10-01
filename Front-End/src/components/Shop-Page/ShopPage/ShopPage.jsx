import styles from "./shopPage.module.css";
import MessagePopup from "../../General/MessagePopup/MessagePopup.jsx";
import SearchBar from "../../General/SearchBar/SearchBar.jsx";
import CategoryBtn from "../CategoryBtn/CategoryBtn.jsx";
import ProductsGrid from "../ProductsGrid/ProductsGrid.jsx";
import { useState, useEffect } from "react";

function ShopPage() {
  const [products, setProducts] = useState([]);
  const [frontImgs, setFrontImgs] = useState([]);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "",
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
      setProducts(data.products);
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

  useEffect(() => {
    getProducts();
    getFrontImgs();
  }, []);
  return (
    <main className={styles.shopPage}>
      <div className={styles.controls}>
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
        <ProductsGrid products={products} frontImgs={frontImgs} />
      )}
    </main>
  );
}

export default ShopPage;
