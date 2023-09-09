// Components
import PageCreationRecette from "./pages/PageCreationRecette";
import PageConnexion from "./pages/PageConnexion";
import PageInscription from "./pages/PageInscription";
import PageAdmin from "./pages/PageAdmin";
import PagePrincipale from "./pages/PagePrincipale";

//CSS
import "./styles/CSSGeneral.css";
import "./styles/index.css";

// Autre
import React, { useState, useEffect } from "react";
import {
  createBrowserRouter,
  BrowserRouter as Router,
  Routes,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./auth/PrivateRoute";
import PublicRoute from "./auth/PublicRoute";
import AdminRoute from "./auth/AdminRoute";

function App() {
  const [role, setRole] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [isLoadedInfo, setIsLoadedInfo] = useState(false);
  const [isLoadedAuth, setIsLoadedAuth] = useState(false);
  const [pseudo, setPseudo] = useState("");

  async function getUserInfos() {
    try {
      const response = await fetch(
        "http://localhost:5000/dashboard/userInfos",
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );

      const parseRes = await response.json();

      setPseudo(parseRes.user_pseudo);
      setRole(parseRes.user_role);
      setIsLoadedInfo(true);
    } catch (err) {
      console.error(err.message);
    }
  }

  async function isVerify() {
    try {
      const response = await fetch("http://localhost:5000/auth/is-verified", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();
      parseRes === true ? setIsAuth(true) : setIsAuth(false);
      setIsLoadedAuth(true);
      return parseRes;
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getUserInfos();
    isVerify();
  }, []);

  if (isLoadedInfo && isLoadedAuth) {
    console.log("isAuth : " + isAuth);
    console.log("role : " + role);
    return (
      <React.StrictMode>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <PagePrincipale
                  isAuth={isAuth}
                  setIsAuth={setIsAuth}
                  pseudo={pseudo}
                  role={role}
                />
              }
            />
            <Route
              path="/inscription"
              element={<PublicRoute isAuth={isAuth} />}
            >
              <Route
                path="/inscription"
                element={
                  <PageInscription isAuth={isAuth} setIsAuth={setIsAuth} />
                }
              />
            </Route>
            <Route path="/connexion" element={<PublicRoute isAuth={isAuth} />}>
              <Route
                path="/connexion"
                element={
                  <PageConnexion isAuth={isAuth} setIsAuth={setIsAuth} />
                }
              />
            </Route>
            <Route
              path="/creation-recette"
              element={<PrivateRoute isAuth={isAuth} />}
            >
              <Route
                path="/creation-recette"
                element={
                  <PageCreationRecette
                    isAuth={isAuth}
                    setIsAuth={setIsAuth}
                    pseudo={pseudo}
                    role={role}
                  />
                }
              />
            </Route>
            <Route
              path="/admin"
              element={<AdminRoute isAuth={isAuth} role={role} />}
            >
              <Route
                path="/admin"
                element={
                  <PageAdmin
                    isAuth={isAuth}
                    setIsAuth={setIsAuth}
                    pseudo={pseudo}
                    role={role}
                  />
                }
              />
            </Route>
          </Routes>
        </Router>
        <ToastContainer />
      </React.StrictMode>
    );
  }
}

export default App;
