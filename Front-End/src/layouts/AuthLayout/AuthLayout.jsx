import { Outlet } from "react-router-dom";
import Footer from "../../components/Footer/Footer.jsx";
function AuthLayout() {
  return (
    <div>
      <Outlet />
      <Footer />
    </div>
  );
}
export default AuthLayout;
