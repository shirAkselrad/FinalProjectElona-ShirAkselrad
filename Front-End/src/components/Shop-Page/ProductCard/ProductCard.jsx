import styles from "./productCard.module.css";
import ProductSizes from "./ProductSizes/ProductSizes.jsx";
import ProductImg from "../ProductImg/ProductImg.jsx";
import DescriptionProduct from "../DescriptionProduct/DescriptionProduct.jsx";
import ProductPrice from "../ProductPrice/ProductPrice.jsx";
import ProductColors from "./ProductColors/ProductColors.jsx";
import Plus from "../Plus/Plus.jsx";

function ProductCard({
  product,
  image,
  editable = false,
  onImageClick,
  onViewDetails,
}) {
  return (
    <div className={styles.productCard}>
      <ProductImg
        image={image}
        name={product.name}
        editable={editable}
        //in case edit mode is false, if onViewDetails doesn't exist then no error will accure (nothing will happen)
        onImageClick={editable ? onImageClick : () => onViewDetails?.(product)}
      />

      <div className={styles.content}>
        <DescriptionProduct category={product.category} name={product.name} />
        <ProductColors colors={product.colors} />
        <ProductSizes selectedSize={product.size} />
        <div className={styles.bottom}>
          <ProductPrice price={product.price} discount={product.discount} />
          <Plus />
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
