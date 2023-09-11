// Components
import FondSite from "../components/FondSite";
import PiedDePage from "../components/PiedDePage";
import BarreNavigation from "../components/BarreNavigation";

// Datas
import myFondSite from "../datas/FondSiteSabine.jpg";

// CSS
import "../styles/CSSGeneral.css";
import "../styles_pages/ResetPassword.css";

// Autre
import React, { useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function PageResetPassword({ isAuth, setIsAuth }) {
  const [myPasswords, setMyPasswords] = useState({
    password1: "",
    password2: "",
  });

  const { password1, password2 } = myPasswords;

  let { resetKey } = useParams();

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/forgottenpassword/changepassword",
        {
          method: "POST",
          headers: {
            token: resetKey,
            "content-type": "application/json",
          },

          body: JSON.stringify({
            password: password1,
            password2: password2,
          }),
        }
      );

      const parseRes = await response.json();

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setIsAuth(true);
        toast.success("Réinitialisation Mot de Passe réussie");
      } else {
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  function myOnChange(e) {
    setMyPasswords({ ...myPasswords, [e.target.name]: e.target.value });
  }

  return (
    <div className="relatif">
      <FondSite myFondSite={myFondSite} />
      <BarreNavigation isAuth={isAuth} setIsAuth={setIsAuth} />
      <div className="board">
        <div id="fond_menu_inscription" className="fond_menu">
          <form onSubmit={onSubmitForm}>
            <div className="renseignement">
              <label>Mot de Passe, première saisie</label>
              <input
                type="password"
                name="password1"
                placeholder="Veuillez renseigner votre nouveau Mot de passe une première fois"
                onChange={myOnChange}
              ></input>
            </div>
            <div className="renseignement">
              <label>Mot de Passe, seconde saisie</label>
              <input
                type="password"
                name="password2"
                placeholder="Veuillez renseigner votre nouveau Mot de passe une nouvelle fois"
                onChange={myOnChange}
              ></input>
            </div>
            <button
              className="bouton_board non_selectionnable"
              id="bouton_reset_password"
            >
              Réinitialisation Mot de passe
            </button>
          </form>
        </div>
      </div>

      <PiedDePage />
    </div>
  );
}

export default PageResetPassword;
