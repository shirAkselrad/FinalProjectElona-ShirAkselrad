import styles from "./clients.module.css";
import ClientsTable from "../ClientsTable/ClientsTable.jsx";
import SectionTitle from "../../SectionTitle/SectionTitle.jsx";
import SearchBar from "../../../General/SearchBar/SearchBar.jsx";
import FilterBox from "../../../General/Filters/FilterBox/FilterBox.jsx";
import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import MessagePopup from "../../../General/MessagePopup/MessagePopup.jsx";

function Clients() {
  //This popup will be displayed only in case there is no results of the filtering action
  const [showNoMatchesPopup, setShowNoMatchesPopup] = useState(false);

  //filters
  const [cities, setCities] = useState([]);

  //The function gets all the cities names with no repeats
  async function getCitiesNoRepeat() {
    try {
      const response = await fetch("/api/employee/citiesNoRepeat", {
        method: "GET",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log("CITIES FROM SERVER:", data.cities);
      setCities(data.cities);
    } catch (error) {
      console.error("Error getting cities: ", error);
    }
  }

  useEffect(() => {
    getCitiesNoRepeat();
  }, []);

  //for the status's filter
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  //for the city's filter
  const [selectedCity, setSelectedCity] = useState("All Cities");

  const filters = [
    {
      title: "STATUS",
      options: ["All Statuses", "Active", "Not Active"],
      selected: selectedStatus,
      setSelected: handleStatusChange,
    },
    {
      title: "CITY",
      options: ["All Cities", ...cities],
      selected: selectedCity,
      setSelected: handleCityChange,
    },
  ];

  //This variable state gets the clients and after one of the clients gets updated, the whole clients view is updated as well for front-end
  const { clients, setClients } = useOutletContext();
  //This part is resposible to the search filter in the clients table
  const [searchValue, setSearchValue] = useState("");

  const [filteredClients, setFilteredClients] = useState(clients);

  function applyFilters(status, city) {
    const result = clients.filter((client) => {
      const matchedSearch = Object.entries(client).some(([key, value]) => {
        const currentValue = String(value).toLowerCase();
        const search = searchValue.toLowerCase();

        if (key === "status") return currentValue === search;
        return currentValue.includes(search);
      });
      const matchesStatus =
        client.status === status || status === "All Statuses";
      const matchesCity = client.city === city || city === "All Cities";
      return matchedSearch && matchesCity && matchesStatus;
    });
    if (result.length == 0) {
      setShowNoMatchesPopup(true);
      return;
    }
    setFilteredClients(result);
  }

  function handleStatusChange(value) {
    setSelectedStatus(value);
    applyFilters(value, selectedCity);
  }

  function handleCityChange(value) {
    console.log("NEW CITY:", value);
    setSelectedCity(value);
    applyFilters(selectedStatus, value);
  }

  function resetFilters() {
    setSelectedStatus("All Statuses");
    setSelectedCity("All Cities");
    setFilteredClients(clients);
  }

  //the function which update the clients array after updating a client
  function handleUpdateClient(updateClient) {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.email === updateClient.email ? updateClient : client,
      ),
    );
    setFilteredClients((prevClients) =>
      prevClients.map((client) =>
        client.email === updateClient.email ? updateClient : client,
      ),
    );
    getCitiesNoRepeat();
  }

  return (
    <div className={styles.clients}>
      <div className={styles.top}>
        <SectionTitle title="Clients" />
      </div>

      <div className={styles.tools}>
        <div className={styles.search}>
          <SearchBar
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </div>

        <FilterBox filters={filters} reset={resetFilters} />
      </div>

      <ClientsTable
        onSave={handleUpdateClient}
        clients={filteredClients.length > 0 ? filteredClients : clients}
      />

      {showNoMatchesPopup && (
        <MessagePopup
          message="No matching clients found"
          type="error"
          onClose={() => setShowNoMatchesPopup(false)}
        />
      )}
    </div>
  );
}

export default Clients;
