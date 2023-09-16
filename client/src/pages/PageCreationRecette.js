// Components
import BarreNavigation from "../components/BarreNavigation";
import FondSite from "../components/FondSite";
import PiedDePage from "../components/PiedDePage";
import MenuAjoutRecette from "../components/MenuAjoutRecette";

// Datas
import myFondSite from "../datas/FondSiteSabine.jpg";
import iconeModifier from "../datas/Icones/icone_modifier.png";
import iconePoubelle from "../datas/Icones/icone_poubelle.png";

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
    rct_section_ing: [],
    rct_ing: [],
    rct_section_step: [],
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
  const boardModificationName = "board_modification";
  const myBoard = document.getElementById(boardModificationName);
  let myIngList = [];
  let mySectionIngList = [];
  let myStepList = [];
  let mySectionStepList = [];

  // Morceaux HTML qui se répetent
  class BoutonsModifier extends React.Component {
    constructor(props) {
      super(props);
      this.myRef = React.createRef();
    }
    render() {
      return (
        <div className="paquet_boutons">
          <button
            className="bouton_board non_selectionnable"
            id="bouton_valider"
            onClick={(e) => onSubmitValider(e)}
          >
            Valider
          </button>
          <button
            className="bouton_board non_selectionnable"
            id="bouton_annuler"
            onClick={(e) => annuler(e)}
          >
            Annuler
          </button>
        </div>
      );
    }
  }

  const annuler = (e) => {
    e.preventDefault();
    ouvertureModif(false);
    setChangingName(false);
    setChangingNbPersonne(false);
  };

  const onSubmitValider = async (e) => {
    e.preventDefault();
    ouvertureModif(false);
    if (updateRecipeDb()) {
      setMyRct({ ...myRct, ...myRct_new });
    }
    setChangingName(false);
    setChangingNbPersonne(false);
  };

  // Fonctions fetch
  async function getName() {
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
          ["rct_name"]: parseRes.myInfo.rows[0].rct_name,
          ["user_pseudo"]: parseRes.myInfo.rows[0].user_pseudo,
          ["rct_nb"]: parseRes.myInfo.rows[0].rct_nb,
          ["rct_nb_type"]: parseRes.myInfo.rows[0].rct_nb_type,
        });
      } else {
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  async function updateRecipeDb() {
    try {
      const response = await fetch(
        "http://localhost:5000/recipe/updateRecipeInfos",
        {
          method: "Post",
          headers: { rct_id: rct_id, "content-type": "application/json" },

          body: JSON.stringify({
            rct_id: rct_id,
            rct_name: myRct_new.rct_name,
            rct_nb: myRct_new.rct_nb,
            rct_nb_type: myRct_new.rct_nb_type,
          }),
        }
      );

      const parseRes = await response.json();

      if (parseRes) {
        toast.success("Recette mise à jour avec succès");
        return true;
      } else {
        toast.error(parseRes);
        return false;
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getName();
  }, []);

  // Fonctions Modifier
  const modifierTitre = (e) => {
    e.preventDefault();
    ouvertureModif(true);
    setMyRct_new({ ...myRct_new, ...myRct });
    setChangingName(true);
  };

  const modifierNbPersonne = (e) => {
    e.preventDefault();
    ouvertureModif(true);
    setMyRct_new({ ...myRct_new, ...myRct });
    setChangingNbPersonne(true);
  };

  const modifierIngredients = (e) => {
    e.preventDefault();
    ouvertureModif(true);
    setMyRct_new({ ...myRct_new, ...myRct });
    setChangingIngredients(true);
  };

  const ajoutSection = (e) => {
    e.preventDefault();

    mySectionIngList.push(["", mySectionIngList.length + 1]);
    setMyRct({
      ...myRct,
      ["rct_section_ing"]: mySectionIngList,
    });
    console.log(mySectionIngList);
    console.log(myRct);
  };

  const ajoutIngredient = (e) => {
    e.preventDefault();
  };

  function ouvertureModif(myBool) {
    if (myBool) {
      myBoard.style.left = "0px";
    } else {
      myBoard.style.left = "100vw";
    }
  }

  // Fonctions onChange
  function myOnChange(e) {
    setMyRct_new({ ...myRct_new, [e.target.name]: e.target.value });
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
        <div className="titre_recette elements_centre">
          {myRct.rct_name}
          <img
            id="icone_modifier_titre"
            className="icone_modifier"
            src={iconeModifier}
            onClick={(e) => modifierTitre(e)}
          />
          <div id="signature">Créée par {myRct.user_pseudo}</div>
        </div>
        <div className="bandeau_gauche">
          <div className="nb_personne elements_centre">
            {myRct.rct_nb === 0
              ? "Pour..."
              : "Pour " + myRct.rct_nb + " " + myRct.rct_nb_type}
            <img
              id="icone_modifier_nb_personne"
              className="icone_modifier"
              src={iconeModifier}
              onClick={(e) => modifierNbPersonne(e)}
            />
          </div>
          <div id="titre_liste_ingredient" className="texte_centre">
            Liste ingrédients
            <img
              id="icone_modifier_ingredient"
              className="icone_modifier"
              src={iconeModifier}
              onClick={(e) => modifierIngredients(e)}
            />
          </div>
        </div>
      </div>
      <div
        id={boardModificationName}
        className="board_menu_suppl elements_centre"
      >
        {changingName ? (
          <form
            className="menu_modif elements_centre"
            onSubmit={(e) => onSubmitValider(e)}
          >
            <div className="titre_modif texte_centre">
              Modification du titre de cette recette
            </div>
            <input
              onChange={myOnChange}
              className="input_modif"
              type="text"
              name="rct_name"
              placeholder="Veuillez renseigner un titre pour cette recette"
              value={myRct_new.rct_name}
            ></input>
            <BoutonsModifier />
          </form>
        ) : null}
        {changingNbPersonne ? (
          <form className="menu_modif" onSubmit={(e) => onSubmitValider(e)}>
            <div className="titre_modif texte_centre">
              Modification du nombre de personnes pour lesquelles les quantités
              sont indiquées
            </div>
            <div className="elements_centre">
              <input
                onChange={myOnChange}
                id="input_rct_nb"
                className="input_modif texte_centre"
                type="number"
                name="rct_nb"
                value={myRct_new.rct_nb}
              ></input>
              <input
                onChange={myOnChange}
                id="input_rct_nb_type"
                className="input_modif"
                type="text"
                name="rct_nb_type"
                value={myRct_new.rct_nb_type}
              ></input>
            </div>
            <BoutonsModifier />
          </form>
        ) : null}
        {changingIngredients ? (
          <form className="menu_modif" onSubmit={(e) => onSubmitValider(e)}>
            <div className="titre_modif texte_centre">Liste ingrédients</div>
            <div className="elements_centre">
              <button
                className="bouton_board non_selectionnable"
                onClick={(e) => ajoutSection(e)}
              >
                Ajouter une section
              </button>
              <button
                className="bouton_board non_selectionnable"
                onClick={(e) => ajoutIngredient(e)}
              >
                Ajouter un ingredient
              </button>
              <img
                id="icone_poubelle"
                className="icone_supprimer"
                src={iconePoubelle}
              />
            </div>
            {myRct.rct_section_ing.length > 0
              ? myRct.rct_section_ing.map(
                  <div>
                    <input value={myRct.rct_section_ing[0]}></input>
                    <input value={myRct.rct_section_ing[1]}></input>
                  </div>
                )
              : null}
            <BoutonsModifier />
          </form>
        ) : null}
      </div>
      <MenuAjoutRecette toShow={toShow} setToShow={setToShow} pseudo={pseudo} />
      <PiedDePage />
    </div>
  );
}

export default PageCreationRecette;
