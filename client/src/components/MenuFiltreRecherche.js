// CCS
import "../styles/CSSGeneral.css";
import "../styles/BoutonBoard.css";
import "../styles/ModifCategorie.css";

function MenuFiltreRecherche({
  myFilterList,
  setMyFilterList,
  myBoard,
  myFilterBool,
  setMyFilterBool,
}) {
  const annuler = (e) => {
    e.preventDefault();
    ouvertureModif(false);
    setMyFilterBool(false);
  };

  const onSubmitValider = async (e) => {
    e.preventDefault();
    let myList = myFilterList;
    for (let i = 0; i < myList.length; i++) {
      if (
        myBoard.childNodes[0].childNodes[1].childNodes[i].className.indexOf(
          "selected"
        ) === 0
      ) {
        myList[i][1] = true;
      } else {
        myList[i][1] = false;
      }
    }
    setMyFilterList(myList);
    ouvertureModif(false);
    setMyFilterBool(false);
  };

  const catSelect = (e) => {
    e.preventDefault();

    let myBool = false;

    if (e.target.className.indexOf("selected") === 0) {
      e.target.className = e.target.className.replace(
        "selected",
        "non_selected"
      );
      myBool = false;
    } else if (e.target.className.indexOf("non_selected") === 0) {
      e.target.className = e.target.className.replace(
        "non_selected",
        "selected"
      );
      myBool = true;
    }
  };

  function ouvertureModif(myBool) {
    if (myBool) {
      myBoard.style.left = "0px";
    } else {
      myBoard.style.left = "100vw";
    }
  }

  return (
    <form
      id="menu_modif_categorie"
      className="menu_modif elements_centre"
      onSubmit={(e) => onSubmitValider(e)}
    >
      <div className="titre_modif texte_centre">Filtrer par catégorie</div>
      <div className="elements_centre">
        {myFilterList.length > 0
          ? myFilterList.map((cat) =>
              cat[1] ? (
                <div
                  onClick={(e) => catSelect(e)}
                  className="selected elements_centre gras"
                >
                  {cat[0]}
                </div>
              ) : (
                <div
                  onClick={(e) => catSelect(e)}
                  className="non_selected elements_centre gras"
                >
                  {cat[0]}
                </div>
              )
            )
          : null}
      </div>
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

export default MenuFiltreRecherche;
