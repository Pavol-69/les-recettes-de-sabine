// CCS
import "../styles/CSSGeneral.css";
import "../styles_pages/CreationRecette.css";
import "../styles/BoutonBoard.css";
import "../styles/ModifTitreRecette.css";

// Autre
import { toast } from "react-toastify";

function ModifCat({
  oldName,
  setOldName,
  newName,
  setNewName,
  myBoard,
  setCatList,
}) {
  function myOnChange(e) {
    setNewName(e.target.value);
  }

  const annuler = (e) => {
    e.preventDefault();
    ouvertureModif(false);
    setNewName("");
    setOldName("");
  };

  const onSubmitValider = async (e) => {
    e.preventDefault();

    /*console.log("Ancien nom : " + oldName);
    console.log("Nouveau nom : " + newName);*/

    if (updateCatName()) {
      ouvertureModif(false);
      setNewName("");
      setOldName("");
    }
  };

  function ouvertureModif(myBool) {
    if (myBool) {
      myBoard.style.left = "0px";
    } else {
      myBoard.style.left = "100vw";
    }
  }

  async function updateCatName() {
    try {
      const response = await fetch(
        "http://localhost:5000/recipe/updateCategoryName",
        {
          method: "Post",
          headers: {
            token: localStorage.token,
            "content-type": "application/json",
          },

          body: JSON.stringify({
            old_name: oldName,
            cat_name: newName,
          }),
        }
      );

      const parseRes = await response.json();

      if (Array.isArray(parseRes)) {
        toast.success("Catégorie renommée.");
        setCatList(parseRes);
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
      id="menu_modif_nom_categorie"
      className="menu_modif elements_centre"
      onSubmit={(e) => onSubmitValider(e)}
    >
      <div className="titre_modif texte_centre">
        Modification du nom de la Catégorie
      </div>
      <input
        onChange={myOnChange}
        className="input_modif"
        type="text"
        name="cat_name"
        placeholder="Veuillez renseigner un nom pour cette catégorie"
        value={newName}
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

export default ModifCat;
