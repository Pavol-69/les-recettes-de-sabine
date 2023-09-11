// Components
import BoutonLien from "./BoutonMenu";

// CSS
import "../styles/BarreNavigation.css";
import "../styles/BoutonMenu.css";

// Autres
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function BarreNavigation({ isAuth, setIsAuth, pseudo, role }) {
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setIsAuth(false);
    toast.info("Déconnecté(e).");
  };
  return isAuth ? (
    <header>
      <BoutonLien myLink={"/"} myTitle={"Page de Garde"} />
      <BoutonLien
        myLink={"/creation-recette"}
        myTitle={"Ajouter une Nouvelle Recette"}
      />
      <BoutonLien myLink={"/mes-infos"} myTitle={"Mes Informations"} />
      {role === "admin" ? (
        <BoutonLien myLink={"/admin"} myTitle={"Admin"} />
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
