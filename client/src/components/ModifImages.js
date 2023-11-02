// Components
import "./UploadImage";

// CCS
import "../styles/CSSGeneral.css";
import "../styles_pages/CreationRecette.css";
import "../styles/BoutonBoard.css";
import "../styles/ModifImages.css";

// Autre
import React, { useState, useEffect } from "react";
import UploadImage from "./UploadImage";

function ModifImages({
  rct_id,
  myRct,
  setMyRct,
  defaultValue,
  setChangingImg,
  myBoard,
}) {
  let [value, setValue] = useState(["", "", "", "", ""]);

  function ouvertureModif(myBool) {
    if (myBool) {
      myBoard.style.left = "0px";
    } else {
      myBoard.style.left = "100vw";
    }
  }

  const annuler = (e) => {
    e.preventDefault();
    ouvertureModif(false);
    setChangingImg(false);
  };

  const onSubmitValider = async (e) => {
    e.preventDefault();
    console.log(value);
  };

  useEffect(() => {
    console.log("toto");
  }, []);

  useEffect(() => {
    console.log("page modif");
    console.log(myRct);
  }, [myRct]);

  return (
    <div>
      <form
        id="menu_modif_images"
        className="menu_modif elements_centre"
        onSubmit={(e) => onSubmitValider(e)}
      >
        <div className="titre_modif texte_centre">
          Choisissez les images que vous souhaitez intégrer à votre recette (5
          maximum)
        </div>
        <div id="plage_insersion_image" className="ligne elements_centre">
          {value.map((imgUrl, index) =>
            value[index - 1] !== "" ? (
              <UploadImage
                key={"img" + index}
                myRct={myRct}
                value={value}
                setValue={setValue}
                i={index}
              />
            ) : null
          )}
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
    </div>
  );
}

export default ModifImages;
