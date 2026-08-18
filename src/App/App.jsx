import "../App/app.module.css";
import Header from "../components/Header/Header.jsx";
import EmployeePage from "../components/Employee-Page/EmployeePage/EmployeePage.jsx";
import Footer from "../components/Footer/Footer.jsx";
import ShopPage from "../components/Shop-Page/ShopPage/ShopPage.jsx";
import AboutUsPage from "../components/AboutUs-Page/AboutUsPage/AboutUsPage.jsx";
import ManagerPage from "../components/Manager-Page/ManagerPage/ManagerPage.jsx";
import LoginPage from "../components/Login-Page/LoginPage/LoginPage.jsx";
import RegisterPage from "../components/Register-Page/RegisterPage/RegisterPage.jsx";
import { Routes, Route, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  const hideHeader =
    location.pathname === "/loginPage" || location.pathname === "/registerPage";
  return (
    <div>
      {!hideHeader && <Header />}
      <Routes>
        {/*Shop page */}
        <Route path="/" element={<ShopPage />} />
        {/*About us*/}
        <Route path="/aboutUs" element={<AboutUsPage />} />
        {/*Manager Page*/}
        <Route path="managerPage" element={<ManagerPage />} />
        {/*Employee Page*/}
        <Route path="employeePage" element={<EmployeePage />} />
        {/*Login Page*/}
        <Route path="/loginPage" element={<LoginPage />} />
        {/*Register Page*/}
        <Route path="/registerPage" element={<RegisterPage />} />
      </Routes>
      <Footer />
    </div>
  );
}
// function App() {
//   return (
//     <div className="app">
//       <Header />

//       <EmployeePage />

//       <Footer />
//     </div>
//   );
// }

export default App;
