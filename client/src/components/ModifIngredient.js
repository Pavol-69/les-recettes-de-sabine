// CCS
import "../styles/CSSGeneral.css";
import "../styles_pages/CreationRecette.css";
import "../styles/BoutonBoard.css";
import "../styles/ModifIngredient.css";

// Autre
import React, { useState } from "react";
import { toast } from "react-toastify";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "font-awesome/css/font-awesome.min.css";
import {
  faTrash,
  faArrowsUpDownLeftRight,
} from "@fortawesome/free-solid-svg-icons";

function ModifIngredient({
  rct_id,
  myRct,
  setMyRct,
  myRct_new,
  setMyRct_new,
  setChangingIngredients,
  myBoard,
}) {
  const [mySupprBool, setMySupprBool] = useState(false);

  function ouvertureModif(myBool) {
    if (myBool) {
      myBoard.style.left = "0px";
    } else {
      myBoard.style.left = "100vw";
    }
  }

  async function updateRecipeDb(mySectionIngList, myIngList) {
    try {
      const response = await fetch(
        "http://localhost:5000/recipe/updateRecipeIngredients",
        {
          method: "Post",
          headers: { rct_id: rct_id, "content-type": "application/json" },

          body: JSON.stringify({
            rct_id: rct_id,
            rct_section_ing: mySectionIngList,
            rct_ing: myIngList,
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

  function annuler(e) {
    e.preventDefault();
    ouvertureModif(false);
    setChangingIngredients(false);
  }

  function onSubmitValider(e) {
    e.preventDefault();
    // Enregistrement de toutes nos nouvelles données

    let k = 0;
    let myIngList = [];
    let mySectionIngList = [];
    let myField = document.getElementById("field_sections");
    mySectionIngList.push(["no_section", 1]);

    for (let i = 0; i < myField.childNodes.length; i++) {
      let myNode = myField.childNodes[i];
      // Sections
      if (i > 0) {
        mySectionIngList.push([
          myNode.childNodes[0].childNodes[3].value,
          i + 1,
        ]);
        myNode = myNode.childNodes[1];
      } else {
        myNode = myNode.childNodes[0];
      }

      // Ingrédients
      for (let j = 0; j < myNode.childNodes.length; j++) {
        let mySubNode = myNode.childNodes[j];
        k++;
        myIngList.push([
          mySubNode.childNodes[0].childNodes[3].value,
          mySubNode.childNodes[0].childNodes[4].value,
          mySubNode.childNodes[0].childNodes[5].value,
          i + 1,
          k,
        ]);
      }
    }

    setMyRct_new({
      ...myRct_new,
      rct_section_ing: mySectionIngList,
      rct_ing: myIngList,
    });

    if (updateRecipeDb(mySectionIngList, myIngList)) {
      setMyRct({
        ...myRct,
        rct_section_ing: mySectionIngList,
        rct_ing: myIngList,
      });
      ouvertureModif(false);
      setChangingIngredients(false);
    }
  }

  function ajoutSection(e) {
    e.preventDefault();
    setMyRct_new((prevState) => {
      let mySectionIngList = [...myRct_new.rct_section_ing];
      mySectionIngList.push(["", prevState.rct_section_ing.length + 1]);

      return {
        ...prevState,
        rct_section_ing: mySectionIngList,
      };
    });
  }

  function ajoutIngredient(e) {
    e.preventDefault();
    setMyRct_new((prevState) => {
      console.log(prevState.rct_section_ing);
      return {
        ...prevState,
        rct_ing: prevState.rct_ing.concat([
          [
            0,
            "",
            "",
            prevState.rct_section_ing[0][1],
            prevState.rct_ing.length + 1,
          ],
        ]),
      };
    });
  }

  // Fonctions onChange
  const myOnChange_section_ing = (e) => {
    setMyRct_new((prevState) => {
      let mySectionIngList = [...myRct_new.rct_section_ing];
      const mySplit = e.target.name.split("_");
      let myPosition = mySplit[mySplit.length - 1];
      for (let i = 0; i < mySectionIngList.length; i++) {
        if (mySectionIngList[i][1] === myPosition) {
          myPosition = i;
        }
      }
      console.log(myPosition);
      mySectionIngList[myPosition - 1][0] = e.target.value;
      return {
        ...prevState,
        rct_section_ing: mySectionIngList,
      };
    });
  };

  function myOnChange_ing(e) {
    let myIngList = [];
    myIngList = myRct_new.rct_ing;
    const mySplit = e.target.name.split("_");
    let myPosition = Number(mySplit[mySplit.length - 2]);
    let myColumn = Number(mySplit[mySplit.length - 1]);
    myIngList[myPosition - 1][myColumn] = e.target.value;
    setMyRct_new((prevState) => ({
      ...prevState,
      rct_ing: myIngList,
    }));
  }

  // Fonction drag&drop pour les sections
  function dragDrop(e) {
    // Vérification de si on prend bien le bon élément kl
    if (e.target.className === "saisie") {
      let isSection = false;
      let isIngredient = false;

      if (e.target.parentNode.className === "ligne_section") {
        isSection = true;
      }
      if (e.target.parentNode.className === "ligne_ingredient") {
        isIngredient = true;
      }

      if (isSection || isIngredient) {
        // Ma poubelle pour suppression
        const maPoubelle = document.getElementById("icone_poubelle");

        // Coordonnées souris
        let myX = 0;
        let myY = 0;

        // Récupération des éléments sous forme de variable
        const myDrag = e.target.parentNode.parentNode;
        let myField = "";
        if (isSection) {
          myField = myDrag.parentNode;
        }
        if (isIngredient) {
          myField = myDrag.parentNode.parentNode.parentNode; // et oui, on remonte loin..
        }

        // Changement du nom de class pour bien le repérer, on sauvegarde l'ancien pour le restituer plus tard
        let myOldClass = myDrag.className;
        myDrag.className = "drag";

        // Création d'une div tempo qui aider l'utilisateur à savoir où est ce qu'il va drop son élément
        let myTempo = document.createElement("div");
        myTempo.className = "ligne_section_tempo";
        myField.appendChild(myTempo);
        myTempo.style.height = myDrag.offsetHeight + "px";
        if (isIngredient) {
          myTempo.style.marginLeft = "50px";
        }

        // L'élément pris en drag passe en position absolute pour suivre les mouvements de la souris
        myDrag.style.position = "absolute";

        document.addEventListener("mousemove", onMouseMove);
        myBoard.addEventListener("mouseup", onMouseUp);

        // Récupération de toute sections qui ne sont pas ni drag ni tempo, ça nous donne une base fice pour repositionner l'élément drag ensuite
        let myTopList = [];
        let myTop = [];
        let myHeight = [];

        if (isSection) {
          // on démarre à 1 pour ne pas prendre le premier qui ne concerne que la sous catégorie, on veut qu'il reste en tête
          for (let i = 1; i < myField.childNodes.length; i++) {
            if (
              myField.childNodes[i].className !== "ligne_section_tempo" &&
              myField.childNodes[i].className !== "drag"
            ) {
              myTopList.push(myField.childNodes[i]);
              myTop.push(myField.childNodes[i].offsetTop);
            }
          }
        }

        if (isIngredient) {
          for (let i = 0; i < myField.childNodes.length; i++) {
            let myNode = myField.childNodes[i];
            if (
              i > 0 &&
              myNode.className !== "ligne_section_tempo" &&
              myNode.className !== "drag"
            ) {
              myTopList.push(myNode);
              myTop.push(myNode.offsetTop);
              myHeight.push(myNode.offsetHeight);
            }
            for (let j = 0; j < myNode.childNodes.length; j++) {
              let mySubNode = myNode.childNodes[j];
              if (mySubNode.className === "paquet_ligne_ing") {
                for (let k = 0; k < mySubNode.childNodes.length; k++) {
                  if (
                    mySubNode.childNodes[k].className !==
                      "ligne_section_tempo" &&
                    mySubNode.childNodes[k].className !== "ligne_section" &&
                    mySubNode.childNodes[k].className !== "drag"
                  ) {
                    myTopList.push(mySubNode.childNodes[k]);
                    myTop.push(mySubNode.childNodes[k].offsetTop);
                    myHeight.push(mySubNode.childNodes[k].offsetHeight);
                  }
                }
              }
            }
          }
        }

        if (myTopList.length === 0) {
          myTempo.style.width = myDrag.offsetWidth + "px";
        }

        // Future position de l'élément drag, par rapport aux éléments fixe de la liste qu'on vient d'enregistrer
        let myPosition = 0;

        function onMouseMove(event) {
          // Coordonnées de la souris
          myX = event.pageX;
          myY = event.pageY;

          // on repositionne l'élément drag par rapport à la souris afin qu'on est l'impression qu'on ait sélectionné le milieu du bloc de saisie
          if (isIngredient) {
            myDrag.style.left = myX - 71 + "px";
          } else {
            myDrag.style.left = myX - 31 + "px";
          }
          myDrag.style.top = myY - 31 + myBoard.scrollTop + "px";

          // Changement de l'animation de la poubelle quand on passe dessus
          if (
            myY > maPoubelle.offsetTop - myBoard.scrollTop &&
            myY <
              maPoubelle.offsetTop +
                maPoubelle.offsetHeight -
                myBoard.scrollTop &&
            myX > maPoubelle.offsetLeft &&
            myX < maPoubelle.offsetLeft + maPoubelle.offsetWidth
          ) {
            setMySupprBool(true);
          } else {
            setMySupprBool(false);
          }

          // si myTopList est vide, on ne peut pas faire ce qui suit
          if (myTopList.length > 0) {
            // Avant le premier élément de la liste, forcément première position, on place l'élément tempo avant, et myPosition = -1 pour indiquer la première position au if pour repositionné l'élément drag
            if (
              myY <
              myTopList[0].offsetTop +
                15 - //myTopList[0].offsetHeight / 2 -
                myBoard.scrollTop
            ) {
              myTopList[0].before(myTempo);
              myPosition = -1;
            }

            // Parcours de tous les éléments fixes contenus dans myTopList, on enregistre la position et place l'élément tempo en fonction d'entre quelles lignes on se trouve
            for (let i = myTopList.length - 1; i > 0; i--) {
              if (
                myY <
                  myTopList[i].offsetTop +
                    15 - //myTopList[i].offsetHeight / 2 -
                    myBoard.scrollTop &&
                myY >
                  myTopList[i - 1].offsetTop +
                    15 - //myTopList[i - 1].offsetHeight / 2 -
                    myBoard.scrollTop
              ) {
                myPosition = i;
                myTopList[myPosition].before(myTempo);
              }
            }

            // Après le dernier élément, forcément dernière position, myPosition = -2 -> code pour dernière position
            if (
              myY >
              myTopList[myTopList.length - 1].offsetTop +
                15 - //myTopList[myTopList.length - 1].offsetHeight / 2 -
                myBoard.scrollTop
            ) {
              myPosition = -2;
              myTopList[myTopList.length - 1].after(myTempo);
            }
          } else {
            myPosition = -3;
          }
        }

        // Dès que le clique de la souris se relève
        function onMouseUp(event) {
          // Suppression de l'évenement mousemove
          document.removeEventListener("mousemove", onMouseMove);
          myBoard.removeEventListener("mouseup", onMouseUp);

          // Suppression de myDrag si myPosition = -3, sinon on met à jour tout le reste
          if (
            myY > maPoubelle.offsetTop + myBoard.scrollTop &&
            myY <
              maPoubelle.offsetTop +
                maPoubelle.offsetHeight +
                myBoard.scrollTop &&
            myX > maPoubelle.offsetLeft &&
            myX < maPoubelle.offsetLeft + maPoubelle.offsetWidth
          ) {
            myDrag.remove();
            setMySupprBool(false);
          } else {
            // placement de l'élément drag selon la position enregistrée

            if (isSection) {
              if (myPosition === -1) {
                myTopList[0].before(myDrag);
              } else if (myPosition === -2) {
                myTopList[myTopList.length - 1].after(myDrag);
              } else if (myPosition === -3) {
                myField.appendChild(myDrag);
              } else {
                myTopList[myPosition].before(myDrag);
              }
            }

            if (isIngredient) {
              if (myPosition === -1) {
                // Si première position mais que le compartiment "no_section" est vide, il faut le mettre dedans plutôt que "avant le premier élément"
                if (myField.childNodes[0].childNodes.length > 0) {
                  myTopList[0].before(myDrag);
                } else {
                  myField.childNodes[0].childNodes[1].appendChild(myDrag);
                }
              } else if (myPosition === -2) {
                // Si le dernier élément est une section, il faut mettre l'ingrédient dedans et non pas en dernière position
                if (
                  myTopList[myTopList.length - 1].childNodes[0].className ===
                  "ligne_section"
                ) {
                  myTopList[myTopList.length - 1].childNodes[1].appendChild(
                    myDrag
                  );
                } else {
                  myTopList[myTopList.length - 1].after(myDrag);
                }
              } else if (myPosition === -3) {
                myField.childNodes[0].childNodes[0].appendChild(myDrag);
              } else {
                // Dans le cas où on veut le mettre à la fin d'une section, c'est que l'élément suivant est une section, donc appendChild à l'élément n-1
                // Attention à l'élément 0, particulier car non présent dans myTopList
                if (
                  myTopList[myPosition].childNodes[0].className ===
                    "ligne_section" &&
                  myPosition > 0
                ) {
                  if (
                    myTopList[myPosition - 1].childNodes[0].className ===
                    "ligne_section"
                  ) {
                    myTopList[myPosition - 1].childNodes[1].appendChild(myDrag);
                  } else {
                    myTopList[myPosition - 1].after(myDrag);
                  }
                } else {
                  myTopList[myPosition].before(myDrag);
                }
              }
            }

            // On remet en tous les paramètres qu'on avait changé
            myDrag.style.position = "static";
            myDrag.style.top = "0px";
            myDrag.style.left = "0px";
            myDrag.className = myOldClass;
          }

          myTopList = [];
          document.onmouseup = null;

          // Suppression de l'élément tempo
          myTempo.remove();
        }
      }
    }
  }

  return (
    <form
      className="menu_modif elements_centre"
      //onSubmit={(e) => onSubmitValider(e)}
    >
      <div className="titre_modif texte_centre decalage_bandeau">
        Liste ingrédients
      </div>
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
          Ajouter un ingrédient
        </button>
        <div id="icone_poubelle">
          <FontAwesomeIcon
            id="icone_poubelle_img"
            icon={faTrash}
            bounce={mySupprBool}
            style={{ color: "#000000" }}
          />
        </div>
      </div>
      <div id="field_sections">
        {myRct_new.rct_section_ing.length > 0
          ? myRct_new.rct_section_ing.map((section_ing) => (
              <div className="case">
                {section_ing[0] !== "no_section" ? (
                  <div className="ligne_section">
                    <div className="case_icone_4_fleches elements_centre">
                      <FontAwesomeIcon
                        size="2x"
                        icon={faArrowsUpDownLeftRight}
                        style={{ color: "#000000" }}
                      />
                    </div>
                    <div
                      className="saisie"
                      onMouseDown={(e) => dragDrop(e)}
                    ></div>
                    <div className="non_select">Section : </div>
                    <input
                      onChange={myOnChange_section_ing}
                      className="input_section_ing non_select"
                      name={"input_section_ing_" + section_ing[1]}
                      value={section_ing[0]}
                      type="text"
                      placeholder="Veuillez renseigner un nom de section"
                    ></input>
                  </div>
                ) : null}

                <div className="paquet_ligne_ing">
                  {myRct_new.rct_ing.length > 0
                    ? myRct_new.rct_ing.map((ing) =>
                        ing[3] === section_ing[1] ? (
                          <div className="case">
                            <div className="ligne_ingredient">
                              <div className="case_icone_4_fleches elements_centre">
                                <FontAwesomeIcon
                                  size="2x"
                                  icon={faArrowsUpDownLeftRight}
                                  style={{ color: "#000000" }}
                                />
                              </div>
                              <div
                                className="saisie"
                                onMouseDown={(e) => dragDrop(e)}
                              ></div>

                              <div className="non_select elements_centre">
                                Ingrédient :
                              </div>
                              <input
                                onChange={myOnChange_ing}
                                className="input_ing_qty non_select"
                                name={"input_ing_qty_" + ing[4] + "_0"}
                                type="number"
                                value={ing[0]}
                              ></input>
                              <input
                                onChange={myOnChange_ing}
                                className="input_ing_unit non_select"
                                name={"input_ing_unit_" + ing[4] + "_1"}
                                type="text"
                                value={ing[1]}
                                placeholder="Unité..."
                              ></input>
                              <input
                                onChange={myOnChange_ing}
                                className="input_ing_what non_select"
                                name={"input_ing_what_" + ing[4] + "_2"}
                                type="text"
                                value={ing[2]}
                                placeholder=" Nom de l'ingrédient..."
                              ></input>
                            </div>
                          </div>
                        ) : null
                      )
                    : null}
                </div>
              </div>
            ))
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

export default ModifIngredient;