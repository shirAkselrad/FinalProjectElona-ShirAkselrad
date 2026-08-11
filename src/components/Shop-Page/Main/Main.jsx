import styles from "./main.module.css";

import SearchBar from "../SearchBar/SearchBar.jsx";
import CategoryBtn from "../CategoryBtn/CategoryBtn.jsx";
import ProductCard from "../productCard/ProductCard.jsx";

import begImg from "../../../assets/beg.png";

function Main() {
  const categories = [
    "ALL",
    "BROOCHES",
    "PENDANTS",
    "HANDBAGS",
    "WATCHES",
    "ACCESSORIES",
  ];

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.searchWrapper}>
          <SearchBar />
        </div>

        <div className={styles.categories}>
          {categories.map((category) => (
            <CategoryBtn
              key={category}
              text={category}
              active={category === "ALL"}
            />
          ))}
        </div>

        <div className={styles.products}>
          <ProductCard
            image={begImg}
            category="HANDBAGS"
            title="Brown Bag"
            description="Timepiece Luxe"
            price="490"
          />

          <ProductCard
            image={begImg}
            category="HANDBAGS"
            title="Brown Bag"
            description="Timepiece Luxe"
            price="490"
          />

          <ProductCard
            image={begImg}
            category="HANDBAGS"
            title="Brown Bag"
            description="Timepiece Luxe"
            price="490"
          />
        </div>
      </div>
    </main>
  );
}

export default Main;
