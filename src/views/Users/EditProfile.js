import React, {useState, useEffect} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import {Person} from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import {FormControlLabel,Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Icon, Avatar } from '@material-ui/core';

import * as auth from  './../Auth/auth-helper';
import {read, update} from './api-user';

const useStyles = makeStyles(theme => ({
  root: {
	height: '100%',
	minHeight: 'calc(100vh - 123px)',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0px !important',
	textAlign: 'center'
  },
  
  title: {
	padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
	color: theme.palette.openTitle,
  },
  card: {
	width: '60%',
	height: '100%',
	alignItems: 'center',
	display: 'inline-block',
	[theme.breakpoints.down('xs')]: {
		width: '90%'
	  },
  },
  Avatar: {
	display: 'inline-flex'
  }
}));

export default function EditProfile({ match }) {

	const classes = useStyles();
	const navigate = useNavigate();
	const [values, setValues] = useState({
		name: '',
		password: '',
		email: '',
		open: false,
		userId: '',
		redirectToProfile: false,
		error: ''
	});
	const {userId} = useParams();

	useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;
		const jwt = auth.isAuthenticated();

		read({
			userId: userId
		}, {t: jwt.token}, signal).then((data) => {
			if (data && data.error) {
				console.log(data.error);
			} else {	
				setValues(v=>({name: data.name, email: data.email, about: data.about, userId: data._id}))
			}
		});
	}, [userId]);  


	const handleChange = name => event => {
		const value = name === 'photo'? event.target.files[0]: event.target.value;
		setValues({...values, [name]: value })
	};

	const clickSubmit = () => {
		const jwt = auth.isAuthenticated();
		let userData = new FormData();
		if(values.name) userData.append('name', values.name);
		if(values.email) userData.append('email', values.email);
		if(values.password) userData.append('password', values.password);
		if(values.about) userData.append('about', values.about);
		if(values.photo) userData.append('photo', values.photo);

		update({
			userId: userId
		}, {
			t: jwt.token
		}, userData).then((data) => {
			if (data && data.error) {
				setValues({...values, error: data.error});
			} else {
					setValues({...values, userId: data._id, open: true});
			}
			//navigate('/users/'+ userId);
		})
	};

	const handleClose=()=>{
		navigate('/users/'+userId);
	}

return (
	<div className={classes.root}>
		<Card className={classes.card}>
			<CardContent className={classes.CardContent}>
				<Typography variant="h4" className={classes.title}>
					Edit Profile
				</Typography>
				<Avatar className={classes.Avatar}>
					<Person/>
				</Avatar>
				<TextField id={"name"} label={"Name"} fullWidth
					className={classes.textField}
					value={values.name} onChange={handleChange('name')}
					margin={"normal"} />
				<br />
				<TextField id="multiline-flexible" placeholder="About" multiline minRows={3} fullWidth
					maxRows={"5"} value={values.about} onChange={handleChange('about')} />
				<br />
				<TextField id={"email"} type={"email"} label={"Email"} fullWidth
					className={classes.textField} value={values.email} onChange={handleChange('email')}
					margin="normal" />
				<br />
				<TextField id={"password"} type={"password"} label={"Password"}
					className={classes.textField} value={values.password} fullWidth
					onChange={handleChange('password')} margin={"normal"} />
				<br />
				<input accept={"image/*"} type={"file"}
					onChange={handleChange('photo')} style={{ display: 'none' }} id={"icon-button-file"} />
				<label htmlFor={"icon-button-file"}>
					<Button variant={"contained"} color={"default"} component={"span"}>
						Upload
					</Button>
				</label>
				<span className={classes.filename}>
					{values.photo ? values.photo.name : ''}
				</span>
				<br />
				{values.error && (<Typography component={"p"} color={"error"}>
					<Icon color={"error"} className={classes.error}>error</Icon>
					{values.error}</Typography>)}
			</CardContent>
			<CardActions>
				<Button color={"primary"} variant={"contained"} onClick={clickSubmit}
					className={classes.submit}>Update</Button>
			</CardActions>
		</Card>
		<Dialog open={values.open} onClose={handleClose}>
			<DialogTitle>Profile Account</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Profile successfully Updated!.
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
