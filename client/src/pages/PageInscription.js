// Components
import BarreNavigation from '../components/BarreNavigation'
import FondSite from '../components/FondSite'
import PiedDePage from '../components/PiedDePage'

// Datas
import myFondSite from "../datas/FondSiteSabine.jpg"

// CSS
import "../styles/CSSGeneral.css"
import "../styles/BoutonBoard.css"
import "../styles/Form.css"
import "../styles_pages/Inscription.css"

// Autre
import React, { useState } from 'react'
import { toast } from 'react-toastify';

function PageInscription({isAuth, setIsAuth}) {
	const [myInfo, setMyInfo] = useState({
		name: "",
		family_name: "",
		pseudo: "",
		mail: "",
		password1: "",
		password2: ""
	});

	const {name, family_name, pseudo, mail, password1, password2} = myInfo;

	const onSubmitForm = async(e) => {
		e.preventDefault();
		try {
				const response = await fetch("http://localhost:5000/auth/inscription", {
					method : "POST",
					headers : {
						"content-type": "application/json"
					},

					body: JSON.stringify({
						name: name,
						family_name: family_name,
						pseudo: pseudo,
						mail: mail,
						password: password1,
						password2: password2
					})
				});

				const parseRes = await response.json();

				if(parseRes.token) {
					localStorage.setItem("token", parseRes.token);
					setIsAuth(true);
					toast.success("Votre demande d'inscription a bien été prise en compte.");
				} else {
					toast.error(parseRes);
				};

		} catch (err) {
			console.error(err.message);
		}
	};

	function myOnChange(e) {
        setMyInfo({...myInfo, [e.target.name]: e.target.value});
    };

	return (
		<div className='relatif'>
			<FondSite myFondSite={myFondSite}/>
            <BarreNavigation isAuth={isAuth} setIsAuth={setIsAuth}/>
			<div className="board">
				<div id="fond_menu_inscription" className='fond_menu'>
					<form onSubmit={onSubmitForm}>
						
						<div className='renseignement'>
							<label>Prénom</label>
							<input
								onChange={myOnChange}
								type="text" name ="name"
								placeholder="Prénom à renseigner">
							</input>
						</div>

						<div className='renseignement'>
							<label>Nom</label>
							<input
								onChange={myOnChange}
								type="text"
								name ="family_name"
								placeholder="Nom à renseigner">
							</input>
						</div>
						
						<div className='renseignement'>
							<label>Pseudo</label>
							<input onChange={myOnChange}
								type="text"
								name ="pseudo"
								placeholder="Pseudo à renseigner">
							</input>
						</div>
						
						<div className='renseignement'>
							<label>Adresse Mail</label>
							<input onChange={myOnChange}
								type="mail"
								name ="mail"
								placeholder="Adresse mail à renseigner">
							</input>
						</div>
						
						<div className='renseignement'>
							<label>Mot de passe, première saisie</label>
							<input
								onChange={myOnChange}
								type="password"
								name ="password1"
								placeholder="Mot de passe">
							</input>
						</div>
						
						<div className='renseignement'>
							<label>Mot de passe, seconde saisie</label>
							<input onChange={myOnChange}
								type="password"
								name ="password2"
								placeholder="Veuillez renseigner votre mot de passe à nouveau">
							</input>
						</div>

						<button
							className="bouton_board non_selectionnable"
							id='bouton_inscription'
							>Inscription
						</button>

					</form>
				</div>
			</div>
			
			<PiedDePage/>
		</div>
	)
}

export default PageInscription