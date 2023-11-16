// Components
import BarreNavigation from "../components/BarreNavigation";
import PiedDePage from "../components/PiedDePage";
import MenuAjoutRecette from "../components/MenuAjoutRecette";
import VignetteRecette from "../components/VignetteRecette";
import MenuFiltreRecherche from "../components/MenuFiltreRecherche";
import Bandeau from "../components/Bandeau";

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
  nbNotif,
  tailleOrdi,
  tailleTel,
  tailleInt1,
  tailleInt2,
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
  }, [isAuth]);

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
      <BarreNavigation
        isAuth={isAuth}
        setIsAuth={setIsAuth}
        pseudo={pseudo}
        role={role}
        toShow={toShow}
        setToShow={setToShow}
        nbNotif={nbNotif}
        tailleOrdi={tailleOrdi}
        tailleTel={tailleTel}
        tailleInt1={tailleInt1}
        tailleInt2={tailleInt2}
      />
      <Bandeau mySize="big" />
      <div className="board">
        <div
          id="titre_site"
          className="non_selectionnable texte_centre"
          style={{
            fontSize: tailleTel
              ? "5em"
              : tailleInt2 && !tailleInt1 && !tailleOrdi
              ? "6em"
              : tailleInt1 && !tailleOrdi
              ? "8em"
              : "10em",
          }}
        >
          Les Recettes de Sabine
        </div>
        {!isAuth ? (
          <div className="paquet_boutons">
            <Link
              className={
                tailleTel
                  ? "bouton_board_empty_tel non_selectionnable"
                  : "bouton_board_empty non_selectionnable"
              }
              to="/connexion"
            >
              Connexion
            </Link>
            <Link
              className={
                tailleTel
                  ? "bouton_board_empty_tel non_selectionnable"
                  : "bouton_board_empty non_selectionnable"
              }
              to="/inscription"
            >
              Inscription
            </Link>
          </div>
        ) : (
          <div className="plage_user_auth">
            <div id="plage_recherche" className="elements_centre">
              <form
                className="elements_centre colonne"
                id="groupe_recherche"
                onSubmit={(e) => rechercher(e)}
              >
                <input
                  id="input_recherche"
                  placeholder="Rechercher une recette..."
                  onChange={(e) => myOnChange(e)}
                  value={mySearch}
                  style={{
                    width: tailleTel
                      ? "350px"
                      : tailleInt2 && !tailleInt1
                      ? "800px"
                      : "100%",
                  }}
                ></input>
                <div
                  className="btn_recherche elements_centre"
                  style={{ flexWrap: "wrap", rowGap: "30px" }}
                >
                  <div
                    className={
                      tailleTel
                        ? "bouton_board_empty_tel"
                        : "bouton_board_empty"
                    }
                    onClick={(e) => rechercher(e)}
                  >
                    Rechercher
                  </div>
                  <div
                    className={
                      tailleTel
                        ? "bouton_board_empty_tel"
                        : "bouton_board_empty"
                    }
                    onClick={(e) => menuFiltre(e)}
                  >
                    Filtre
                  </div>
                  <div
                    className={
                      tailleTel
                        ? "bouton_board_empty_tel"
                        : "bouton_board_empty"
                    }
                    onClick={(e) => reinitialisation(e)}
                  >
                    Réinitialisation
                  </div>
                </div>
              </form>
              <div className="plage_vignette elements_centre">
                {mySearchList.length > 0
                  ? mySearchList.map((myRct, index) => (
                      <VignetteRecette
                        key={"search" + index}
                        myId={myRct.rct_id}
                        myName={myRct.rct_name}
                        myImg={myRct.rct_img}
                      />
                    ))
                  : null}
              </div>
            </div>
            {myRctList.length > 0 ? (
              <div>
                <div className="titre_pqt_vignette elements_centre texte_taille_5">
                  Toute les recettes
                </div>
                <div className="plage_vignette elements_centre">
                  {myRctList.map((myRct, index) => (
                    <VignetteRecette
                      key={"list" + index}
                      myId={myRct.rct_id}
                      myName={myRct.rct_name}
                      myImg={myRct.rct_img}
                    />
                  ))}
                </div>
              </div>
            ) : null}
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
            tailleTel={tailleTel}
          />
        ) : null}
      </div>
      <MenuAjoutRecette toShow={toShow} setToShow={setToShow} pseudo={pseudo} />
      <PiedDePage />
    </div>
  );
}

export default PagePrincipale;
