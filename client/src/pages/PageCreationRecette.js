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
import SupprRecette from "../components/SupprRecette";
import Bandeau from "../components/Bandeau";

// Datas
import myFondSite from "../datas/FondSiteSabine2.jpg";
import iconeModifier from "../datas/Icones/icone_modifier.png";
import imgToDefine from "../datas/Image_a_definir.jpg";

// CSS
import "../styles/CSSGeneral.css";
import "../styles_pages/CreationRecette.css";
import "../styles/BoutonBoard.css";

//Autre
import { toast } from "react-toastify";
import { useParams } from "react-router";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "font-awesome/css/font-awesome.min.css";
import {
  faCircleChevronLeft,
  faCircleChevronRight,
  faEraser,
} from "@fortawesome/free-solid-svg-icons";

function PageCreationRecette({
  isAuth,
  setIsAuth,
  pseudo,
  role,
  toShow,
  setToShow,
  nbNotif,
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
  const [changingDelete, setChangingDelete] = useState(false);
  const boardModificationName = "board_modification";
  const myBoard = document.getElementById(boardModificationName);
  const [leftCarrousel, setLeftCarrousel] = useState(0);
  const [leftBeat, setLeftBeat] = useState(false);
  const [rightBeat, setRightBeat] = useState(false);
  const [allowToModify, setAllowToModify] = useState(false);
  const [modify, setModify] = useState(false);
  const [deleteAnim, setDeleteAnim] = useState(false);
  const [noCat, setNoCat] = useState(true);

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
        let myBool = false;
        for (let i = 0; i < parseRes.myCatList.length; i++) {
          if (parseRes.myCatList[i][1]) {
            myBool = true;
          }
        }
        if (myBool) {
          setNoCat(false);
        }

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
          rct_img: parseRes.myImgList,
        });
        if (
          (parseRes.myInfo.rows[0].user_pseudo === pseudo &&
            role === "writer") ||
          role === "admin"
        ) {
          setAllowToModify(true);
        }
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

  function changeCarrousel(mvt) {
    let myLeft = leftCarrousel;
    if (myLeft + mvt <= 0 && myRct.rct_img[-(myLeft + mvt)] !== "") {
      setLeftCarrousel(myLeft + mvt);
    }
  }

  function choixCarrousel(e, index) {
    setLeftCarrousel(-index);
  }

  function SuppressionRecette(e) {
    e.preventDefault();
    ouvertureModif(true);
    setChangingDelete(true);
  }

  function modifyButton(e) {
    if (modify) {
      setModify(false);
      e.target.style.color = "var(--color-text)";
      e.target.style.backgroundColor = "rgb(0,0,0,0)";
    } else {
      setModify(true);
      e.target.style.color = "var(--main-color)";
      e.target.style.backgroundColor = "var(--color-text)";
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
        nbNotif={nbNotif}
      />
      <Bandeau mySize={"medium"} />
      {allowToModify ? (
        <div
          onClick={(e) => modifyButton(e)}
          className="btn_modify elements_centre texte_taille_2 gras"
        >
          Modifier
        </div>
      ) : null}
      <div className="bandeau_gauche">
        <div id="titre_liste_ingredient" className="texte_centre">
          Liste ingrédients
          {modify ? (
            <img
              id="icone_modifier_ingredient"
              alt="bouton modifier ingredient"
              className="icone_modifier"
              src={iconeModifier}
              onClick={(e) => modifButton(e)}
            />
          ) : null}
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
      <div id="board_creation_recette" className="board">
        <div className="titre_recette elements_centre">
          <div className="elements_centre ligne">
            {myRct.rct_name}
            {modify ? (
              <div className="paquet_btn_titre ligne">
                <img
                  id="icone_modifier_titre"
                  alt="bouton modifier titre"
                  className="icone_modifier"
                  src={iconeModifier}
                  onClick={(e) => modifButton(e)}
                />
                <div
                  onMouseEnter={() => setDeleteAnim(true)}
                  onMouseLeave={() => setDeleteAnim(false)}
                  onClick={(e) => SuppressionRecette(e)}
                  className="bouton_suppr"
                >
                  <FontAwesomeIcon
                    icon={faEraser}
                    shake={deleteAnim}
                    size="xs"
                    style={{ color: "#af0000" }}
                  />
                </div>
              </div>
            ) : null}
            <div id="signature">Créée par {myRct.user_pseudo}</div>
          </div>
        </div>

        <div className="liste_categorie elements_centre ligne">
          {!noCat ? (
            myRct.rct_cat.map((cat, index_cat) =>
              cat[1] ? (
                <div
                  key={"cat" + index_cat}
                  className="categorie_rct elements_centre gras"
                >
                  {cat}
                </div>
              ) : null
            )
          ) : (
            <div className="categorie_rct elements_centre gras">
              Aucune catégorie associée
            </div>
          )}
          {modify ? (
            <img
              id="icone_modifier_categorie"
              alt="bouton modifier categories"
              className="icone_modifier"
              src={iconeModifier}
              onClick={(e) => modifButton(e)}
            />
          ) : null}
        </div>
        <div className="nb_personne elements_centre">
          {myRct.rct_nb === 0
            ? "Pour..."
            : "Pour " + myRct.rct_nb + " " + myRct.rct_nb_type}
          {modify ? (
            <img
              id="icone_modifier_nb_personne"
              alt="bouton modifier nb personne"
              className="icone_modifier"
              src={iconeModifier}
              onClick={(e) => modifButton(e)}
            />
          ) : null}
        </div>
      </div>

      <div id="main_board">
        <div id="recette_board">
          <div className="intitule_recette">
            La recette
            {modify ? (
              <img
                id="icone_modifier_step"
                alt="bouton modifier step"
                className="icone_modifier"
                src={iconeModifier}
                onClick={(e) => modifButton(e)}
              />
            ) : null}
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
                                  <span className="texte_step">{step[0]}</span>
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
          <div id="carrousel" style={{ left: leftCarrousel * 100 + "%" }}>
            {myRct.rct_img[0] === "" ? (
              <div className="cadre_image_recette elements_centre">
                <img
                  alt="no_illustration"
                  className="image_recette"
                  src={imgToDefine}
                ></img>
                <div className="message_aucune_image texte_taille_5 gras elements_centre">
                  Aucune image de définie
                </div>
              </div>
            ) : (
              myRct.rct_img.map((img, index) => (
                <div
                  key={"image_" + index}
                  className="cadre_image_recette elements_centre"
                >
                  <img
                    alt={"illustration_" + index}
                    className="image_recette"
                    src={img}
                  ></img>
                </div>
              ))
            )}
          </div>

          {modify ? (
            <img
              id="icone_modifier_img"
              alt="bouton modifier images"
              className="icone_modifier"
              src={iconeModifier}
              onClick={(e) => modifButton(e)}
            />
          ) : null}
          {myRct.rct_img[1] !== "" ? (
            <div>
              <div className="carrousel_left elements_centre">
                <div
                  className="fond_bouton"
                  onMouseEnter={() => setLeftBeat(true)}
                  onMouseLeave={() => setLeftBeat(false)}
                  onClick={(e) => {
                    changeCarrousel(1);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCircleChevronLeft}
                    size="4x"
                    style={{ color: "#000000" }}
                    beat={leftBeat}
                  />
                </div>
              </div>
              <div className="carrousel_right elements_centre">
                <div
                  className="fond_bouton"
                  onMouseEnter={() => setRightBeat(true)}
                  onMouseLeave={() => setRightBeat(false)}
                  onClick={(e) => {
                    changeCarrousel(-1);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCircleChevronRight}
                    size="4x"
                    style={{ color: "#000000" }}
                    beat={rightBeat}
                  />
                </div>
              </div>
              <div id="points_carrousel" className="elements_centre">
                {myRct.rct_img.map((img, index) =>
                  img !== "" ? (
                    index === -leftCarrousel ? (
                      <div
                        key={"le_bon_rond" + index}
                        className="rond_carrousel"
                        style={{
                          background: "rgb(0, 0, 0)",
                        }}
                      ></div>
                    ) : (
                      <div
                        key={"un_autre_rond" + index}
                        className="rond_carrousel"
                        style={{
                          background: "rgb(255, 255, 255, 0.8)",
                        }}
                        onClick={(e) => choixCarrousel(e, index)}
                      ></div>
                    )
                  ) : null
                )}
              </div>
            </div>
          ) : null}
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
            setLeftCarrousel={setLeftCarrousel}
          />
        )}
        {!!changingDelete && (
          <SupprRecette
            rct_id={rct_id}
            setChangingDelete={setChangingDelete}
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
