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

  return isAuth ? (
    <header>
      <BoutonLien myLink={"/"} myTitle={"Page de Garde"} />
      <div className="bouton_menu" onClick={(e) => newRecipe(e)}>
        Ajouter une Nouvelle Recette
      </div>
      <BoutonLien myLink={"/mes-infos"} myTitle={"Mes Informations"} />
      {role === "admin" ? (
        <BoutonLien myLink={"/admin"} myTitle={"Admin"} />
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
