import "../App/app.module.css";
import Header from "../components/Header/Header.jsx";
import EmployeePage from "../components/Employee-Page/EmployeePage/EmployeePage.jsx"
import Footer from "../components/Footer/Footer.jsx";

import products from "../components/Shop-Page/proudcts.js";
function App() {
  return (
    <div className="app">
      <Header />
      <EmployeePage />
      <Footer />
    </div>
  );
}

export default App;
