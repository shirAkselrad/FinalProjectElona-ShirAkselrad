import styles from "./shopBtn.module.css";
import { Link } from "react-router-dom";
function ShopBtn() {
  return (
    <Link className={styles.shop} to="/">
      SHOP
    </Link>
  );
}

export default ShopBtn;
