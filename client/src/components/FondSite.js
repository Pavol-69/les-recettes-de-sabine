// Styles
import "../styles/FondSite.css";

function FondSite({ myFondSite }) {
  return (
    <div
      className="font_site"
      style={{ backgroundImage: `url(${myFondSite})` }}
    ></div>
  );
}

export default FondSite;
