// CCS
import "../styles/CSSGeneral.css";
import "../styles/VignetteRecette.css";

// Autres
import { Link } from "react-router-dom";

function VignetteRecette({ myId, myName }) {
  return (
    <Link id={myId} className="vignette_recette" to={"/recette/" + myId}>
      <div>{myName}</div>
    </Link>
  );
}

export default VignetteRecette;
