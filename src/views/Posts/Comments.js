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
import {Delete} from '@material-ui/icons';

import * as auth from  './../Auth/auth-helper';
import {remove, comment, uncomment, like, unlike } from './api-post';
import { ImportContacts } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
	height: '100%',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0px !important',
  },
  card: {
	height: '100%',
	margin: '10px',
	backgroundColor: '#e0e0e0'
  },
  CardHeader: {
	padding: '10px',
  },
  cardSubHeader: {
	padding: '5px 15px 5px 5px',
	marginBottom: '5px',
	borderTop: '1px groove'
  },
  cardContent: {
	padding: '5px',
  },
  commentDate: {
	marginRight: '10px',
	marginLeft: '10px',
	color: '#2e355b',
  },
  commentText: {
	margin: '0px',
	padding: '2px',
  },
  commentDelete: {
	marginLeft: '10px',
  }, 
  commentField: {
	width: '90%',
  },
}));

export default function Comments(props) {
	const classes = useStyles();
	const [text, setText] = useState('');

	const addComment = (event) => {
		if(event.keyCode === 13 && event.target.value){
			event.preventDefault();
			const jwt = auth.isAuthenticated();
			comment({
				userId: jwt.user._id
			}, {
				t: jwt.token
			}, props.postId, text).then((data) => {
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
				<Link to={"/users/" + item.postedBy._id}>
					{item.postedBy.name} </Link><br/>
				{item.text} |
				<span className={classes.commentDate}> 
					{ (new Date(item.created)).toDateString()} |
					{ auth.isAuthenticated().user._id === item.postedBy._id &&
						<Icon onClick={deleteComment(item)}
							className={classes.commentDelete}><Delete/></Icon> }
				</span>
			</p>
		)
	};

	const deleteComment = comment => event => {
		const jwt = auth.isAuthenticated();
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
	
	const handleChange = (event) => {
		const textValue = event.target.value;
		setText(textValue);
	};

	return (
	<div className={classes.root}>
		<Card className={classes.card}>
			<CardHeader avatar={<Avatar className={classes.smallAvatar}
									src= {'/api/users/photo/'+ auth.isAuthenticated().user._id}/>}
						title={<TextField id={"multiline-flexible"} multiline maxRows={4} minRows={2}
								 onKeyDown={addComment} onChange={handleChange} placeholder={"Write something ..."}
								className={classes.commentField} margin={"normal"}/>}
						className={classes.cardHeader}>
			</CardHeader>
			<CardContent className={classes.cardContent}>
				{ props.comments.map((item, i) => {
					return <CardHeader avatar={<Avatar className={classes.smallAvatar}
										src={'/api/users/photo/'+item.postedBy._id}/>}
										title={commentBody(item)}
										className={classes.cardSubHeader}
										key={i}>
							</CardHeader>
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