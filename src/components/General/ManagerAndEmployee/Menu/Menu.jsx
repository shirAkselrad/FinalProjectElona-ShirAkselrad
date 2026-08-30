import MenuLine from "../../MenuLine/MenuLine.jsx";
import styles from "./menu.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 *
 * @param {Object} props
 * @param {Array} props.items the sections which will be present in the menu, according to the role (manager/employee)
 * @returns
 */
function Menu({ items }) {
  const navigate = useNavigate();

  //which page will be active now, by default the first section in the item array
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
        {/*Building the menu lines, the functions: setActiveMenu and setActivePage are passed with a parameters to the MenuLine component  */}
        {items.map((item) => (
          <MenuLine
            key={item.value}
            text={item.text}
            icon={item.icon}
            active={activeMenu === item.value}
            onClick={() => {
              setActiveMenu(item.value);
              navigate(item.path);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Menu;
