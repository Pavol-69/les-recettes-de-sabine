import { Outlet, Navigate } from "react-router-dom";

function AdminRoute({ isAuth, role }) {
  console.log(role);
  return isAuth && role === "admin" ? <Outlet /> : <Navigate to="/" />;
}

export default AdminRoute;
