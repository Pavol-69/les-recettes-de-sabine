// Components
import FondSite from "../components/FondSite";
import PiedDePage from "../components/PiedDePage";
import BarreNavigation from "../components/BarreNavigation";

// Datas
import myFondSite from "../datas/FondSiteSabine.jpg";

// CSS
import "../styles/CSSGeneral.css";
import "../styles_pages/PageNonAccepte.css";

// Autre
import { toast } from "react-toastify";

function PageNonAccepte({ role, isAuth, setIsAuth }) {
  function logout(e) {
    e.preventDefault();
    localStorage.removeItem("token");
    setIsAuth(false);
    toast.info("Déconnecté(e).");
  }
  function desinscription(e) {
    e.preventDefault();
    if (deleteUser()) {
      localStorage.removeItem("token");
      setIsAuth(false);
      toast.info("Désinscrit(e).");
    }
  }
  async function deleteUser() {
    try {
      const response = await fetch(
        "http://localhost:5000/dashboard/deleteUser",
        {
          method: "POST",
          headers: { token: localStorage.token },
        }
      );

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
  }

  return (
    <div className="relatif">
      <FondSite myFondSite={myFondSite} />
      <BarreNavigation role={role} isAuth={isAuth} setIsAuth={setIsAuth} />
      <div className="board elements_centre">
        {role === "to_define" ? (
          <div className="ensemble_to_define elements_centre colonne texte_en_attente">
            <div className="texte_taille_5 texte_en_attente gras">
              Votre demande d'inscription est en attente.
            </div>
            <div className="paquet_bouton ligne">
              <button
                onClick={(e) => logout(e)}
                className="bouton_board non_selectionnable"
              >
                Déconnexion
              </button>
              <button
                onClick={(e) => desinscription(e)}
                className="bouton_board non_selectionnable"
              >
                Se désinscrire
              </button>
            </div>
          </div>
        ) : (
          <div className="ensemble_to_define elements_centre colonne texte_en_attente">
            <div className="texte_taille_5 texte_en_attente gras">
              Désolé, votre demande d'inscription a été rejetée.
            </div>
            <div className="paquet_bouton ligne">
              <button
                onClick={(e) => logout(e)}
                className="bouton_board non_selectionnable"
              >
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </div>

      <PiedDePage />
    </div>
  );
}

export default PageNonAccepte;
