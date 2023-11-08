// Components
import BoutonLien from "./BoutonMenu";

// CSS
import "../styles/BarreNavigation.css";
import "../styles/BoutonMenu.css";

// Autres
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function BarreNavigation({
  isAuth,
  setIsAuth,
  pseudo,
  role,
  toShow,
  setToShow,
  nbNotif,
}) {
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

  return isAuth && role !== "rejected" && role !== "to_define" ? (
    <header>
      <BoutonLien myLink={"/"} myTitle={"Page de Garde"} />
      <div className="bouton_menu" onClick={(e) => newRecipe(e)}>
        Ajouter une Nouvelle Recette
      </div>
      <BoutonLien myLink={"/mes-infos"} myTitle={"Mes Informations"} />
      {role === "admin" ? (
        <div className="paquet_btn_admin">
          <BoutonLien myLink={"/admin"} myTitle={"Admin"} />
          {nbNotif > 0 ? <div className="notif gras">{nbNotif}</div> : null}
        </div>
      ) : null}
      {role === "admin" ? (
        <BoutonLien myLink={"/categorie"} myTitle={"Gestion des Catégories"} />
      ) : null}
      <Link onClick={(e) => logout(e)} className="bouton_menu" to="/">
        Déconnexion
      </Link>
      <div className="info_user">Connecté en tant que {pseudo}</div>
    </header>
  ) : (
    <header></header>
  );
}

export default BarreNavigation;
