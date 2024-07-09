import React, {useState}from 'react';
import {Link,  Navigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {FormControlLabel,Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Icon } from '@material-ui/core';

import * as auth from  './../Auth/auth-helper';
import {update} from './api-user';

const useStyles = makeStyles(theme => ({
  root: {
	height: '100%',
	minHeight: 'calc(100vh - 123px)',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0px !important',
  }
}));

export default function EditProfile({ match }) {

	const classes = useStyles();

	const [values, setValues] = useState({
		name: '',
		password: '',
		email: '',
		open: false,
		userId: '',
		redirectToProfile: false,
		error: ''
	});

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
			userId: match.params.userId
		}, {
			t: jwt.token
		}, userData).then((data) => {
			if (data && data.error) {
				setValues({...values, error: data.error});
			} else {
					setValues({...values, userId: data._id, redirectToProfile: true});
			}
		})
	};

	if (values.redirectToProfile) {
		return (<Navigate to={'/users/' + values.userId}/>);
	};

return (
	<><div className={classes.root}>
		<Card className={classes.card}>
			<CardContent>
				<Typography variant="h6" className={classes.title}>
					Sign Up
				</Typography>
				<TextField id="name" label="Name"
					className={classes.textField}
					value={values.name} onChange={handleChange('name')}
					margin="normal" />
				<br />
				<TextField id="multiline-flexible" label="About" multiline
					rows="2" value={values.about} onChange={handleChange('about')} />
				<br />
				<TextField id="email" type="email" label="Email"
					className={classes.textField} value={values.email} onChange={handleChange('email')}
					margin="normal" />
				<br />
				<TextField id="password" type="password" label="Password"
					className={classes.textField} value={values.password}
					onChange={handleChange('password')} margin="normal" />
				<br />
				<input accept="image/*" type="file"
					onChange={handleChange('photo')} style={{ display: 'none' }} id="icon-button-file" />
				<label htmlFor="icon-button-file">
					<Button variant="contained" color="default" component="span">
						Upload
					</Button>
				</label>
				<span className={classes.filename}>
					{values.photo ? values.photo.name : ''}
				</span>
				<br />
				{values.error && (<Typography component="p" color="error">
					<Icon color="error" className={classes.error}>error</Icon>
					{values.error}</Typography>)}
			</CardContent>
			<CardActions>
				<Button color="primary" variant="contained" onClick={clickSubmit}
					className={classes.submit}>Submit</Button>
			</CardActions>
		</Card>
	</div><Dialog open={values.open} disableBackdropClick={true}>
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
		</Dialog></>
);
};
