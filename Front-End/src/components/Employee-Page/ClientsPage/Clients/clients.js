// Calculate user counts
export function getClientCounts(results) {
  return {
    //total users/clients
    totalCount: results.length,

    //active count
    activeCount: results.filter(
      (client) => client.status?.toLowerCase() === "active",
    ).length,

    //not active count
    notActiveCount: results.filter(
      (client) => client.status?.toLowerCase() === "not active",
    ).length,

    //managers count
    managerCount: results.filter(
      (user) => user.role?.toLowerCase() === "manager",
    ).length,

    //employees count
    employeeCount: results.filter(
      (user) => user.role?.toLowerCase() === "employee",
    ).length,

    //clients count
    clientCount: results.filter((user) => user.role?.toLowerCase() === "client")
      .length,
  };
}

// Calculate active filters
export function getActiveFilterCount(filters) {
  return filters.filter((filter) => filter.selected !== filter.defaultValue)
    .length;
}

// Prepare status legend data
export function getStatusLegendItems(activeCount, notActiveCount, styles) {
  return [
    {
      label: "Active",
      count: activeCount,
      className: styles.active,
    },
    {
      label: "Not Active",
      count: notActiveCount,
      className: styles.notActive,
    },
  ];
}

// Prepare role legend data
export function getRoleLegendItems(
  managerCount,
  employeeCount,
  clientCount,
  styles,
) {
  return [
    {
      label: "Managers",
      count: managerCount,
      className: styles.managers,
    },
    {
      label: "Employees",
      count: employeeCount,
      className: styles.employees,
    },
    {
      label: "Clients",
      count: clientCount,
      className: styles.clientsRole,
    },
  ];
}
