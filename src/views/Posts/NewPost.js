import React, {useState} from 'react';
import {Link, Navigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Icon } from '@material-ui/core';

import * as auth from  './../Auth/auth-helper';
import {create} from './api-post';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
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

export default function NewPost(props) {
	
const classes = useStyles();
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
	const jwt = auth.isAuthenticated;
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
			setValues({...values, text:'', photo: ''});
			props.addUpdate(data);
		}
	})
};

if (values.redirectToPost) {
	return (<Navigate to={'/post/' + values.postId}/>);
};

return (
	<div className={classes.root}>
		<Card className={classes.card}>
			<CardContent>
				<Typography variant="h6" className={classes.title}>
					New Post
				</Typography>
				<br/>
				<TextField id="multiline-flexible"label="text" multiline
					minRows="3" value={values.text} onChange={handleChange('text')}/>
				<br/>
				<input accept="image/*" type="file"
					onChange={handleChange('photo')} style={{display:'none'}} id="icon-button-file" />
				<label htmlFor="icon-button-file">
					<Button variant="contained" color="default" component="span">
						Upload 
					</Button>
				</label>
				<span className={classes.filename}>
					{values.photo ? values.photo.name : ''}
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
					className={classes.submit}>Submit</Button>
			</CardActions>
		</Card>
	</div>
);


<Dialog open={values.open} disableBackdropClick={true}>
	<DialogTitle>New Account</DialogTitle>
	<DialogContent>
		<DialogContentText>
			New account successfully created.
		</DialogContentText>
	</DialogContent>
	<DialogActions>
		<Link to="/signin">
			<Button color="primary" autoFocus="autoFocus"
				variant="contained">
					Sign In
			</Button>
		</Link>
	</DialogActions>
</Dialog>

};

NewPost.propTypes = {
	addUpdate: PropTypes.func.isRequired
};