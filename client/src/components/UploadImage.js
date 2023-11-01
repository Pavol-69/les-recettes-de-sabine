// Style
import "../styles/UploadImage.css";

// Autre
import { useState } from "react";
import request from "superagent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "font-awesome/css/font-awesome.min.css";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import Dropzone from "react-dropzone";

function UploadImage({ myRct_new, setMyRct_new, i }) {
  const CLOUDINARY_UPLOAD_PRESET = "LesRecettesDeSabine";
  const CLOUDINARY_UPLOAD_URL =
    "https://api.cloudinary.com/v1_1/lesrecettesdesabine/upload";

  const onImageDrop = (e) => {
    let upload = request
      .post(CLOUDINARY_UPLOAD_URL)
      .field("upload_preset", CLOUDINARY_UPLOAD_PRESET)
      .field("file", e[0]);
    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }
      if (response.body.secure_url !== "") {
        let myList = myRct_new.rct_img;
        myList[i] = response.body.secure_url;
        setMyRct_new({
          ...myRct_new,
          rct_img: myList,
        });
      }
    });
  };

  const deleteImg = (e) => {
    let myList = myRct_new.rct_img;
    for (let j = i; j < myList.length - 1; j++) {
      myList[j] = myList[j + 1];
    }
    myList[4] = "";
    setMyRct_new({
      ...myRct_new,
      rct_img: myList,
    });
  };

  return myRct_new.rct_img[i] === "" ? (
    <div key={i + "withoutImg"} className="paquet_drop">
      <Dropzone onDrop={(e) => onImageDrop(e)}>
        {({ getRootProps, getInputProps }) => (
          <div className="drop_img elements_centre colonne" {...getRootProps()}>
            <FontAwesomeIcon
              icon={faImage}
              className="no_img"
              size={"9x"}
              style={{ color: "#000000" }}
              onChange={onImageDrop}
            />
            <input {...getInputProps()} />
            <div className="gras elements_centre texte_taille_3">
              Ajouter/Déposer une image
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  ) : (
    <div key={i + "withImg"} className="paquet_drop">
      <Dropzone onDrop={(e) => onImageDrop(e)}>
        {({ getRootProps, getInputProps }) => (
          <div className="drop_img elements_centre" {...getRootProps()}>
            <img src={myRct_new.rct_img[i]} />
            <input {...getInputProps()} />
          </div>
        )}
      </Dropzone>
      <div
        class="drop_img_delete texte_taille_2 elements_centre gras"
        onClick={deleteImg}
      >
        X
      </div>
    </div>
  );
}

export default UploadImage;
