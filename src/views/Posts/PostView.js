import React, { useState, useEffect } from 'react';
import {Link, useParams, useNavigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { Avatar,Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton,Button } from '@material-ui/core';
import {Delete, Comment, Favorite, FavoriteBorder} from '@material-ui/icons';

import * as auth from  './../Auth/auth-helper';
import {listNewsFeed, remove, like, unlike} from './api-post';
import Comments from './Comments';

const useStyles = makeStyles(theme => ({
  root: {
	height: '100%',
	minHeight: 'calc(100vh - 123px)',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0px !important',
	marginTop: '8px'
  },
  	title: {
		padding:`${theme.spacing(2)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
		color: theme.palette.openTitle,
	},
	card: {
		borderRadius: '15px',
		margin: '0rem 15px',
	},
	cardHeader: {
		padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
		color: theme.palette.openTitle,
		backgroundColor: 'lightGray'
	},
	cardContent: {
		padding: '2%',
		color: theme.palette.openTitle,
		border: '1px groove'
	},
	CardActions: {
		padding: '0px',
		color: theme.palette.openTitle,
	},
	buttons: {
		padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
		color: theme.palette.openTitle,
		backgroundColor: 'white',
		borderRadius: '2px',
		borderStyle: 'solid'
	},
	media: {
		maxWidth: '100%',
		height: '100%',
	},
	photo: {
		"@media screen and (max-width: 568px)": {
			width: '100%',
			height: '320px',
		},
		"@media screen and (max-width: 1280px) and (min-width: 980px)": {
			width: '100%',
			height: '600px',
		},
		"@media screen and (max-width: 2560px) and (min-width: 1300px)": {
			width: '90%',
			height: '600px',
		},
		marginTop: '1rem'
	},
	text: {
		fontSize: '80%'
	}
}));

export default function PostView() {
	const classes = useStyles();
	const navigate = useNavigate();
    const [post, setPost] = useState([]);
	const [values, setValues] = useState({
		like: [],
		likes: 0,
		comments: [],
		open: false
	});
	const {postId} = useParams();

    const checkLike = (likes) => {
		const jwt = auth.isAuthenticated();
		let match = likes.indexOf(jwt.user._id) !== -1;
		return match;
	};

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
				if(data){    
					const pdata = data.filter((post)=>(post._id === postId));
					const postdata = pdata[0];
					setPost(postdata);
					setValues({...values, like:checkLike(postdata.likes), likes:postdata.likes.length, comments:postdata.comments});
				}
			} 
		}); 
		return function cleanup(){
			abortController.abort();
		} 
	},[]);

	const clickLike = () => {
		let callApi = values.like ? unlike : like;
		const jwt = auth.isAuthenticated();
		callApi({
			userId: jwt.user._id
		}, {
			t: jwt.token
		}, post._id).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setValues({...values, like: !values.like,
					likes: data.likes.length});
			}
		});
	};

	const deletePost = () => {
		const jwt = auth.isAuthenticated();		
		remove({
			userId: jwt.user._id
		}, {
			t: jwt.token
		},post._id, post).then((data) => {
			if (data && data.error) {
				console.log(data.error);
			} else {
				setValues({...values, open: true});
			}
		});
	};

	const updateComments = (comments) => {
		setValues({...values, comments: comments});
	};

	const handleClose=()=>{
		navigate('/posts/feed/'+ auth.isAuthenticated().user._id);
   };

	return (
	<div className={classes.root}>
		<Typography variant="h4" className={classes.title}>
			Post
		</Typography>
		{(post && post.length !== 0) && <Card className={classes.card}>
            <CardHeader avatar={<Avatar src={'/api/users/photo/'+post.postedBy._id}/>}
					action={ post.postedBy[0]._id === auth.isAuthenticated().user._id &&
							<IconButton onClick={deletePost}>
								<Delete />
							</IconButton>
					}
					title={<Link to={"/user/" + post.postedBy[0]._id} style={{textDecoration:'none'}}>{post.postedBy[0].name}</Link>}
					subheader={(new Date(post.created)).toDateString()}
					classes={{root:classes.CardHeader, title:classes.text, subheader:classes.text}}
			/>
			<CardContent className={classes.cardContent}>
				<Typography component="p" className={classes.text}>
					{post.text}
				</Typography>
					{post.photo &&
						(<div className={classes.photo}>
							<img className={classes.media} alt={""}
								src={'/api/posts/photo/'+ post._id}/>
						</div>)
					}
			</CardContent>
			<CardActions className={classes.CardActions}>
				{ values.like
					? <IconButton onClick={clickLike} className={classes.button}
						aria-label="Like" color="secondary">
							<Favorite/>
					</IconButton>
				  : <IconButton onClick={clickLike} className={classes.button}
						aria-label="Unlike" color="secondary">
							<FavoriteBorder />
					</IconButton> } <span>{values.likes}</span>
					<IconButton className={classes.button}
						aria-label="Comment" color="secondary">	
							<Comment/>
					</IconButton> <span>{values.comments && values.comments.length}</span>
			</CardActions>
			<Comments postId={post._id}
				comments={values.comments}
				updateComments={updateComments}/>
		</Card>}
		<Dialog open={values.open} onClose={handleClose}>
			<DialogTitle>Delete Post</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Post Deleted Successfully.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
					<Button color="primary" autoFocus="autoFocus"
						variant="contained" onClick={handleClose}>
							Close
					</Button>
			</DialogActions>
		</Dialog>
	</div>
	);

};
