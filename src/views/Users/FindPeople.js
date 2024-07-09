import React, { useState, useEffect } from 'react';
import {Link, Navigate, redirect} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {Snackbar, Divider, List, ListItem, ListItemAvatar, Avatar, ListItemSecondaryAction, ListItemText, IconButton, Button, } from '@material-ui/core';
import {ViewCarousel} from '@material-ui/icons';

import * as auth from  './../Auth/auth-helper';
import {findPeople,follow} from './api-user';

const useStyles = makeStyles(theme => ({
  root: {
	height: '100%',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0px !important',
  }
}));

export default function FindPeople({ match }) {
	const classes = useStyles();
	const [values, setValues] = useState({
		users: '',
		open: false,
		followMessage: ''
	});
	const jwt = auth.isAuthenticated();

	useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;
		
		findPeople({
			userId: jwt.user._id
		}, {
			t: jwt.token
		}, signal).then((data) => {
			if (data && data.error) {
				console.log(data.error);
			} else {
				setValues({...values, users:data})
			}
		});
		return function cleanup(){
			abortController.abort();
		}
	}, [jwt, values]);

	const clickFollow = (user, index) => {
		follow({
			userId: jwt.user._id
		}, {
			t: jwt.token
		}, user._id).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				let toFollow = values.users;
				toFollow.splice(index, 1);
				setValues({...values, users: toFollow, open: true,
					followMessage: `Following ${user.name}!`});
			}
		});
	};
	
	const handleRequestClose =()=>{
		return redirect('/');
	};	
	
	return (
		<Paper className={classes.root} elevation={4}>
			<Typography variant="h6" className={classes.title}>
				Who to follow
			</Typography>
			<List>
			{values.users?
				(values.users.map((item, i) => {
					return <span key={i}>
						<ListItem>
							<ListItemAvatar className={classes.avatar}>
								<Avatar src={'/api/users/photo/'+item._id}/>
							</ListItemAvatar>
							<ListItemText primary={item.name}/>
							<ListItemSecondaryAction className={classes.follow}>
								<Link to={"/user/" + item._id}>
									<IconButton variant={"contained"} color={"secondary"}
										className={classes.viewButton}>
										<ViewCarousel/>
									</IconButton>
								</Link>
								<Button aria-label={"Follow"} variant={"contained"}
									color={"primary"}
												onClick={()=> {clickFollow(item, i)}}>
													Follow
								</Button>
							</ListItemSecondaryAction>
						</ListItem>
					</span>
					})
				)
			:	(
					<span>
						<ListItem>
							<ListItemAvatar className={classes.avatar}>
								<Avatar />
							</ListItemAvatar>
							<ListItemText primary={"No People to follow"}/>
						</ListItem>
					</span>	
				)
			}
				if(values.followMessage){
					<Snackbar anchorOrigin={{vertical: 'bottom',
												horizontal: 'right',}}
										open={values.open}
										onClose={handleRequestClose}
										autoHideDuration={6000}
										message={<span className={classes.snack}>{values.followMessage}</span>}/>
				}
			</List>
		</Paper>
	);
};