// Components
import BarreNavigation from "../components/BarreNavigation";
import FondSite from "../components/FondSite";
import PiedDePage from "../components/PiedDePage";
import MenuAjoutRecette from "../components/MenuAjoutRecette";
import ModifTitreRecette from "../components/ModifTitreRecette";
import ModifNbPersonne from "../components/ModifNbPersonne";
import ModifIngredient from "../components/ModifIngredient";
import ModifStep from "../components/ModifStep";

// Datas
import myFondSite from "../datas/FondSiteSabine.jpg";
import iconeModifier from "../datas/Icones/icone_modifier.png";

// CSS
import "../styles/CSSGeneral.css";
import "../styles_pages/CreationRecette.css";
import "../styles/BoutonBoard.css";

//Autre
import { toast } from "react-toastify";
import { useParams } from "react-router";
import React, { useState, useEffect } from "react";

function PageCreationRecette({
  isAuth,
  setIsAuth,
  pseudo,
  role,
  toShow,
  setToShow,
}) {
  // Infos recette
  const [myRct, setMyRct] = useState({
    rct_name: "",
    user_pseudo: "",
    rct_nb: 0,
    rct_nb_type: "",
    rct_section_ing: [["no_section", 1]],
    rct_ing: [],
    rct_section_step: [["no_section", 1]],
    rct_step: [],
  });

  // Application des modif qu'au moment de valider
  const [myRct_new, setMyRct_new] = useState({
    rct_name: "",
    user_pseudo: "",
    rct_nb: 0,
    rct_nb_type: "",
    rct_section_ing: [],
    rct_ing: [],
    rct_section_step: [],
    rct_step: [],
  });

  // Mes variables
  let { rct_id } = useParams();
  const [changingName, setChangingName] = useState(false);
  const [changingNbPersonne, setChangingNbPersonne] = useState(false);
  const [changingIngredients, setChangingIngredients] = useState(false);
  const [changingSteps, setChangingSteps] = useState(false);
  const boardModificationName = "board_modification";
  const myBoard = document.getElementById(boardModificationName);

  // Fonctions fetch
  async function getRecipeInfos() {
    try {
      const response = await fetch(
        "http://localhost:5000/recipe/getRecipeInfos",
        {
          method: "GET",
          headers: { rct_id: rct_id },
        }
      );

      const parseRes = await response.json();

      if (parseRes.myInfo) {
        setMyRct({
          ...myRct,
          rct_name: parseRes.myInfo.rows[0].rct_name,
          user_pseudo: parseRes.myInfo.rows[0].user_pseudo,
          rct_nb: parseRes.myInfo.rows[0].rct_nb,
          rct_nb_type: parseRes.myInfo.rows[0].rct_nb_type,
          rct_section_ing: parseRes.mySectionIngList,
          rct_ing: parseRes.myIngList,
        });
      } else {
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getRecipeInfos();
  }, []);

  // Fonctions Modifier

  function ouvertureModif(myBool) {
    if (myBool) {
      myBoard.style.left = "0px";
    } else {
      myBoard.style.left = "100vw";
    }
  }

  function modifButton(e) {
    e.preventDefault();
    ouvertureModif(true);
    setMyRct_new({ ...myRct_new, ...myRct });
    if (e.target.id === "icone_modifier_titre") {
      setChangingName(true);
    }
    if (e.target.id === "icone_modifier_nb_personne") {
      setChangingNbPersonne(true);
    }
    if (e.target.id === "icone_modifier_ingredient") {
      setChangingIngredients(true);
    }
    if (e.target.id === "icone_modifier_step") {
      setChangingSteps(true);
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
        <div className="bandeau_gauche">
          <div className="nb_personne elements_centre">
            {myRct.rct_nb === 0
              ? "Pour..."
              : "Pour " + myRct.rct_nb + " " + myRct.rct_nb_type}
            <img
              id="icone_modifier_nb_personne"
              className="icone_modifier"
              src={iconeModifier}
              onClick={(e) => modifButton(e)}
            />
          </div>
          <div id="titre_liste_ingredient" className="texte_centre">
            Liste ingrédients
            <img
              id="icone_modifier_ingredient"
              className="icone_modifier"
              src={iconeModifier}
              onClick={(e) => modifButton(e)}
            />
          </div>
          <div id="liste_ingredient">
            {myRct.rct_section_ing.length > 0
              ? myRct.rct_section_ing.map((section_ing) => (
                  <ul>
                    {section_ing[0] !== "no_section" ? (
                      <p className="gras souligne texte_ingredient">
                        {section_ing[0]}
                      </p>
                    ) : null}
                    {myRct.rct_ing.length > 0
                      ? myRct.rct_ing.map((ing) =>
                          ing[3] === section_ing[1] ? (
                            <li className="point_ingredient">
                              {ing[0] > 0 ? (
                                <span className="gras texte_ingredient">
                                  {ing[0] + " "}
                                </span>
                              ) : null}
                              {ing[1] !== "" ? (
                                <span className="gras texte_ingredient">
                                  {ing[1] + " "}
                                </span>
                              ) : null}
                              {ing[2] !== "" ? (
                                <span className="texte_ingredient">
                                  {ing[2]}
                                </span>
                              ) : null}
                            </li>
                          ) : null
                        )
                      : null}
                  </ul>
                ))
              : null}
          </div>
        </div>

        <div id="main_board">
          <div className="titre_recette elements_centre">
            {myRct.rct_name}
            <img
              id="icone_modifier_titre"
              className="icone_modifier"
              src={iconeModifier}
              onClick={(e) => modifButton(e)}
            />
            <div id="signature">Créée par {myRct.user_pseudo}</div>
          </div>
          <div id="paquet_recette_image">
            <div id="recette_board"></div>
            <div id="image_board"></div>
          </div>
        </div>
      </div>

      <div id={boardModificationName} className="board_menu_suppl">
        {changingName ? (
          <ModifTitreRecette
            rct_id={rct_id}
            myRct={myRct}
            setMyRct={setMyRct}
            myRct_new={myRct_new}
            setMyRct_new={setMyRct_new}
            setChangingName={setChangingName}
            myBoard={myBoard}
          />
        ) : changingNbPersonne ? (
          <ModifNbPersonne
            rct_id={rct_id}
            myRct={myRct}
            setMyRct={setMyRct}
            myRct_new={myRct_new}
            setMyRct_new={setMyRct_new}
            setChangingNbPersonne={setChangingNbPersonne}
            myBoard={myBoard}
          />
        ) : changingIngredients ? (
          <ModifIngredient
            rct_id={rct_id}
            myRct={myRct}
            setMyRct={setMyRct}
            myRct_new={myRct_new}
            setMyRct_new={setMyRct_new}
            setChangingIngredients={setChangingIngredients}
            myBoard={myBoard}
          />
        ) : changingSteps ? (
          <ModifStep
            rct_id={rct_id}
            myRct={myRct}
            setMyRct={setMyRct}
            myRct_new={myRct_new}
            setMyRct_new={setMyRct_new}
            setChangingSteps={setChangingSteps}
            myBoard={myBoard}
          />
        ) : null}
      </div>
      <MenuAjoutRecette toShow={toShow} setToShow={setToShow} pseudo={pseudo} />
      <PiedDePage />
    </div>
  );
}

export default PageCreationRecette;
