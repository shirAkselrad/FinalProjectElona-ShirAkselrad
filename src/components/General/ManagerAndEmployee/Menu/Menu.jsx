import MenuLine from "../../MenuLine/MenuLine.jsx";
import styles from "./menu.module.css";
import { useState } from "react";

function Menu({ items, setActivePage }) {
  const [activeMenu, setActiveMenu] = useState(items[0].value);

  return (
    <div className={styles.menu}>
      <div className={styles.header}>
        <h2>Menu</h2>

        <div className={styles.decoration}>
          <span className={styles.line}></span>
          <span className={styles.diamond}></span>
          <span className={styles.line}></span>
        </div>
      </div>

      <div className={styles.menuLines}>
        {items.map((item) => (
          <MenuLine
            key={item.value}
            text={item.text}
            icon={item.icon}
            active={activeMenu === item.value}
            onClick={() => {
              setActiveMenu(item.value);
              setActivePage(item.value);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Menu;
