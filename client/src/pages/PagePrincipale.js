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
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

function PagePrincipale({
  isAuth,
  setIsAuth,
  pseudo,
  role,
  toShow,
  setToShow,
}) {
  const [myRctList, setMyRctList] = useState([]);

  useEffect(() => {
    if (isAuth) {
      getRctList();
    } else {
      setMyRctList([]);
    }
  }, []);

  async function getRctList() {
    try {
      const response = await fetch(
        "http://localhost:5000/recipe/getRecipesList",
        {
          method: "GET",
          headers: {},
        }
      );

      const parseRes = await response.json();

      if (parseRes.myRecipeList) {
        if (parseRes.myRecipeList.rows) {
          setMyRctList(parseRes.myRecipeList.rows);
        } else {
          setMyRctList(parseRes.myRecipeList);
        }
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
            {myRctList.length > 0
              ? myRctList.map((myRct) => (
                  <Link
                    id={myRct.rct_id}
                    className="vignette_recette"
                    to={"/recette/" + myRct.rct_id}
                  >
                    <div>{myRct.rct_name}</div>
                  </Link>
                ))
              : null}
          </div>
        )}
      </div>
      <MenuAjoutRecette toShow={toShow} setToShow={setToShow} pseudo={pseudo} />
      <PiedDePage />
    </div>
  );
}

export default PagePrincipale;
