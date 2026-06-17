import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRole, children }) => {
  const role = localStorage.getItem("role");
  const seller = localStorage.getItem("seller_token");
  const buyer = localStorage.getItem("buyer_token");
  const admin = localStorage.getItem("admin_token");

  const token = seller || buyer || admin;

  if (!token) return <Navigate to="/" />;

  if (allowedRole && allowedRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
