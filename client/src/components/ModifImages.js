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
  myRct_new,
  setMyRct_new,
  setChangingImg,
  myBoard,
}) {
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
    //console.log(myRct.rct_img);
  };

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
          {myRct_new.rct_img.map((imgUrl, index) =>
            myRct_new.rct_img[index - 1] !== "" ? (
              <UploadImage
                myRct_new={myRct_new}
                setMyRct_new={setMyRct_new}
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
