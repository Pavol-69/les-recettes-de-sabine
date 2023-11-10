// Components
import BoutonLien from "./BoutonMenu";

// CSS
import "../styles/BarreNavigation.css";
import "../styles/BoutonMenu.css";

// Autres
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "font-awesome/css/font-awesome.min.css";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

function BarreNavigation({
  isAuth,
  setIsAuth,
  pseudo,
  role,
  toShow,
  setToShow,
  nbNotif,
  bigBar,
}) {
  const [shaking, setShaking] = useState(false);
  const [menuUser, setMenuUser] = useState(false);

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setIsAuth(false);
    toast.info("Déconnecté(e).");
  };

  const newRecipe = (e) => {
    e.preventDefault();
    setToShow(true);
  };

  function affichageMenuUser(e) {
    if (menuUser) {
      /*const myMenu = document.getElementById("id_menu_user");
      myMenu.style.animation = "close_menu_user 0.3s linear";*/
      setMenuUser(false);
    } else {
      setMenuUser(true);
    }
  }

  return isAuth && role !== "rejected" && role !== "to_define" ? (
    <header>
      <BoutonLien myLink={"/"} myTitle={"Page Principale"} />
      <div className="bouton_menu" onClick={(e) => newRecipe(e)}>
        Ajouter une Nouvelle Recette
      </div>
      {role === "admin" ? (
        <div className="paquet_btn_admin">
          <BoutonLien myLink={"/admin"} myTitle={"Admin"} />
          {nbNotif > 0 ? <div className="notif gras">{nbNotif}</div> : null}
        </div>
      ) : null}
      {role === "admin" ? (
        <BoutonLien myLink={"/categorie"} myTitle={"Gestion des Catégories"} />
      ) : null}
      <div className="paquet_user ligne">
        <div className="info_user texte_taille_1 gras">
          Connecté en tant que {pseudo}
        </div>
        <div
          className="fleche_menu_user"
          onMouseEnter={() => setShaking(true)}
          onMouseLeave={() => setShaking(false)}
          onClick={(e) => {
            affichageMenuUser(e);
          }}
        >
          <FontAwesomeIcon
            icon={faChevronDown}
            bounce={shaking}
            size="lg"
            style={{ color: "#dcdcdc" }}
          />
        </div>
        {menuUser ? (
          <div
            className="menu_user elements_centre colonne"
            id="id_menu_user"
            onBlur={(e) => {
              setMenuUser(false);
            }}
          >
            <Link
              className="bouton_menu_user elements_centre texte_taille_1 gras"
              to="/mes-infos"
            >
              Mes informations
            </Link>
            <Link
              onClick={(e) => logout(e)}
              className="bouton_menu_user elements_centre texte_taille_1 gras"
              to="/"
            >
              Déconnexion
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  ) : (
    <header></header>
  );
}

export default BarreNavigation;
