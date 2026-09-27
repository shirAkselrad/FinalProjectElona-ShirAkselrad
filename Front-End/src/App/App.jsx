import "../App/app.module.css";
import EmployeePage from "../components/Employee-Page/EmployeePage/EmployeePage.jsx";
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
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout/MainLayout.jsx";
import ProtectedRoute from "../routes/ProtectedRoute.jsx";
import AuthLayout from "../layouts/AuthLayout/AuthLayout.jsx";
function App() {
  return (
    <Routes>
      {/*pages which includes header*/}
      <Route element={<MainLayout />}>
        <Route path="/" element={<ShopPage />} />
        <Route path="/aboutUs" element={<AboutUsPage />} />
        <Route
          path="/managerPage"
          element={
            <ProtectedRoute allowedRoles={["Manager"]}>
              <ManagerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employeePage"
          element={
            <ProtectedRoute allowedRoles={["Employee", "Manager"]}>
              <EmployeePage />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="clients" replace />} />
          <Route path="clients" element={<Clients />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Route>
      {/*Pages which do not include header*/}
      <Route element={<AuthLayout />}>
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="/registerPage" element={<RegisterPage />} />
        <Route path="/ForgotPasswordPage" element={<ForgotPasswordPage />} />
        <Route path="/recoveryPage" element={<RecoveryPage />} />
        <Route path="/ResetPasswordPage" element={<ResetPasswordPage />} />
      </Route>
    </Routes>
  );
}
export default App;
