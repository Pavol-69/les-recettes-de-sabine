// Components
import BarreNavigation from '../components/BarreNavigation'
import FondSite from '../components/FondSite'
import PiedDePage from '../components/PiedDePage'

// Datas
import myFondSite from "../datas/FondSiteSabine.jpg"

// CSS
import "../styles/CSSGeneral.css"
import "../styles_pages/Admin.css"
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';

function PageAdmin({isAuth, setIsAuth, pseudo, role}) {
	
	const [myUsers, setMyUsers] = useState([]);
	
	async function getAllUsersInfos() {
		try {
			const response = await fetch("http://localhost:5000/dashboard/allUsersInfos", {
				method : "GET",
				headers: {token: localStorage.token}
			});

			const parseRes = await response.json();
			setMyUsers(parseRes.rows);
		} catch (err) {
			console.error(err.message);
		}
	};

	useEffect (() => {
		getAllUsersInfos();
	}, []);

	async function handleChange(e){
		try {
			const response = await fetch("http://localhost:5000/dashboard/changeRole", {
				method : "POST",
				headers: {
					token: localStorage.token,
					role: e.target.value
				}
			});

			const parseRes = await response.json()
			if(parseRes){
				if(parseRes.token) {
					toast.success("Connexion réussie");
				} else {
					toast.error(parseRes);
				};
			};
			

		} catch (err) {
			console.error(err.message);
		}
	};
	
	return (
		<div className='relatif'>
			<FondSite myFondSite={myFondSite}/>
            <BarreNavigation isAuth={isAuth} setIsAuth={setIsAuth} pseudo={pseudo} role={role}/>
			<div className="board">
				<div id="fond_menu_admin" className='fond_menu'>
					<div className='ligne_user'>
						<div className='prenom_user'>Prenom</div>
						<div className='nom_user'>Nom</div>
						<div className='role_user'>Rôle</div>
					</div>
					{myUsers.map(user => 
						<div className='ligne_user'>
							<div className='prenom_user' key={`${user.user_name}-${user.user_id}`}>{user.user_name}</div>
							<div className='nom_user' key={`${user.user_family_name}-${user.user_id}`}>{user.user_family_name}</div>
							<select onChange={(e) => handleChange(e)} defaultValue={user.user_role}>
								<option value="to_define">A Définir</option>
								<option value="rejected">Rejeté</option>
								<option value="reader">Lecteur</option>
								<option value="writer">Rédacteur</option>
								<option value="admin">Administrateur</option>
							</select>
						</div>
						)}
				</div>
			</div>
			
			<PiedDePage/>
		</div>
	)
}

export default PageAdmin