import styles from "./orders.module.css";
import { useState } from "react";
import OrdersTable from "../OrdersTable/OrdersTable.jsx";
import SectionTitle from "../../SectionTitle/SectionTitle.jsx";
import SearchBar from "../../../General/SearchBar/SearchBar.jsx";
import { useOutletContext } from "react-router-dom";
import MessagePopup from "../../../General/MessagePopup/MessagePopup.jsx";
import ManagementLegend from "../../../General/ManagementLegend/ManagementLegend.jsx";
import ManagementFilters from "../../../General/ManagmentFilters/ManagementFilters.jsx";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn.jsx";
import { useEffect } from "react";
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
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [statuses, setStatuses] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [message, setMessage] = useState(null);
  const [refresh, setRefresh] = useState(0);

  //get available order statuses from BE
  async function getFilterOptions() {
    try {
      const url = isManager
        ? "/api/manager/orders/filterOptions"
        : "/api/employee/orders/filterOptions";
      const response = await fetch(url, {
        method: "GET",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success) setStatuses(data.statuses);
    } catch (error) {
      console.error("Error getting order filter options:", error);
    }
  }

  //get orders filtered by BE
  async function getFilteredOrders() {
    try {
      const url = isManager ? "/api/manager/orders" : "/api/employee/orders";
      const response = await fetch(
        `${url}?status=${encodeURIComponent(selectedStatus)}&search=${encodeURIComponent(searchValue)}`,
        {
          method: "GET",
        },
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success) setFilteredOrders(data.orders);
    } catch (error) {
      console.error("Error getting filtered orders: ", error);
    }
  }

  useEffect(() => {
    getFilterOptions();
  }, [isManager]);

  useEffect(() => {
    const timer = setTimeout(() => {
      getFilteredOrders();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedStatus, searchValue, isManager, refresh]);

  const filters = [
    {
      title: "STATUS",
      options: ["All Statuses", ...statuses],
      selected: selectedStatus,
      setSelected: setSelectedStatus,
      defaultValue: "All Statuses",
    },
  ];

  const activeFilterCount = filters.filter(
    (filter) => filter.selected !== filter.defaultValue,
  ).length;

  const results = filteredOrders ?? orders;

  const legendItems = statuses.map((status) => ({
    label: status,
    count: results.filter((order) => order.status === status).length,
    className: styles[status.toLowerCase()],
  }));
  //submit order changes
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
    setRefresh((prev) => prev + 1);
  };

  return (
    <div className={styles.orders}>
      <div className={styles.top}>
        <SectionTitle title="Orders" />
      </div>

      <div className={styles.search}>
        <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>

      <div className={styles.ordersToolbar}>
        <div className={styles.legendGroups}>
          <span className={styles.totalCount}>{results.length} Orders</span>

          <div className={styles.legendDivider} />

          <ManagementLegend items={legendItems} />
        </div>

        <div className={styles.filtersArea}>
          <GeneralBtn
            type="button"
            text={`Filters${activeFilterCount ? ` (${activeFilterCount})` : ""} ${
              showFilters ? "−" : "+"
            }`}
            className={`${styles.filtersToggle} ${
              showFilters ? styles.filtersToggleActive : ""
            }`}
            onClick={() => setShowFilters((prev) => !prev)}
          />

          {showFilters && (
            <div className={styles.filtersDropdown}>
              <ManagementFilters title="FILTER ORDERS" filters={filters} />
            </div>
          )}
        </div>
      </div>

      <div className={styles.tableContainer}>
        {message && (
          <MessagePopup
            message={message.text}
            type={message.type}
            autoClose={false}
            onClose={() => setMessage(null)}
          />
        )}

        {results.length > 0 ? (
          <OrdersTable
            onSave={onSave}
            orders={results}
            onStatusChange={onStatusChange}
            isManager={isManager}
          />
        ) : (
          <div className={styles.noResults}>
            <h3>NO MATCHING ORDERS</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
