// Components
import FondSite from "../components/FondSite";
import PiedDePage from "../components/PiedDePage";
import BarreNavigation from "../components/BarreNavigation";

// Datas
import myFondSite from "../datas/FondSiteSabine.jpg";

// CSS
import "../styles/CSSGeneral.css";
import "../styles_pages/Connexion.css";

// Autre
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function PageConnexion({ isAuth, setIsAuth }) {
  const [myInfo, setMyInfo] = useState({
    mail: "",
    password: "",
  });

  const { mail, password } = myInfo;

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/auth/connexion", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },

        body: JSON.stringify({
          mail: mail,
          password: password,
        }),
      });

      const parseRes = await response.json();

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setIsAuth(true);
        toast.success("Connexion réussie");
      } else {
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  function myOnChange(e) {
    setMyInfo({ ...myInfo, [e.target.name]: e.target.value });
  }

  return (
    <div className="relatif">
      <FondSite myFondSite={myFondSite} />
      <BarreNavigation isAuth={isAuth} setIsAuth={setIsAuth} />
      <div className="board">
        <div id="fond_menu_inscription" className="fond_menu">
          <form onSubmit={onSubmitForm}>
            <div className="renseignement">
              <label>Adresse Mail</label>
              <input
                onChange={myOnChange}
                type="mail"
                name="mail"
                placeholder="Adresse mail"
              ></input>
            </div>

            <div className="renseignement">
              <label>Mot de passe</label>
              <input
                onChange={myOnChange}
                type="password"
                name="password"
                placeholder="Mot de passe"
              ></input>
            </div>
            <Link to="/connexion/mot-de-passe-oublie">
              Mot de Passe oublié ?
            </Link>

            <button
              className="bouton_board non_selectionnable"
              id="bouton_connexion"
            >
              Connexion
            </button>
          </form>
        </div>
      </div>

      <PiedDePage />
    </div>
  );
}

export default PageConnexion;
