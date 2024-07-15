import React, { useState, useEffect, useCallback } from 'react';
import {Link, Navigate, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {Avatar, IconButton,Divider, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from '@material-ui/core';
import {Person, Edit} from '@material-ui/icons';
import {Tabs, Tab} from '@material-ui/core';

import * as auth from  './../Auth/auth-helper';
import PostList from './../Posts/PostList';
import {read} from './api-user';
import {listByUser} from './../Posts/api-post';
import DeleteUser from './DeleteUser';
//import ProfileTabs from './ProfileTabs'; 
import FollowProfileButton from './FollowProfileButton';
import FollowGrid from './FollowGrid';

const useStyles = makeStyles(theme => ({
  root: {
	height: '100%',
	minHeight: 'calc(100vh - 123px)',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0px !important',
  },
  title: {
	padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
	color: theme.palette.openTitle,
  },
  list: {
	border: '1px groove',
    margin: '0rem 1rem',
    borderRadius: '20px',
	borderColor: '#ff4081',
  },
  tab: {
	backgroundColor: '#3f4771',
    borderRadius: '15px',
    margin: '10px 5px',
	color: '#ffffff'
  }
}));

export default function Profile({ match }) {
	const classes = useStyles();
	const [user, setUser] = useState([]);
	const [posts, setPosts] = useState([]);
	const [redirectToSignin, setRedirectToSignin] = useState(false);
	const [following, setFollowing] = useState(false);
	const [value, setValue] = useState(0);
	const {userId} = useParams();

	const checkFollow = (user) => {
		const jwt = auth.isAuthenticated();
		const match = user.followers.some((follower)=> {
			return follower._id === jwt.user._id
		});
		return match;
	};

	const loadPosts = (userId) => {
		const jwt = auth.isAuthenticated();
		listByUser({
			userId: userId
		}, {
			t: jwt.token
		}).then((data) => {
			if (data && data.error) {
				console.log(data.error);
			} else {
				setPosts(data);
			}
		});
	}; 

	useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;
		const jwt = auth.isAuthenticated();

		read({
			userId: userId
		}, {t: jwt.token}, signal).then((data) => {
			if (data && data.error) {
				setRedirectToSignin(true);
			} else {
				setUser(data);		
				let followStatus = checkFollow(data);
				setFollowing(followStatus);
				loadPosts(userId);
			}
		});
	}, [userId]);  


	const clickFollowButton = (callApi) => {
		const jwt = auth.isAuthenticated();
		callApi({
				userId: jwt.user._id
			}, {
				t: jwt.token
			}, user._id).then((data) => {
				if ( data && data.error) {
					console('error:', data.error);
				} else {
					setUser(data);		
					setFollowing(!following);
				}
			});
	};

	const removePost = (post) => {
		const updatedPosts = [...posts];
		const index = updatedPosts.indexOf(post);
		updatedPosts.splice(index, 1);
		setPosts(updatedPosts);
	};

	if (redirectToSignin) {
		return <Navigate to={{pathname: '/signin' }}/>
	};
	
	const photoUrl = userId
	? `/api/users/photo/${userId}?${new Date().getTime()}`
	: '/api/users/defaultphoto'	;

	const onChange = (e, value) =>{
		setValue(value);
	};
	const displayGrid = value =>{
		if(value === 2){
			return (<FollowGrid people={user.following}/>);
		}else if(value === 1){ 
			return (<FollowGrid people={user.followers}/>);
		}else{ return (<PostList removeUpdate={removePost} posts={posts}/>);}
	};

	return (
		<Paper className={classes.root} elevation={4}>
			<Typography variant="h4" className={classes.title}>
				Profile
			</Typography>
			<List dense className={classes.list}>
				<ListItem>
					<ListItemAvatar>
						<Avatar src={photoUrl}>
							<Person/>
						</Avatar>
					</ListItemAvatar>
					<ListItemText primary={user.name} secondary={user.email}/>
				{( auth.isAuthenticated().user && auth.isAuthenticated().user._id === user._id ) ?
					(<ListItemSecondaryAction>
						<Link to={"/user/edit/" + user._id}>
							<IconButton aria-label="Edit" color="primary">
								<Edit/>
							</IconButton>
						</Link>
						<DeleteUser userId={user._id}/>
					</ListItemSecondaryAction>)
					:(<ListItemSecondaryAction>
						<FollowProfileButton following={following} onButtonClick={clickFollowButton}/>
					</ListItemSecondaryAction>)
				}
				</ListItem>
				<Divider/>
				<ListItem> <ListItemText primary={user.about}/> </ListItem>				
				<ListItem>
					<ListItemText primary={"Joined: " + (
						new Date(user.created)).toDateString()}/>
				</ListItem>
			</List>
			<Divider />
			<div className={classes.tabs}>
				<Tabs className={classes.tab} value={value} onChange={onChange} >
					<Tab label={"Posts"} selected={value ===0 ? "true":"false"}/>
					<Tab label="Followers" selected={value ===1 ? "true":"false"}/> 
					<Tab label="Following" selected={value ===2 ? "true":"false"}/>
				</Tabs>
				{( displayGrid(value) )}
			</div>
		</Paper>
	);
};