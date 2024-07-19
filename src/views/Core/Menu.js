import React, {Fragment, useEffect, useState} from 'react';
import {Link, useLocation, useNavigate,} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, IconButton, Button, Menu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
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
	},
	toolbar_lg: {
		visibility: 'visible',
		display: 'flex',
		[theme.breakpoints.down('sm')]: {
			visibility: 'hidden',
			display: 'none'
		},
	},
	toolbar_sm: {
		visibility: 'visible',
		[theme.breakpoints.up('md')]: {
			visibilty: 'hidden',
			display: 'none'
		},
	},
	menuButton: {
		marginLeft: '45%',
		marginRight: '-12px'
	}
}));

export const MenuBar = withRouter(() => {
	const classes = useStyles();
	const navigate = useNavigate();
	const [anchor, setAnchor] = useState(null);
	const [screenWidth, setScreenWidth] = useState(0);

	const closeMenu = () => setAnchor(null);

	useEffect(()=>{
		const handleResize = () => setScreenWidth(window.innerWidth);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	},[]);

	const IsActive = (path) =>{
		let location = useLocation();
		if (location.pathname === path){
			return {color: '#ff4081'};
		}else{
			if(screenWidth && screenWidth > 992){
				return {color: '#ffffff'};
			}else if(screenWidth && screenWidth < 992){
				return {color: '#3f4771'};
			}else{
				return {color: '#cccccc'};
			}
		}
	};

	const MenuItems = ({closeMenu }) => (
		!auth.isAuthenticated() ? 
		<Fragment>
			<MenuItem onClick={closeMenu}>			
				<Link to="/" >
					<IconButton aria-label="Home" style={IsActive("/")}>
						<HomeIcon/>
					</IconButton>
				</Link>
			</MenuItem>
			<MenuItem onClick={closeMenu}>
				<Link to="/signup" className={classes.links}>
					<Button style={IsActive("/signup")}> Sign Up </Button>
				</Link>
			</MenuItem>
			<MenuItem onClick={closeMenu}>
				<Link to="/signin" className={classes.links}>
					<Button style={IsActive("/signin")}> Sign In </Button>
				</Link> 
			</MenuItem>
		</Fragment>
		: <Fragment>
			<MenuItem onClick={closeMenu}>			
				<Link to="/" >
					<IconButton aria-label="Home" style={IsActive("/")}>
						<HomeIcon/>
					</IconButton>
				</Link>
			</MenuItem>
			<MenuItem onClick={closeMenu}>
				<Link to={"/posts/feed/" + auth.isAuthenticated().user._id}  className={classes.links} >
					<Button style={IsActive("/posts/feed/" + auth.isAuthenticated().user._id)}> NewsFeed </Button>
				</Link>
			</MenuItem>
			<MenuItem onClick={closeMenu}>
				<Link to={"/users/findpeople/" + auth.isAuthenticated().user._id}  className={classes.links} >
					<Button style={IsActive("/users/findpeople/" + auth.isAuthenticated().user._id)}> Find People </Button>
				</Link>
			</MenuItem>
			<MenuItem onClick={closeMenu}>
				<Link to="/users" className={classes.links} >
					<Button style={IsActive( "/users")}>Users</Button>
				</Link>
			</MenuItem>
			<MenuItem onClick={closeMenu}>
			<Link to={"/users/" + auth.isAuthenticated().user._id}>
					<Button style={IsActive("/users/" + auth.isAuthenticated().user._id
					)}>
						My Profile
					</Button>
				</Link>
			</MenuItem>
			<MenuItem onClick={closeMenu}>
				<Button color="inherit"
					onClick={() => { auth.clearJWT(() =>navigate('/signin') ); }}>
						Sign out
				</Button>
			</MenuItem>
		</Fragment>
	);

return(
	<AppBar position="static">
		<Toolbar className={classes.toolbar_lg}>
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
					onClick={() => { auth.clearJWT(() =>navigate('/signin') ); }}>
						Sign out
				</Button>
			</span>)
			}
		</Toolbar>
		<Toolbar className={classes.toolbar_sm}>
			<Typography variant="h6" color="inherit" className={classes.title}>
				Chattome
			</Typography>
			<Menu anchorEl={anchor} open={Boolean(anchor)} 
					onClose={closeMenu}>
				<MenuItems closeMenu={closeMenu} />
			</Menu>
			<IconButton className={classes.menuButton} color={"inherit"} aria-label={"Menu"}
					onClick={e =>setAnchor(e.currentTarget )}>
				<MenuIcon />
			</IconButton>
		</Toolbar>
	</AppBar>
	)
});