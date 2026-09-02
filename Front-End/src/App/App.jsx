import "../App/app.module.css";
import Header from "../components/Header/Header.jsx";
import EmployeePage from "../components/Employee-Page/EmployeePage/EmployeePage.jsx";
import Footer from "../components/Footer/Footer.jsx";
import ShopPage from "../components/Shop-Page/ShopPage/ShopPage.jsx";
import AboutUsPage from "../components/AboutUs-Page/AboutUsPage/AboutUsPage.jsx";
import ManagerPage from "../components/Manager-Page/ManagerPage/ManagerPage.jsx";
import LoginPage from "../components/Login-Page/LoginPage/LoginPage.jsx";
import RegisterPage from "../components/Register-Page/RegisterPage/RegisterPage.jsx";
import ForgotPasswordPage from "../components/ForgotPassword-Page/ForgotPasswordPage/ForgotPasswordPage.jsx";
import RecoveryPage from "../components/Recovery-Page/RecoveryPage/RecoveryPage.jsx";
import ResetPasswordPage from "../components/ResetPassword-Page/ResetPasswordPage/ResetPasswordPage.jsx";
import Clients from "../components/Employee-Page/ClientsPage/Clients/Clients.jsx";
import Inventory from "../components/Employee-Page/InventoryPage/Inventory/Inventory.jsx";
import Orders from "../components/Employee-Page/OrdersPage/Orders/Orders.jsx";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
function App() {
  const location = useLocation();

  const hideHeader =
    location.pathname === "/loginPage" ||
    location.pathname === "/registerPage" ||
    location.pathname === "/ForgotPasswordPage" ||
    location.pathname === "/recoveryPage" ||
    location.pathname === "/ResetPasswordPage";
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
        {/* Employee Page */}
        <Route path="employeePage" element={<EmployeePage />}>
          <Route index element={<Navigate to="clients" replace />} />
          <Route path="clients" element={<Clients />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="orders" element={<Orders />} />
        </Route>
        {/*Login Page*/}
        <Route path="/loginPage" element={<LoginPage />} />
        {/*Register Page*/}
        <Route path="/registerPage" element={<RegisterPage />} />
        {/*Forgot Password Page*/}
        <Route path="/ForgotPasswordPage" element={<ForgotPasswordPage />} />
        {/*Recovery Page */}
        <Route path="/recoveryPage" element={<RecoveryPage />} />
        {/**Reset Password Page */}
        <Route path="/ResetPasswordPage" element={<ResetPasswordPage />} />
      </Routes>
      <Footer />
    </div>
  );
}
export default App;
