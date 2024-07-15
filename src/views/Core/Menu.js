import React from 'react';
import {Link, useLocation, Navigate,} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, IconButton,Button } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import Typography from '@material-ui/core/Typography';

import * as auth from './../Auth/auth-helper';
import withRouter from './withRouter';

const useStyles = makeStyles(theme => ({
  	title: {
		marginRight: '15% '
	},
	links: {
		textDecoration: 'none !important'
	}
}));

export const Menu = withRouter(() => {
	
const classes = useStyles();

return(
	<AppBar position="static">
		<Toolbar>
			<Typography variant="h6" color="inherit" className={classes.title}>
				Chattome
			</Typography>
			<Link to="/" >
				<IconButton aria-label="Home" style={IsActive("/")}>
					<HomeIcon/>
				</IconButton>
			</Link>
			{
			!auth.isAuthenticated() ?			
			(<span>
				<Link to="/signup" className={classes.links}>
					<Button style={IsActive("/signup")}> Sign Up </Button>
				</Link>
				<Link to="/signin" className={classes.links}>
					<Button style={IsActive("/signin")}> Sign In </Button>
				</Link>  
			</span>)
			:			  
			(<span> 
				<Link to={"/posts/feed/" + auth.isAuthenticated().user._id}  className={classes.links} >
					<Button style={IsActive("/posts/feed/" + auth.isAuthenticated().user._id)}> NewsFeed </Button>
				</Link>
				<Link to={"/users/findpeople/" + auth.isAuthenticated().user._id}  className={classes.links} >
					<Button style={IsActive("/users/findpeople/" + auth.isAuthenticated().user._id)}> Find People </Button>
				</Link>
				<Link to="/users" className={classes.links} >
					<Button style={IsActive( "/users")}>Users</Button>
				</Link>
				<Link to={"/users/" + auth.isAuthenticated().user._id}>
					<Button style={IsActive("/users/" + auth.isAuthenticated().user._id
					)}>
						My Profile
					</Button>
				</Link>
				<Button color="inherit"
					onClick={() => { auth.clearJWT(() =><Navigate to={{pathname: '/signin' }}/>) }}>
						Sign out
				</Button>
			</span>)
			}
		</Toolbar>
</AppBar>)});
	
	function IsActive (path){
		let location = useLocation();
		if (location.pathname === path){
			return {color: '#ff4081'};
		}else{
			return {color: '#ffffff'};
		}
	};