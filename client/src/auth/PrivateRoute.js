import { Outlet, Navigate } from "react-router-dom";

function PrivateRoute({ isAuth }) {
  console.log(isAuth);
  return isAuth ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;
