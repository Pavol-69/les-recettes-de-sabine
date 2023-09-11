// Components
import FondSite from "../components/FondSite";
import PiedDePage from "../components/PiedDePage";
import BarreNavigation from "../components/BarreNavigation";

// Datas
import myFondSite from "../datas/FondSiteSabine.jpg";

// CSS
import "../styles/CSSGeneral.css";
import "../styles_pages/UserInfos.css";

// Autre
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

function PageUserInfos({ isAuth, setIsAuth, myPseudo, setPseudo, role }) {
  const [myInfo, setMyInfo] = useState({
    name: "",
    family_name: "",
    pseudo: "",
    mail: "",
    password1: "",
    password2: "",
  });

  const { user_id, name, family_name, pseudo, mail, password1, password2 } =
    myInfo;

  useEffect(() => {
    getUserInfos();
  }, []);

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

      setMyInfo({
        ...myInfo,
        user_id: parseRes.user_id,
        name: parseRes.user_name,
        family_name: parseRes.user_family_name,
        pseudo: parseRes.user_pseudo,
        mail: parseRes.user_mail,
      });
    } catch (err) {
      console.error(err.message);
    }
  }

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/dashboard/updateInfos",
        {
          method: "POST",
          headers: {
            token: localStorage.token,
            "content-type": "application/json",
          },

          body: JSON.stringify({
            user_id: user_id,
            name: name,
            family_name: family_name,
            pseudo: pseudo,
            mail: mail,
            password: password1,
            password2: password2,
          }),
        }
      );

      const parseRes = await response.json();
      if (parseRes === true) {
        toast.success("Informations mises à jour");
      } else {
        toast.error(parseRes);
      }

      if (pseudo !== "") {
        setPseudo(pseudo);
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
      <BarreNavigation
        isAuth={isAuth}
        setIsAuth={setIsAuth}
        pseudo={myPseudo}
        role={role}
      />
      <div className="board">
        <div id="fond_menu_inscription" className="fond_menu">
          <form onSubmit={onSubmitForm}>
            <div className="renseignement">
              <label>Prénom</label>
              <input
                onChange={myOnChange}
                type="text"
                name="name"
                placeholder="Prénom"
                value={name}
              ></input>
            </div>

            <div className="renseignement">
              <label>Nom de Famille</label>
              <input
                onChange={myOnChange}
                type="text"
                name="family_name"
                placeholder="Nom"
                value={family_name}
              ></input>
            </div>

            <div className="renseignement">
              <label>Pseudo</label>
              <input
                onChange={myOnChange}
                type="text"
                name="pseudo"
                placeholder="Pseudo"
                value={pseudo}
              ></input>
            </div>

            <div className="renseignement">
              <label>Adresse Mail</label>
              <input
                onChange={myOnChange}
                type="mail"
                name="mail"
                placeholder="Adresse Mail"
                value={mail}
              ></input>
            </div>

            <div className="renseignement">
              <label>Mot de passe, première saisie</label>
              <input
                onChange={myOnChange}
                type="password"
                name="password1"
                placeholder="Mot de passe"
              ></input>
            </div>

            <div className="renseignement">
              <label>Mot de passe, seconde saisie</label>
              <input
                onChange={myOnChange}
                type="password"
                name="password2"
                placeholder="Veuillez renseigner votre mot de passe à nouveau"
              ></input>
            </div>

            <button
              className="bouton_board non_selectionnable"
              id="bouton_validation"
            >
              Valider
            </button>
          </form>
        </div>
      </div>

      <PiedDePage />
    </div>
  );
}

export default PageUserInfos;
