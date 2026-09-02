import styles from "./orders.module.css";
import { useState } from "react";
import OrdersTable from "../OrdersTable/OrdersTable.jsx";
import SectionTitle from "../../SectionTitle/SectionTitle.jsx";
import SearchBar from "../../../General/SearchBar/SearchBar.jsx";
import { useOutletContext } from "react-router-dom";

//just for now till we will use the DB

/**
 *
 * @returns Orders
 */
function Orders() {
  const { orders } = useOutletContext();
  //the state variable is resposible to the search filter in the orders table
  const [searchValue, setSearchValue] = useState("");

  //the state variable is for the updating the order array, by default gets the original orders array
  const [ordersToUpdate, setOrdersToUpdate] = useState(orders);

  //This function filter the orders while the user is search for an orders
  const filterOrders = ordersToUpdate.filter((order) =>
    order.client.includes(searchValue),
  );

  //This function save all the changes while clicking on the SAVE button
  const onSave = (editedOrder) => {
    const updatedOrders = ordersToUpdate.map((order) =>
      order.id === editedOrder.id ? editedOrder : order,
    );
    setOrdersToUpdate(updatedOrders);
  };

  return (
    <div className={styles.orders}>
      {/*gets a title to display */}
      <SectionTitle title="Orders" />
      {/**The searchbar operate the setSearchValue function and returns the searchValue */}
      <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />
      <div className={styles.tableContainer}>
        {/**gets the onSave function and the filterOrder */}
        <OrdersTable onSave={onSave} orders={filterOrders} />
      </div>
    </div>
  );
}

export default Orders;
