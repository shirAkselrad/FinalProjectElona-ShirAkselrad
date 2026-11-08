import styles from "./orders.module.css";
import { useState } from "react";
import OrdersTable from "../OrdersTable/OrdersTable.jsx";
import SectionTitle from "../../SectionTitle/SectionTitle.jsx";
import SearchBar from "../../../General/SearchBar/SearchBar.jsx";
import { useOutletContext } from "react-router-dom";
import MessagePopup from "../../../General/MessagePopup/MessagePopup.jsx";
/**
 *
 * @returns Orders
 */
function Orders({ isManager = false }) {

  const context = useOutletContext();
  const orders = isManager ? context.managerOrders : context.orders;
  const setOrders = isManager ? context.setManagerOrders : context.setOrders;
  //the state variable is resposible to the search filter in the orders table
  const [searchValue, setSearchValue] = useState("");

  const [message, setMessage] = useState(null);

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
  const onSave = async (editedOrder) => {
    try {
      const url = isManager
        ? `/api/manager/orders/${editedOrder.order_id}/edit`
        : `/api/employee/orders/${editedOrder.order_id}/edit`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: editedOrder.products,
        }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status:${response.status}`);
      setMessage({
        type: "success",
        text: "Order changes submitted for manager approval",
      });
      return true;
    } catch (error) {
      console.error("Couldn't submit order changes:", error);

      setMessage({
        type: "error",
        text: "Couldn't submit order changes",
      });

      return false;
    }
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
        {message && (
          <MessagePopup
            message={message.text}
            type={message.type}
            autoClose={false}
            onClose={() => setMessage(null)}
          />
        )}
        {/**gets the onSave function and the filterOrder */}
        <OrdersTable
          onSave={onSave}
          orders={filterOrders}
          onStatusChange={onStatusChange}
          isManager={isManager}
        />
      </div>
    </div>
  );
}

export default Orders;
