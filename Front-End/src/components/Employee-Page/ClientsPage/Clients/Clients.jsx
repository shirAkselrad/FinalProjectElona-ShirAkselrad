import styles from "./clients.module.css";
import ClientsTable from "../ClientsTable/ClientsTable.jsx";
import SectionTitle from "../../SectionTitle/SectionTitle.jsx";
import SearchBar from "../../../General/SearchBar/SearchBar.jsx"; 
import { useOutlet, useOutletContext } from "react-router-dom";
import ManagementFilters from "../../../General/ManagmentFilters/ManagementFilters.jsx";
import { useState, useEffect } from "react";

function Clients({ isManager = false }) {
  const { client, setClients, users, setUsers } = useOutletContext();
  const displayedClients = isManager ? users : clients;
  const updateDisplayedClients = isManager ? setUsers : setClients;
  const [cities, setCities] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [searchValue, setSearchValue] = useState("");
  const [filteredClients, setFilteredClients] = useState(null);
  const [refresh, setRefresh] = useState(0);

  //The function gets all the cities names with no repeats
  async function getCitiesNoRepeat() {
    try {
      const url = isManager
        ? "/api/manager/citiesNoRepeat"
        : "/api/employee/citiesNoRepeat";
      const response = await fetch(url, {
        method: "GET",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.success) setCities(data.cities);
    } catch (error) {
      console.error("Error getting cities: ", error);
    }
  }

  //get filtered clients from backend
  async function getFilteredClients() {
    try {
      const url = isManager ? "/api/manager/users" : "/api/employee/clients";
      const response = await fetch(
        `${url}?status=${selectedStatus}&city=${selectedCity}&search=${searchValue}`,
        {
          method: "GET",
        },
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success)
        setFilteredClients(isManager ? data.users : data.clients);
    } catch (error) {
      console.error("Error filtering clients:", error);
    }
  }

  useEffect(() => {
    getCitiesNoRepeat();
  }, [isManager, refresh]);

  useEffect(() => {
    const timer = setTimeout(() => {
      getFilteredClients();
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedStatus, selectedCity, searchValue, isManager, refresh]);

  //updating client after editing
  function handleUpdateClient(updatedClient) {
    updateDisplayedClients((prevClients) =>
      prevClients.map((client) =>
        client.email === updatedClient.email
          ? { ...client, ...updatedClient }
          : client,
      ),
    );
    setRefresh((prev) => prev + 1);
  }

  const results = filteredClients ?? displayedClients;

  const filters = [
    {
      title: "STATUS",
      options: ["All Statuses", "Active", "Not Active"],
      selected: selectedStatus,
      setSelected: setSelectedStatus,
    },
    {
      title: "CITY",
      options: ["All Cities", ...cities],
      selected: selectedCity,
      setSelected: setSelectedCity,
    },
  ];

  return (
    <div className={styles.clients}>
      <div className={styles.top}>
        <SectionTitle title={isManager ? "Users" : "Clients"} />
      </div>

      <div className={styles.tools}>
        <div className={styles.search}>
          <SearchBar
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </div>
      </div>

      <ManagementFilters
        title={isManager ? "FILTER USERS" : "FILTER CLIENTS"}
        filters={filters}
      />

      {results.length > 0 ? (
        <ClientsTable
          clients={results}
          onSave={handleUpdateClient}
          isManager={isManager}
        />
      ) : (
        <div className={styles.noResults}>
          <h3>NO MATCHING {isManager ? "USERS" : "CLIENTS"}</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}

export default Clients;
