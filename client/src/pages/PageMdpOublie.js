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

function PageMdpOublie({ isAuth, setIsAuth }) {
  const [mail, setMail] = useState("");

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/forgottenpassword/reset",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },

          body: JSON.stringify({
            mail: mail,
          }),
        }
      );

      const parseRes = await response.json();
      toast.info(parseRes);
    } catch (err) {
      console.error(err.message);
    }
  };

  function myOnChange(e) {
    setMail(e.target.value);
  }

  return (
    <div className="relatif">
      <FondSite myFondSite={myFondSite} />
      <BarreNavigation isAuth={isAuth} setIsAuth={setIsAuth} />
      <div className="board">
        <div id="fond_menu_inscription" className="fond_menu">
          <form onSubmit={onSubmitForm}>
            <div>
              Renseignez votre adresse mail afin que nous vous envoyions un mail
              pour réinitialiser votre mot de passe
            </div>
            <div className="renseignement">
              <label>Adresse Mail</label>
              <input
                type="mail"
                name="mail"
                placeholder="Adresse mail"
                onChange={myOnChange}
              ></input>
            </div>
            <button
              className="bouton_board non_selectionnable"
              id="bouton_mdp_oublie"
            >
              Envoyer Mail
            </button>
          </form>
        </div>
      </div>

      <PiedDePage />
    </div>
  );
}

export default PageMdpOublie;
