// CSS
import "../styles/BarreNavigation.css";
import "../styles/Bandeau.css";

// Data
import bandeau from "../datas/Bandeau.jpg";

// Autres
import React, { useState, useEffect } from "react";

function Bandeau({ mySize }) {
  const [myHeight, setMyHeight] = useState("230px");

  useEffect(() => {
    if (mySize === "small") {
      setMyHeight("100px");
    } else if (mySize === "medium") {
      setMyHeight("230px");
    } else if (mySize === "big") {
      setMyHeight("600px");
    }
  }, []);

  return (
    <img className="img_bandeau" src={bandeau} style={{ height: myHeight }} />
  );
}

export default Bandeau;
