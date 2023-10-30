// Components
import "./UploadImage";

// CCS
import "../styles/CSSGeneral.css";
import "../styles_pages/CreationRecette.css";
import "../styles/BoutonBoard.css";
import "../styles/ModifImages.css";

// Autre
import { toast } from "react-toastify";
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
  const [uploadedFileUrl, setUploadedFileUrl] = useState({
    uploadedFiles: null,
  });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [change, setChange] = useState(true);

  function ouvertureModif(myBool) {
    if (myBool) {
      myBoard.style.left = "0px";
    } else {
      myBoard.style.left = "100vw";
    }
  }

  const [img, setImg] = useState("");

  const annuler = (e) => {
    e.preventDefault();
    ouvertureModif(false);
    setChangingImg(false);
  };

  const onSubmitValider = async (e) => {
    e.preventDefault();
    let myElt = document.getElementById("plage_insersion_image");
    //setImg(URL.createObjectURL(myElt.childNodes[0].files[0]));
  };

  const myArray = [1, 2, 3, 4, 5];

  return (
    <div>
      <form
        id="menu_modif_images"
        className="menu_modif elements_centre"
        onSubmit={(e) => onSubmitValider(e)}
      >
        <div className="titre_modif texte_centre">
          Choisissez les images que vous souhaitez intégrer à votre recette
        </div>
        <div id="plage_insersion_image">
          {/*myArray.map((i) => (
            <div className="ligne_upload">
              Image {i} : <input key={i} type="file" name="upfile" />
            </div>
          ))*/}
          <UploadImage />
        </div>
        <img src={img}></img>
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
