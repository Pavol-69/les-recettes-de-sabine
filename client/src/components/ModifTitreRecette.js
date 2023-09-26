// CCS
import "../styles/CSSGeneral.css";
import "../styles_pages/CreationRecette.css";
import "../styles/BoutonBoard.css";
import "../styles/ModifTitreRecette.css";

// Autre
import { toast } from "react-toastify";

function ModifTitreRecette({
  rct_id,
  myRct,
  setMyRct,
  myRct_new,
  setMyRct_new,
  setChangingName,
  myBoard,
}) {
  // Fonctions onChange
  function myOnChange(e) {
    setMyRct_new({ ...myRct_new, [e.target.name]: e.target.value });
  }

  const annuler = (e) => {
    e.preventDefault();
    ouvertureModif(false);
    setChangingName(false);
  };

  const onSubmitValider = async (e) => {
    e.preventDefault();

    if (updateRecipeDb()) {
      ouvertureModif(false);
      setChangingName(false);
      setMyRct({ ...myRct, ...myRct_new });
    }
  };

  function ouvertureModif(myBool) {
    if (myBool) {
      myBoard.style.left = "0px";
    } else {
      myBoard.style.left = "100vw";
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

  return (
    <form
      id="menu_modif_titre_recette"
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
    </form>
  );
}

export default ModifTitreRecette;
