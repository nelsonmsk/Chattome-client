import React, { useState, useEffect } from 'react';
import {Link, 	Navigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {Avatar, IconButton,Divider, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from '@material-ui/core';
import {Person, Edit} from '@material-ui/icons';

import * as auth from  './../Auth/auth-helper';
import PostList from './../Posts/PostList';
import {read} from './api-user';
import {listByUser} from './../Posts/api-post';
import DeleteUser from './DeleteUser';
import ProfileTabs from './ProfileTabs'; 

const useStyles = makeStyles(theme => ({
  root: {
	height: '100%',
	minHeight: 'calc(100vh - 123px)',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0px !important',
  }
}));

export default function Profile({ match }) {
	const classes = useStyles();
	const [user, setUser] = useState({});
	const [posts, setPosts] = useState({});
	const [redirectToSignin, setRedirectToSignin] = useState(false);

	const [values, setValues] = useState({
		name: '',
		password: '',
		email: '',
		open: false,
		error: ''
	});

	
	useEffect(() => {
		const abortController = new AbortController()
		const signal = abortController.signal;
		const jwt = auth.isAuthenticated;
		read({
			userId: match.params.userId
		}, {t: jwt.token}, signal).then((data) => {
			if (data && data.error) {
				setRedirectToSignin(true);
			} else {
				setUser(data);
			}
		});
		return function cleanup(){
			abortController.abort();
		}
	}, [match.params.userId]);


	const loadPosts = (user) => {
	const jwt = auth.isAuthenticated;
		listByUser({
			userId: user
		}, {
			t: jwt.token
		}).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setPosts(data);
			}
		})
	};			

	const removePost = (post) => {
		const updatedPosts = [...posts];
		const index = updatedPosts.indexOf(post);
		updatedPosts.splice(index, 1);
		setPosts(updatedPosts);
	};

	if (redirectToSignin) {
		return <Navigate to='/signin'/>
	};
	
	const photoUrl = values.user._id
	? `/api/users/photo/${values.user._id}?${new Date().getTime()}`
	: '/api/users/defaultphoto'	;
	
	return (
		<Paper className={classes.root} elevation={4}>
			<Typography variant="h6" className={classes.title}>
				Profile
			</Typography>
			<List dense>
				<ListItem>
					<ListItemAvatar>
						<Avatar src={photoUrl}>
							<Person/>
						</Avatar>
					</ListItemAvatar>
					<ListItemText primary={user.name} secondary={user.email}/>
				{( auth.isAuthenticated().user && auth.isAuthenticated().user._id == user._id ) ?
					(<ListItemSecondaryAction>
						<Link to={"/user/edit/" + user._id}>
							<IconButton aria-label="Edit" color="primary">
								<Edit/>
							</IconButton>
						</Link>
						<DeleteUser userId={user._id}/>
					</ListItemSecondaryAction>)
					:(<ListItemSecondaryAction></ListItemSecondaryAction>)
				}
				</ListItem>
				<Divider/>
				<ListItem> <ListItemText primary={user.about}/> </ListItem>				
				<ListItem>
					<ListItemText primary={"Joined: " + (
						new Date(user.created)).toDateString()}/>
				</ListItem>
			</List>
			<PostList removeUpdate={removePost} posts={posts}/>
			<Divider/>
			<ProfileTabs  user={user} />
		</Paper>
	);
};