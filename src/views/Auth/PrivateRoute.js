import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import * as auth from './auth-helper';


const PrivateRoute = (props) => {
	auth.isAuthenticated ?
	(<Route path={props.path} element={props.element }/>)
	:
	(<Navigate to={'/signin'}/>)
};
export default PrivateRoute;