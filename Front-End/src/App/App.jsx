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
import OrderSummaryPage from "../components/Shop-Page/OrderSummary/OrderSummaryPage/OrderSummaryPage.jsx";
import PaymentPage from "../components/Shop-Page/PaymentPage/PaymentPage.jsx";
import PaymentSuccessPage from "../components/Shop-Page/PaymentSuccessPage/PaymentSuccessPage.jsx";
import OrderReview from "../components/OrderReview-Page/OrderReview/OrderReview.jsx";
import StoreOverview from "../components/Manager-Page/OverViewPart/StoreOverview/StoreOverview.jsx";
import MyAccountPage from "../components/MyAccountPage/MyAccountPage.jsx";
import CustomerReviews from "../components/Manager-Page/CustomerReviews-Page/CustomerReviews/CustomerReviews.jsx";
import StoreManagement from "../components/Manager-Page/StoreManagement-Page/StoreManagement/StoreManagement.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout/MainLayout.jsx";
import ProtectedRoute from "../routes/ProtectedRoute.jsx";
import AuthLayout from "../layouts/AuthLayout/AuthLayout.jsx";
import { CartProvider } from "../context/CartContext.jsx";
function App() {
  return (
    <CartProvider>
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
          >
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<StoreOverview />} />
            <Route path="users" element={<Clients isManager={true} />} />
            <Route path="inventory" element={<Inventory isManager={true} />} />
            <Route path="orders" element={<Orders isManager={true} />} />
            <Route path="reviews" element={<CustomerReviews />} />
            <Route path="storeManagement" element={<StoreManagement/>}/>
          </Route>
          <Route
            path="myAccount"
            element={
              <ProtectedRoute allowedRoles={["Client", "Employee", "Manager"]}>
                <MyAccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orderSummary"
            element={
              <ProtectedRoute allowedRoles={["Client"]}>
                <OrderSummaryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute allowedRoles={["Client"]}>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/paymentSuccess"
            element={
              <ProtectedRoute allowedRoles={["Client"]}>
                <PaymentSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orderReview"
            element={
              <ProtectedRoute allowedRoles={["Client"]}>
                <OrderReview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employeePage"
            element={
              <ProtectedRoute allowedRoles={["Employee"]}>
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
    </CartProvider>
  );
}
export default App;
