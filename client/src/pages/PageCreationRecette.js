// Components
import BarreNavigation from "../components/BarreNavigation";
import FondSite from "../components/FondSite";
import PiedDePage from "../components/PiedDePage";
import MenuAjoutRecette from "../components/MenuAjoutRecette";
import ModifTitreRecette from "../components/ModifTitreRecette";
import ModifNbPersonne from "../components/ModifNbPersonne";
import ModifIngredient from "../components/ModifIngredient";
import ModifStep from "../components/ModifStep";
import ModifCategorie from "../components/ModifCategorie";
import ModifImages from "../components/ModifImages";

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
    rct_cat: [],
    rct_img: ["", "", "", "", ""],
  });

  // Mes variables
  let { rct_id } = useParams();
  const [changingName, setChangingName] = useState(false);
  const [changingNbPersonne, setChangingNbPersonne] = useState(false);
  const [changingIngredients, setChangingIngredients] = useState(false);
  const [changingSteps, setChangingSteps] = useState(false);
  const [changingCat, setChangingCat] = useState(false);
  const [changingImg, setChangingImg] = useState(false);
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
          rct_section_step: parseRes.mySectionStepList,
          rct_step: parseRes.myStepList,
          rct_cat: parseRes.myCatList,
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
  });

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
    if (e.target.id === "icone_modifier_categorie") {
      setChangingCat(true);
    }
    if (e.target.id === "icone_modifier_img") {
      setChangingImg(true);
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
      <div id="board_creation_recette" className="board">
        <div className="bandeau_gauche">
          <div className="nb_personne elements_centre">
            {myRct.rct_nb === 0
              ? "Pour..."
              : "Pour " + myRct.rct_nb + " " + myRct.rct_nb_type}
            <img
              id="icone_modifier_nb_personne"
              alt="bouton modifier nb personne"
              className="icone_modifier"
              src={iconeModifier}
              onClick={(e) => modifButton(e)}
            />
          </div>
          <div id="titre_liste_ingredient" className="texte_centre">
            Liste ingrédients
            <img
              id="icone_modifier_ingredient"
              alt="bouton modifier ingredient"
              className="icone_modifier"
              src={iconeModifier}
              onClick={(e) => modifButton(e)}
            />
          </div>
          <div id="liste_ingredient">
            {myRct.rct_section_ing.length > 0
              ? myRct.rct_section_ing.map((section_ing, index_section_ing) => {
                  return (
                    <ul key={"section_ing" + index_section_ing}>
                      {section_ing[0] !== "no_section" ? (
                        <p className="gras souligne texte_ingredient">
                          {section_ing[0]}
                        </p>
                      ) : null}
                      {myRct.rct_ing.length > 0
                        ? myRct.rct_ing.map((ing, index_ing) =>
                            ing[3] === section_ing[1] ? (
                              <li
                                key={"ing" + index_ing}
                                className="point_ingredient"
                              >
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
                  );
                })
              : null}
          </div>
        </div>

        <div id="main_board">
          <div className="titre_recette elements_centre">
            <div>
              {myRct.rct_name}
              <img
                id="icone_modifier_titre"
                alt="bouton modifier titre"
                className="icone_modifier"
                src={iconeModifier}
                onClick={(e) => modifButton(e)}
              />
              <div id="signature">Créée par {myRct.user_pseudo}</div>
            </div>
          </div>

          <div className="liste_categories">
            <div className="titre_liste_categories elements_centre">
              Catégories
              <img
                id="icone_modifier_categorie"
                alt="bouton modifier categories"
                className="icone_modifier"
                src={iconeModifier}
                onClick={(e) => modifButton(e)}
              />
            </div>
            <div className="liste_categorie">
              {myRct.rct_cat.length > 0
                ? myRct.rct_cat.map((cat, index_cat) =>
                    cat[1] ? (
                      <div
                        key={"cat" + index_cat}
                        className="categorie_rct elements_centre gras"
                      >
                        {cat}
                      </div>
                    ) : null
                  )
                : null}
            </div>
          </div>
          <div id="paquet_recette_image">
            <div id="recette_board">
              <div className="intitule_recette">
                La recette
                <img
                  id="icone_modifier_step"
                  alt="bouton modifier step"
                  className="icone_modifier"
                  src={iconeModifier}
                  onClick={(e) => modifButton(e)}
                />
              </div>
              <div id="liste_step">
                {myRct.rct_section_step.length > 0
                  ? myRct.rct_section_step.map(
                      (section_step, index_section_step) => (
                        <ul key={"section_step" + index_section_step}>
                          {section_step[0] !== "no_section" ? (
                            <p className="gras souligne texte_ingredient">
                              {section_step[0]}
                            </p>
                          ) : null}
                          {myRct.rct_step.length > 0
                            ? myRct.rct_step.map((step, index_step) =>
                                step[1] === section_step[1] ? (
                                  <li
                                    key={"step" + index_step}
                                    className="point_step"
                                  >
                                    {step[0] !== "" ? (
                                      <span className="texte_step">
                                        {step[0]}
                                      </span>
                                    ) : null}
                                  </li>
                                ) : null
                              )
                            : null}
                        </ul>
                      )
                    )
                  : null}
              </div>
            </div>
            <div id="image_board">
              <img
                id="icone_modifier_img"
                alt="bouton modifier images"
                className="icone_modifier"
                src={iconeModifier}
                onClick={(e) => modifButton(e)}
              />
            </div>
          </div>
        </div>
      </div>

      <div id={boardModificationName} className="board_menu_suppl">
        {!!changingName && (
          <ModifTitreRecette
            rct_id={rct_id}
            defaultValue={myRct.rct_name}
            myRct={myRct}
            setMyRct={setMyRct}
            setChangingName={setChangingName}
            myBoard={myBoard}
          />
        )}
        {!!changingNbPersonne && (
          <ModifNbPersonne
            rct_id={rct_id}
            myRct={myRct}
            setMyRct={setMyRct}
            defaultValue_nb={myRct.rct_nb}
            defaultValue_type={myRct.rct_nb_type}
            setChangingNbPersonne={setChangingNbPersonne}
            myBoard={myBoard}
          />
        )}
        {!!changingIngredients && (
          <ModifIngredient
            rct_id={rct_id}
            setMyRct={setMyRct}
            myRct={myRct}
            defaultValue_ing={myRct.rct_ing}
            defaultValue_section={myRct.rct_section_ing}
            setChangingIngredients={setChangingIngredients}
            myBoard={myBoard}
          />
        )}
        {!!changingSteps && (
          <ModifStep
            rct_id={rct_id}
            setMyRct={setMyRct}
            defaultValue_step={myRct.rct_step}
            defaultValue_section={myRct.rct_section_step}
            setChangingSteps={setChangingSteps}
            myBoard={myBoard}
          />
        )}
        {!!changingCat && (
          <ModifCategorie
            rct_id={rct_id}
            setMyRct={setMyRct}
            defaultValue={myRct.rct_cat}
            setChangingCat={setChangingCat}
            myBoard={myBoard}
          />
        )}
        {!!changingImg && (
          <ModifImages
            rct_id={rct_id}
            myRct={myRct}
            setMyRct={setMyRct}
            defaultValue={myRct.rct_img}
            setChangingImg={setChangingImg}
            myBoard={myBoard}
          />
        )}
      </div>
      <MenuAjoutRecette toShow={toShow} setToShow={setToShow} pseudo={pseudo} />
      <PiedDePage />
    </div>
  );
}

export default PageCreationRecette;
