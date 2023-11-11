import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Home from './views/Core/Home';
import Users from './views/Users/Users';
import Signup from './views/Users/Signup';
import Signin from './views/Auth/Signin';
import Profile from './views/Users/Profile';
import EditProfile from './views/Users/EditProfile';
import NewsFeed from './views/Posts/NewsFeed';
import {Menu} from './views/Core/Menu';
import Footer from './views/Core/Footer';
import PrivateRoute from './views/Auth/PrivateRoute';

const MainRouter = () => {
	return(
	 <div>
		<Menu/>
		<Routes>
			<Route exact path="/" element={<Home />}/>
			<Route path="/users" element={<Users />}/>
			<Route path="/signup" element={<Signup />}/>
			<Route path="/signin" element={<Signin />}/>
			<Route path="/user/edit/:userId" element={<PrivateRoute path={"/user/edit/:userId"} element={<EditProfile />} /> } />
			<Route path="/user/:userId" element={<Profile />} />
			<Route path="/posts/feed/:userId" element={<PrivateRoute path={"/posts/feed/:userId"} element={<NewsFeed />} /> } />
			
		</Routes>
		<Footer/>
	</div>   
	);
};
export default MainRouter; 