import "../App/app.module.css";

import Header from "../components/Header/Header.jsx";
import EmployeePage from "../components/Employee-Page/EmployeePage/EmployeePage.jsx";
import Footer from "../components/Footer/Footer.jsx";


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
