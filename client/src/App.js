// Components
import PageCreationRecette from './pages/PageCreationRecette'
import PageConnexion from './pages/PageConnexion'
import PageInscription from './pages/PageInscription'
import PageAdmin from './pages/PageAdmin'
import PagePrincipale from './pages/PagePrincipale'

//CSS
import './styles/CSSGeneral.css'
import './styles/index.css'

// Autre
import React, { useState, useEffect } from 'react'
import {
  createBrowserRouter,
  RouterProvider, 
  Navigate
} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

	const [isAuth, setIsAuth] = useState(isVerify());
	const [role, setRole] = useState(CheckInfos());
	const [pseudo, setPseudo] = useState(CheckInfos());
	const [isLoading, setIsLoading] = useState(false);

	async function getUserInfos(test) {
		try {
			const response = await fetch("http://localhost:5000/dashboard/userInfos", {
				method : "GET",
				headers: {token: localStorage.token}
			});

			const parseRes = await response.json();
			setPseudo(parseRes.user_pseudo);
			setRole(parseRes.user_role);
			if(test === "toto"){console.log("role : " + role)};
		} catch (err) {
			console.error(err.message);
		}
	};

	async function isVerify() {
		try {
			const response = await fetch("http://localhost:5000/auth/is-verified", {
				method : "GET",
				headers: {token: localStorage.token}
			});

			const parseRes = await response.json()
			parseRes === true ? setIsAuth(true) : setIsAuth(false);
			return(parseRes);
			

		} catch (err) {
			console.error(err.message);
		}
	};

function CheckInfos() {
		getUserInfos();
		isVerify();
	}

	useEffect (() => {
		CheckInfos(); 
		setIsLoading(true);
		console.log("isLoading : " + isLoading);
		console.log("role : " + role);
		console.log("pseudo : " + pseudo);
		console.log("isAuth : " + isAuth);
	}, []);

	const router = createBrowserRouter([
		{
		  	path: "/",
		  	element: <PagePrincipale isAuth={isAuth} setIsAuth={setIsAuth} pseudo={pseudo} role={role}/>,
		},
		{
		  	path: "/inscription",
		  	element: 
					!isAuth ? (
					<PageInscription isAuth={isAuth} setIsAuth={setIsAuth}/>
				) : (
					<Navigate to="/" />
				)
		},
		{
		  	path: "/connexion",
		  	element: !isAuth ? (
					<PageConnexion isAuth={isAuth} setIsAuth={setIsAuth}/>
				) : (
					<Navigate to="/" />
				)
		},
		{
		  	path: "/creation-recette",
		  	element: isAuth ? (
					<PageCreationRecette isAuth={isAuth} setIsAuth={setIsAuth} pseudo={pseudo} role={role}/>
				) : (
					<Navigate to="/" />
				)
		},
		{
		  	path: "/admin",
		  	element: //isLoading ? (
				isAuth && role === "admin" ?
					<PageAdmin isAuth={isAuth} setIsAuth={setIsAuth} pseudo={pseudo} role={role}/>
				:
					<Navigate to="/" />
				//) : null
		},
	  ]);

	return (
		<React.StrictMode>
			<RouterProvider router={router}/>
			<ToastContainer />
		</React.StrictMode>
	);
}

export default App