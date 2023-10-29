// Components
import BarreNavigation from "../components/BarreNavigation";
import FondSite from "../components/FondSite";
import PiedDePage from "../components/PiedDePage";
import MenuAjoutRecette from "../components/MenuAjoutRecette";
import VignetteRecette from "../components/VignetteRecette";
import MenuFiltreRecherche from "../components/MenuFiltreRecherche";

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
  const [myFilterList, setMyFilterList] = useState([]);
  const [myFilterBool, setMyFilterBool] = useState(false);
  const [mySearch, setMySearch] = useState("");
  const [mySearchList, setMySearchList] = useState([]);
  const boardModificationName = "board_modification";
  const myBoard = document.getElementById(boardModificationName);

  // fonctions fetch
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
        setMyRctList(parseRes.myRecipeList);
      } else {
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  async function getAllCategories() {
    try {
      const response = await fetch(
        "http://localhost:5000/recipe/getAllCategories",
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );

      const parseRes = await response.json();

      let myList = [];
      let myListAlpha = parseRes.sort();

      for (let i = 0; i < myListAlpha.length; i++) {
        myList[i] = [myListAlpha[i], false];
      }

      setMyFilterList(myList);
    } catch (err) {
      console.error(err.message);
    }
  }

  function ouvertureModif(myBool) {
    if (myBool) {
      myBoard.style.left = "0px";
    } else {
      myBoard.style.left = "100vw";
    }
  }

  useEffect(() => {
    if (isAuth) {
      getRctList();
      getAllCategories();
    } else {
      setMyRctList([]);
      setMyFilterList([]);
    }
  }, []);

  function menuFiltre(e) {
    ouvertureModif(true);
    setMyFilterBool(true);
  }

  function rechercher(e) {
    e.preventDefault();

    let hasFilter = false;
    for (let i = 0; i < myFilterList.length; i++) {
      if (myFilterList[i][1]) {
        hasFilter = true;
      }
    }

    let myTab = [];

    for (let i = 0; i < myRctList.length; i++) {
      if (
        myRctList[i].rct_name.toLowerCase().indexOf(mySearch.toLowerCase()) > -1
      ) {
        myTab.push(myRctList[i]);
      }
    }

    if (hasFilter) {
      for (let i = 0; i < myFilterList.length; i++) {
        if (myFilterList[i][1]) {
          for (let j = myTab.length - 1; j > -1; j--) {
            let myBool = false;
            for (let k = 0; k < myTab[j].cat.length; k++) {
              if (myTab[j].cat[k] === myFilterList[i][0].toLowerCase()) {
                myBool = true;
              }
            }
            if (!myBool) {
              myTab.splice(j, 1);
            }
          }
        }
      }
    }

    setMySearchList(myTab);
  }

  function myOnChange(e) {
    setMySearch(e.target.value);
  }

  function reinitialisation(e) {
    e.preventDefault();

    let myTab = myFilterList;
    for (let i = 0; i < myTab.length; i++) {
      myTab[i][1] = false;
    }

    setMyFilterList(myTab);
    setMySearch("");
    setMySearchList([]);
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
            <div id="plage_recherche" className="elements_centre">
              <form id="groupe_recherche" onSubmit={(e) => rechercher(e)}>
                <input
                  id="input_recherche"
                  className="elt_recherche"
                  placeholder="Rechercher une recette..."
                  onChange={(e) => myOnChange(e)}
                  value={mySearch}
                ></input>
                <div className="elements_centre">
                  <button
                    className="elt_recherche bouton_board"
                    onClick={(e) => rechercher(e)}
                  >
                    Rechercher
                  </button>
                  <button
                    className="elt_recherche bouton_board"
                    onClick={(e) => menuFiltre(e)}
                  >
                    Filtre
                  </button>
                  <button
                    className="elt_recherche bouton_board"
                    onClick={(e) => reinitialisation(e)}
                  >
                    Réinitialisation
                  </button>
                </div>
              </form>
              <div id="plage_resultat">
                {mySearchList.length > 0
                  ? mySearchList.map((myRct) => (
                      <VignetteRecette
                        myId={myRct.rct_id}
                        myName={myRct.rct_name}
                      />
                    ))
                  : null}
              </div>
            </div>
            <div id="all_recipes">
              {myRctList.length > 0
                ? myRctList.map((myRct) => (
                    <VignetteRecette
                      myId={myRct.rct_id}
                      myName={myRct.rct_name}
                    />
                  ))
                : null}
            </div>
          </div>
        )}
      </div>
      <div id={boardModificationName} className="board_menu_suppl">
        {myFilterBool ? (
          <MenuFiltreRecherche
            myFilterList={myFilterList}
            setMyFilterList={setMyFilterList}
            myBoard={myBoard}
            myFilterBool={myFilterBool}
            setMyFilterBool={setMyFilterBool}
          />
        ) : null}
      </div>
      <MenuAjoutRecette toShow={toShow} setToShow={setToShow} pseudo={pseudo} />
      <PiedDePage />
    </div>
  );
}

export default PagePrincipale;
