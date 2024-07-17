import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Avatar,Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Icon } from '@material-ui/core';
import {Camera} from '@material-ui/icons';

import * as auth from  './../Auth/auth-helper';
import {create} from './api-post';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
	height: '100%',
	alignItems: 'center',
	justifyContent: 'center',
	//padding: '0px !important',
	marginTop: '24px'
  },
  card: {
	backgroundColor: 'lightGray',
  },
  CardContent: {
	backgroundColor: 'white'
  },
  	title: {
		padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
		color: theme.palette.openTitle,
	},
	postField: {
	 width: '90%',	
	},
}));

export default function NewPost(props) {
const classes = useStyles();
const navigate = useNavigate();
const [values, setValues] = useState({
	text: '',
	photo: '',
	open: false,
	error: '',
	postId: ''
});

const handleChange = name => event => {
	const value = name === 'photo'? event.target.files[0]: event.target.value;
	setValues({...values, [name]: value });
};

const clickPost = () => {
	const jwt = auth.isAuthenticated();
	let postData = new FormData();
	if(values.text) postData.append('text', values.text);
	if(values.photo) postData.append('photo', values.photo);

	create({
		userId: jwt.user._id
	}, {
		t: jwt.token
	}, postData).then((data) => {
		if (data && data.error) {
			setValues({...values, error: data.error});
		} else {
			setValues({...values, text:'', photo: '', open: true});
			props.addUpdate(data);
		}
		navigate('/post/feed/' + jwt.user._id);
	})
};

const handleClose=()=>{
	return navigate('/posts/feed/'+ auth.isAuthenticated().user._id);
};

return (
	<div className={classes.root}>
		<Card className={classes.card}>
			<CardHeader avatar={<Avatar className={classes.smallAvatar}
									src= {'/api/users/photo/'+ auth.isAuthenticated().user._id}/>}
						title={auth.isAuthenticated().user.name}
						className={classes.cardHeader}>
			</CardHeader>
			<CardContent className={classes.CardContent}>
				<TextField id="multiline-flexible" multiline
					minRows="3" onChange={handleChange('text')} placeholder={"Share your thoughts..."}
					className={classes.postField} margin={"normal"}/>
				<br/>
				<input accept="image/*" type="file"
					onChange={handleChange('photo')} style={{display:'none'}} id="icon-button-file" />
				<label htmlFor="icon-button-file">
					<Button variant="contained" color="default" component="span">
						<Camera/>
					</Button>
				</label>
				<span className={classes.filename}>
					{values.photo ? values.photo.name  : ''}
				
				</span>
				<br/>
				{
					values.error && (<Typography component="p" color="error">
						<Icon color="error" className={classes.error}>error</Icon>
							{values.error}</Typography>)
				}
			</CardContent>
			<CardActions>
				<Button color="primary" variant="contained" onClick={clickPost}
					className={classes.submit}>Post</Button>
			</CardActions>
		</Card>
		<Dialog open={values.open} onClose={handleClose}>
			<DialogTitle>New Post</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Post Created Successfully.
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

NewPost.propTypes = {
	addUpdate: PropTypes.func.isRequired
};