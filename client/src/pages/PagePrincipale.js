// Components
import BarreNavigation from '../components/BarreNavigation'
import FondSite from '../components/FondSite'
import PiedDePage from '../components/PiedDePage'

// Datas
import myFondSite from "../datas/FondSiteSabine.jpg"

// CSS
import "../styles/CSSGeneral.css"
import "../styles_pages/PagePrincipale.css"
import "../styles/BoutonBoard.css"

// Autre
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

function PagePrincipale({isAuth, setIsAuth, pseudo, role}) {
	
	//console.log(pseudo);

	return (		
		<div className='relatif'>
			<FondSite myFondSite={myFondSite}/>
            <BarreNavigation isAuth={isAuth} setIsAuth={setIsAuth} pseudo={pseudo} role ={role} />
			<div className="board">
				
				<div id="titre_site" className='non_selectionnable'>Les Recettes de Sabine</div>
				{!isAuth ?
					<div id="boutons_connexion">
							<Link className="bouton_board non_selectionnable" to="/connexion">Connexion</Link>
							<Link className="bouton_board non_selectionnable" to="/inscription">Inscription</Link>
					</div>
					:<div></div>
				}

			</div>
			
			<PiedDePage/>
		</div>
	)
}

export default PagePrincipale