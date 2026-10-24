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
  onAddToCart,
  previewMode = false,
}) {
  const isOutOfStock = (product.status =
    "Active" && Number(product.quantity) <= 0);
  return (
    <div className={styles.productCard}>
      <div className={styles.imageContainer}>
        <ProductImg
          image={image}
          name={product.name}
          editable={editable}
          //in case edit mode is false, if onViewDetails doesn't exist then no error will accure (nothing will happen)
          onImageClick={
            previewMode
              ? () => {}
              : editable
                ? onImageClick
                : () => onViewDetails?.(product)
          }
        />
        {isOutOfStock && !editable && (
          <span className={styles.outOfStock}>OUT OF STOCK</span>
        )}
      </div>

      <div className={styles.content}>
        <DescriptionProduct category={product.category} name={product.name} />
        <ProductColors colors={product.colors} />
        <ProductSizes selectedSize={product.size} compact />
        <div className={styles.bottom}>
          <ProductPrice price={product.price} discount={product.discount} />
          <Plus
            onClick={
              //1-the amount of products to add to the cart from the same product
              previewMode ? () => {} : () => onAddToCart?.(product, 1)
            }
            disabled={Number(product.quantity <= 0)}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
