// Components
import BarreNavigation from "../components/BarreNavigation";
import FondSite from "../components/FondSite";
import PiedDePage from "../components/PiedDePage";
import MenuAjoutRecette from "../components/MenuAjoutRecette";

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
  });

  // Application des modif qu'au moment de valider
  const [myRct_new, setMyRct_new] = useState({
    rct_name: "",
  });

  // Mes variables
  let { rct_id } = useParams();
  const [changingName, setChangingName] = useState(false);
  const boardModificationName = "board_modification";
  const myBoard = document.getElementById(boardModificationName);

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
  };

  const onSubmitValider = async (e) => {
    e.preventDefault();
    ouvertureModif(false);
    if (updateRecipeDb()) {
      setMyRct({ ...myRct, ...myRct_new });
    }
    setChangingName(false);
  };

  // Fonctions fetch
  async function getName() {
    try {
      const response = await fetch(
        "http://localhost:5000/recipe/getRecipeinfos",
        {
          method: "GET",
          headers: { rct_id: rct_id },
        }
      );

      const parseRes = await response.json();

      if (parseRes.rct_name) {
        setMyRct({
          ...myRct,
          ["rct_name"]: parseRes.rct_name.rows[0].rct_name,
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
        "http://localhost:5000/recipe/changeRecipeInfos",
        {
          method: "Post",
          headers: { rct_id: rct_id, "content-type": "application/json" },

          body: JSON.stringify({
            rct_id: rct_id,
            rct_name: myRct_new.rct_name,
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

  function ouvertureModif(myBool) {
    if (myBool) {
      myBoard.style.left = "0px";
    } else {
      myBoard.style.left = "100vw";
    }
  }

  // Fonctions onChange
  function myOnChange_name(e) {
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
        <div className="titre_recette">
          {myRct.rct_name}
          <img
            id="icone_modifier_titre"
            className="icone_modifier"
            src={iconeModifier}
            onClick={(e) => modifierTitre(e)}
          />
        </div>
        <div className="liste_ingredient"></div>
      </div>
      <div id={boardModificationName} className="board_menu_suppl">
        {changingName ? (
          <form className="menu_modif" onSubmit={(e) => onSubmitValider(e)}>
            <div className="titre_modif">
              Modification du titre de cette recette
            </div>
            <input
              onChange={myOnChange_name}
              className="input_modif"
              type="text"
              name="rct_name"
              placeholder="Veuillez renseigner un titre pour cette recette"
              value={myRct_new.rct_name}
            ></input>
            <BoutonsModifier
              myElement={myBoard}
              mySetUseState={setChangingName}
            />
          </form>
        ) : null}
      </div>
      <MenuAjoutRecette toShow={toShow} setToShow={setToShow} />
      <PiedDePage />
    </div>
  );
}

export default PageCreationRecette;
