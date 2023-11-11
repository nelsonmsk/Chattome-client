import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Avatar, Icon, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';

import * as auth from  './../Auth/auth-helper';
import {remove, comment, uncomment, like, unlike } from './api-post';

const useStyles = makeStyles(theme => ({
  root: {
	height: '100%',
	minHeight: 'calc(100vh - 123px)',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0px !important',
  }
}));

export default function Comments(props) {
	const classes = useStyles();

	const [text, setText] = useState({});
	
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

	const addComment = (event) => {
		if(event.keyCode == 13 && event.target.value){
			event.preventDefault();
			const jwt = auth.isAuthenticated;
			
			comment({
				userId: jwt.user._id
			}, {
				t: jwt.token
			}, props.postId, {text: text}).then((data) => {
				if (data.error) {
					console.log(data.error);
				} else {
					setText('');
					props.updateComments(data.comments);
				}
			});
		}
	};


	const commentBody = item => {
		return (
			<p className={classes.commentText}>
				<Link to={"/user/" + item.postedBy._id}>
					{item.postedBy.name} </Link><br/>
				{item.text}
				<span className={classes.commentDate}>
					{ (new Date(item.created)).toDateString()} |
					{ auth.isAuthenticated.user._id === item.postedBy._id &&
						<Icon onClick={deleteComment(item)}
							className={classes.commentDelete}>delete</Icon> }
				</span>
			</p>
		)
	};

	const deleteComment = comment => event => {
		const jwt = auth.isAuthenticated;
		
		uncomment({
			userId: jwt.user._id
		}, {
			t: jwt.token
		}, props.postId, comment).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				props.updateComments(data.comments);
			}
		});
	};
	
	const handleChange = name => event => {
		const value = name === 'photo'? event.target.files[0]: event.target.value;
		setValues({...values, [name]: value })
	};

	return (
	<div className={classes.root}>
		<Card className={classes.card}>
			<CardHeader avatar={<Avatar className={classes.smallAvatar}
							src= {'/api/users/photo/'+ auth.isAuthenticated().user._id}/>}
					title={ <TextField	onKeyDown={addComment} multiline
						value={text} onChange={handleChange} placeholder="Write something ..."
						className={classes.commentField} margin="normal"/>}
					className={classes.cardHeader}/>
			<CardContent className={classes.cardContent}>
				{ props.comments.map((item, i) => {
					return <CardHeader avatar={<Avatar className={classes.smallAvatar}
										src={'/api/users/photo/'+item.postedBy._id}/>}
										title={commentBody(item)}
										className={classes.cardHeader}
										key={i}/>
					})
				}
			</CardContent>
			<CardActions>

			</CardActions>
		</Card>
	</div>
	);

};

Comments.propTypes = {
	comments: PropTypes.array.isRequired,
	updateComments: PropTypes.func.isRequired
};