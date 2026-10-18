import styles from "./orders.module.css";
import { useState } from "react";
import OrdersTable from "../OrdersTable/OrdersTable.jsx";
import SectionTitle from "../../SectionTitle/SectionTitle.jsx";
import SearchBar from "../../../General/SearchBar/SearchBar.jsx";
import { useOutletContext } from "react-router-dom";

/**
 *
 * @returns Orders
 */
function Orders() {
  const { orders, setOrders } = useOutletContext();
  //the state variable is resposible to the search filter in the orders table
  const [searchValue, setSearchValue] = useState("");

  //This function filter the orders while the user is search for an orders
  const filterOrders = orders.filter((order) => {
    const search = searchValue.toLowerCase().trim();
    const clientName = `${order.first_name} ${order.last_name}`.toLowerCase();
    return (
      String(order.order_id).includes(search) ||
      clientName.includes(search) ||
      order.client_email.toLowerCase().includes(search)
    );
  });

  //This function save all the changes while clicking on the SAVE button
  const onSave = (editedOrder) => {
    const updatedOrders = orders.map((order) =>
      order.order_id === editedOrder.order_id? editedOrder : order,
    );
    setOrders(updatedOrders);
  };

  const onStatusChange = (order_id, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.order_id === order_id ? { ...order, status: newStatus } : order,
      ),
    );
  };
  return (
    <div className={styles.orders}>
      {/*gets a title to display */}
      <SectionTitle title="Orders" />
      {/**The searchbar operate the setSearchValue function and returns the searchValue */}
      <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />
      <div className={styles.tableContainer}>
        {/**gets the onSave function and the filterOrder */}
        <OrdersTable
          onSave={onSave}
          orders={filterOrders}
          onStatusChange={onStatusChange}
        />
      </div>
    </div>
  );
}

export default Orders;
