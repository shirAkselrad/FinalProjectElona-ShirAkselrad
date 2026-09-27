import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/loginPage" state={{ from: location }} replace />;
  }

  //if the user's role is included by the list of the roles which can enter so it will, if no it won't
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
export default ProtectedRoute;
