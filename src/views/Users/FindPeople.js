import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {Snackbar, List, ListItem, ListItemAvatar, Avatar, ListItemSecondaryAction, ListItemText, IconButton, Button, } from '@material-ui/core';
import {PanoramaFishEye} from '@material-ui/icons';

import * as auth from  './../Auth/auth-helper';
import {findPeople,follow} from './api-user';

const useStyles = makeStyles(theme => ({
  root: {
	height: '100%',
	minHeight: 'calc(100vh - 123px)',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0px !important',
  },
  title: {
	padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
	color: theme.palette.openTitle,
	border: '1px groove'
},
}));

export default function FindPeople({ match }) {
	const classes = useStyles();
	const navigate = useNavigate();
	const [values, setValues] = useState({
		users: '',
		open: false,
		followMessage: ''
	});

	useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;
		const jwt = auth.isAuthenticated();
		findPeople({
			userId: jwt.user._id
		}, {
			t: jwt.token
		}, signal).then((data) => {
			if (data && data.error) {
				console.log(data.error);
			} else {
				setValues(v =>({users : data}));
			}
		});
		return function cleanup(){
			abortController.abort();
		};
	},[]);

	const clickFollow = (user, index) => {
		const jwt = auth.isAuthenticated();
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
		return navigate('/');
	};	
	
	return (
		<Paper className={classes.root} elevation={4}>
			<Typography variant="h4" className={classes.title}>
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
								<Link to={"/users/" + item._id}>
									<IconButton variant={"contained"} color={"secondary"}
										className={classes.viewButton}>
										<PanoramaFishEye/>
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
				{values.followMessage &&
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