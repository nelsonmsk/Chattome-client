import React, { useState, useEffect } from 'react';
import {Navigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {Divider} from '@material-ui/core';

import * as auth from  './../Auth/auth-helper';
import {listNewsFeed} from './api-post';
import NewPost from './NewPost';
import PostList from './PostList';

const useStyles = makeStyles(theme => ({
  root: {
	height: '100%',
	minHeight: 'calc(100vh - 123px)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0px !important',
  },
  container:{
	width: '100%',
	[theme.breakpoints.up('lg')]: {
		maxWidth:'1170px',
	},
	[theme.breakpoints.down('md')]: {
		maxWidth: '970px',
	}, 
	[theme.breakpoints.down('sm')]: {
		maxWidth: '750px',
	},  
	[theme.breakpoints.down('xs')]: {
		display: 'block'
	}
},
  	title: {
		padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
		color: theme.palette.openTitle,
	},
}));

export default function NewsFeed() {
	
	const classes = useStyles();
	const [posts, setPosts] = useState([]); 
	const [redirectToSignin, setRedirectToSignin] = useState(false);
	
	useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;
		const jwt = auth.isAuthenticated();
		
		listNewsFeed({
			userId: jwt.user._id
		}, {t: jwt.token}, signal).then((data) => {
			if (data && data.error) {
				console.log(data.error);
			} else {
				setPosts(data);
			}
		});  
		return function cleanup(){
			abortController.abort();
		}
	}, []);

	const addPost = (post) => {
		const updatedPosts = [...posts];
		updatedPosts.unshift(post);
		setPosts(updatedPosts);
	};

	const removePost = (post) => {
		const updatedPosts = [...posts];
		const index = updatedPosts.indexOf(post);
		updatedPosts.splice(index, 1);
		setPosts(updatedPosts);
	};

	if (redirectToSignin) {
		return <Navigate to={{pathname: '/signin' }}/>;
	};
	
	return (
		<Paper className={classes.root} elevation={4}>
			<div className={classes.container}>
				<Typography variant="h4" className={classes.title}>
					NewsFeed
				</Typography>
				<Card>
					<Divider/>
					<NewPost addUpdate={addPost}/>
					<Divider/>
					<PostList removeUpdate={removePost} posts={posts}/>
				</Card>
			</div>
		</Paper>
	);
};