import { Outlet, Navigate } from "react-router-dom";

function OnGoingRouteReverse({ isAuth, role }) {
  return isAuth && (role === "rejected" || role === "to_define") ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
}

export default OnGoingRouteReverse;
