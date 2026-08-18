import styles from "./clientsTable.module.css";
import ClientRow from "../ClientRow/ClientRow.jsx";
/**
 *
 * @param {clients} param0
 * @returns ClientsTable
 */
function ClientsTable({ clients }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Phone</th>
          <th>Address</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>

      {/*going through all the clients and building the clients table  */}
      <tbody>
        {clients.map((client) => (
          <ClientRow key={client.id} client={client} />
        ))}
      </tbody>
    </table>
  );
}

export default ClientsTable;
