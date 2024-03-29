import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Avatar, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import {Delete, Comment, Favorite, FavoriteBorder} from '@material-ui/icons';

import * as auth from  './../Auth/auth-helper';
import {remove, like, unlike} from './api-post';
import Comments from './Comments';

const useStyles = makeStyles(theme => ({
  root: {
	height: '100%',
	minHeight: 'calc(100vh - 123px)',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0px !important',
	marginTop: '24px'
  },
  	title: {
		padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
		color: theme.palette.openTitle,
	},
}));

export default function Post(props) {
	const classes = useStyles();
	
	const [values, setValues] = useState({
		like: checkLike(props.post.likes),
		likes: props.post.likes.length,
		comments: props.post.comments
	});

	const checkLike = (likes) => {
		const jwt = auth.isAuthenticated;
		let match = likes.indexOf(jwt.user._id) !== -1;
		return match;
	};

	const clickLike = () => {
		let callApi = values.like ? unlike : like;
		const jwt = auth.isAuthenticated;
		callApi({
			userId: jwt.user._id
		}, {
			t: jwt.token
		}, props.post._id).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setValues({...values, like: !values.like,
					likes: data.likes.length})
			}
		});
	};


	const deletePost = () => {
		const jwt = auth.isAuthenticated;		
		remove({
			postId: props.post._id
		}, {
			t: jwt.token
		}).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				props.onRemove(props.post);
			}
		});
	};


	const updateComments = (comments) => {
		setValues({...values, comments: comments})
	};

	return (
	<div className={classes.root}>
		<Card className={classes.card}>
			<CardHeader avatar={<Avatar src={'/api/users/photo/'+props.post.postedBy._id}/>}
					action={ props.post.postedBy._id === auth.isAuthenticated().user._id &&
							<IconButton onClick={deletePost}>
								<Delete />
							</IconButton>
					}
					title={<Link to={"/user/" + props.post.postedBy._id}>{props.post.postedBy.name}</Link>}
					subheader={(new Date(props.post.created)).toDateString()}
					className={classes.cardHeader}
			/>
			<CardContent className={classes.cardContent}>
				<Typography component="p" className={classes.text}>
					{props.post.text}
				</Typography>
					{props.post.photo &&
						(<div className={classes.photo}>
							<img className={classes.media}
								src={'/api/posts/photo/'+ props.post._id}/>
						</div>)
					}
			</CardContent>
			<CardActions>
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
					</IconButton> <span>{values.comments.length}</span>
			</CardActions>
			<Comments postId={props.post._id}
				comments={values.comments}
				updateComments={updateComments}/>
		</Card>
	</div>
	);

};

Post.propTypes = {
	post: PropTypes.array.isRequired,
	onRemove: PropTypes.func.isRequired
};