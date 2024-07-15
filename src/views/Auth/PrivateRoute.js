import React,{Component} from 'react';
import { Navigate, Route } from 'react-router-dom';
import * as auth from './auth-helper';
import EditProfile from '../Users/EditProfile';
import Signin from './Signin';



const PrivateRoute = ( props ) => { 
		return (auth.isAuthenticated() ? (
					props.element
				) : (
					<Navigate to={{pathname: '/signin' }}/>
				)
			);
};
export default PrivateRoute;