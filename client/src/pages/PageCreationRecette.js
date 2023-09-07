// Components
import BarreNavigation from '../components/BarreNavigation'
import FondSite from '../components/FondSite'
import PiedDePage from '../components/PiedDePage'

// Datas
import myFondSite from "../datas/FondSiteSabine.jpg"

// CSS
import "../styles/CSSGeneral.css"
import "../styles_pages/CreationRecette.css"
import { toast } from 'react-toastify';

function PageCreationRecette({isAuth, setIsAuth, pseudo, role}) {
	return (
		<div className='relatif'>
			<FondSite myFondSite={myFondSite}/>
            <BarreNavigation isAuth={isAuth} setIsAuth={setIsAuth} pseudo={pseudo} role={role}/>
			<div className="board">
				<div id="fond_menu_creation_recette" className='fond_menu'></div>
			</div>
			
			<PiedDePage/>
		</div>
	)
}

export default PageCreationRecette