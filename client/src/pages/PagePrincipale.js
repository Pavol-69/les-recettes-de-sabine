// Components
import BarreNavigation from "../components/BarreNavigation";
import FondSite from "../components/FondSite";
import PiedDePage from "../components/PiedDePage";
import MenuAjoutRecette from "../components/MenuAjoutRecette";

// Datas
import myFondSite from "../datas/FondSiteSabine.jpg";

// CSS
import "../styles/CSSGeneral.css";
import "../styles_pages/PagePrincipale.css";
import "../styles/BoutonBoard.css";

// Autre
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// Images qu'il faudra virer plus tard
import ImgRecette1 from "../datas/images_sample/Burger_butternut_rotie.jpg";

function PagePrincipale({
  isAuth,
  setIsAuth,
  pseudo,
  role,
  toShow,
  setToShow,
}) {
  const rct_id1 = "4c2549e8-0cc1-4b45-85ca-8541da96ca7d";

  return (
    <div className="relatif">
      <FondSite myFondSite={myFondSite} />
      <BarreNavigation
        isAuth={isAuth}
        setIsAuth={setIsAuth}
        pseudo={pseudo}
        role={role}
        toShow={toShow}
        setToShow={setToShow}
      />
      <div className="board">
        <div id="titre_site" className="non_selectionnable">
          Les Recettes de Sabine
        </div>
        {!isAuth ? (
          <div className="paquet_boutons">
            <Link className="bouton_board non_selectionnable" to="/connexion">
              Connexion
            </Link>
            <Link className="bouton_board non_selectionnable" to="/inscription">
              Inscription
            </Link>
          </div>
        ) : (
          <div className="plage_user_auth">
            <Link
              id="4c2549e8-0cc1-4b45-85ca-8541da96ca7d"
              className="vignette_recette"
              to="/creation-recette/4c2549e8-0cc1-4b45-85ca-8541da96ca7d"
            >
              <img className="vignette_recette_img" src={ImgRecette1} />
            </Link>
          </div>
        )}
      </div>
      <MenuAjoutRecette toShow={toShow} setToShow={setToShow} />
      <PiedDePage />
    </div>
  );
}

export default PagePrincipale;
