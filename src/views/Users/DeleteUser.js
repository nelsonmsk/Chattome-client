import React, {useState} from 'react';
import {Navigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {IconButton,Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import * as auth from  './../Auth/auth-helper';
import {remove} from './api-user';

export default function DeleteUser(props) {

	const [open, setOpen] = useState(false);
	
	const [redirect, setRedirect] = useState(false);
	
	const clickButton = () => {
		setOpen(true);
	};
	
	const handleRequestClose = () => {
		setOpen(false);
	};
	
	const deleteAccount = () => {
		const jwt = auth.isAuthenticated()
			remove({
				userId: props.userId
			}, {t: jwt.token}).then((data) => {
					if (data && data.error) {
						console.log(data.error);
				} else {
					auth.clearJWT(() => console.log('deleted'));
					setRedirect(true);
				}
			})
	};
	
	if (redirect) {
		return <Navigate to='/'/>
	};
	
	return (<span>
		<IconButton aria-label="Delete"
			onClick={clickButton} color="secondary">
			<DeleteIcon/>
		</IconButton>
		<Dialog open={open} onClose={handleRequestClose}>
			<DialogTitle>{"Delete Account"}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Confirm to delete your account.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleRequestClose} color="primary">
					Cancel
				</Button>
				<Button onClick={deleteAccount}
					color="secondary" autoFocus="autoFocus">
						Confirm
					</Button>
			</DialogActions>
		</Dialog>
	</span>)
};

DeleteUser.propTypes = {
	userId: PropTypes.string.isRequired
};