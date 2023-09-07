// Components
import BarreNavigation from '../components/BarreNavigation'
import FondSite from '../components/FondSite'
import PiedDePage from '../components/PiedDePage'

// Datas
import myFondSite from "../datas/FondSiteSabine.jpg"

// CSS
import "../styles/CSSGeneral.css"
import "../styles_pages/Admin.css"
import { toast } from 'react-toastify';

function PageAdmin({isAuth, setIsAuth, pseudo, role}) {
	
	getAllUsersInfos();
	
	async function getAllUsersInfos() {
		try {
			const response = await fetch("http://localhost:5000/dashboard/allUsersInfos", {
				method : "GET",
				headers: {token: localStorage.token}
			});

			const parseRes = await response.json();
			return(parseRes.rows);

		} catch (err) {
			console.error(err.message);
		}
	}
	
	return (
		<div className='relatif'>
			<FondSite myFondSite={myFondSite}/>
            <BarreNavigation isAuth={isAuth} setIsAuth={setIsAuth} pseudo={pseudo} role={role}/>
			<div className="board">
				<div id="fond_menu_connexion" className='fond_menu'></div>
			</div>
			
			<PiedDePage/>
		</div>
	)
}

export default PageAdmin