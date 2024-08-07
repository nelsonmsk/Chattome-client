import { signout } from './api-auth';

export const authenticate = (jwt,cb) => {
	if(typeof window !== "undefined"){
		localStorage.setItem('jwt', JSON.stringify(jwt));
		cb();
	}
};

export const isAuthenticated = () => {
	if (typeof window == "undefined"){
		return false;
	}
	if (localStorage.getItem('jwt')){
		return JSON.parse(localStorage.getItem('jwt'))
	} else {
		return false;
	}
};


export const clearJWT = (cb) =>{
	if(typeof window !== "undefined"){
		localStorage.removeItem('jwt');
		cb();
		signout().then((data) => {
			document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00UTC; path=/;"
		});
	}
};

