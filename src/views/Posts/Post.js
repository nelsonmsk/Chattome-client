import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import {Avatar, IconButton } from '@material-ui/core';
import {Delete, Comment, Favorite, FavoriteBorder} from '@material-ui/icons';

import * as auth from  './../Auth/auth-helper';
import {remove, like, unlike} from './api-post';
import Comments from './Comments';

const useStyles = makeStyles(theme => ({
  root: {
	height: '100%',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0px !important',
	marginTop: '24px'
  },
  	title: {
		padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
		color: theme.palette.openTitle,
	},
	card: {
		borderRadius: '15px',
		margin: '0rem 15px',
	},
	cardHeader: {
		padding:`${theme.spacing(2)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
		color: theme.palette.openTitle,
		backgroundColor: 'lightGray'
	},
	cardContent: {
		padding: '2%',
		color: theme.palette.openTitle,
		border: '1px groove #e0e0e0'
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

export default function Post(props) {
	const classes = useStyles();
	
	const [values, setValues] = useState({
		like: props.post.likes,
		likes: props.post.likes.length,
		comments: props.post.comments
	});

	const checkLike = (likes) => {
		const jwt = auth.isAuthenticated();
		let match = likes.indexOf(jwt.user._id) !== -1;
		return match;
	};
 
	useEffect(() => {
		setValues({...values, like: checkLike(props.post.likes)})
	}, [props.post.likes]);

	const clickLike = () => {
		let callApi = values.like ? unlike : like;
		const jwt = auth.isAuthenticated();
		callApi({
			userId: jwt.user._id
		}, {
			t: jwt.token
		}, props.post._id).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setValues({...values, like: !values.like,
					likes: data.likes.length});
			}
		});
	};

	return (
	<div className={classes.root}>
		<Card className={classes.card}>
			<CardHeader avatar={<Avatar src={'/api/users/photo/'+props.post.postedBy._id}/>}
					title={<Link to={"/users/" + props.post.postedBy[0]._id} style={{textDecoration:'none'}}>{props.post.postedBy[0].name}</Link>}
					subheader={(new Date(props.post.created)).toDateString()}
					classes={{root:classes.CardHeader, title:classes.text, subheader:classes.text}}
			/>
			<CardContent className={classes.cardContent}>
				<Typography component="p" className={classes.text}>
					{props.post.text}
				</Typography>
					{props.post.photo &&
						(<div className={classes.photo}>
							<img className={classes.media} alt={""}
								src={'/api/posts/photo/'+ props.post._id}/>
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
					</IconButton> <span>{values.comments.length}</span>
			</CardActions>
		</Card>
	</div>
	);

};

Post.propTypes = {
	post: PropTypes.array.isRequired,
	onRemove: PropTypes.func.isRequired
};