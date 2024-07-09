import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from '@material-ui/core';
import {ArrowForward,Person} from '@material-ui/icons';

import {list} from './api-user';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
	height: '100%',
	minHeight: 'calc(100vh - 123px)',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0px !important',
  }
}));

export default function Users() {
const classes = useStyles();
const [users, setUsers] = useState([]);

useEffect(() => {
	const abortController = new AbortController();
	const signal = abortController.signal;
	
	list(signal).then((data) => {
		if (data && data.error) {
			console.log(data.error);
		} else {	
			setUsers(data);
			console.log('all users', data);
		}
	});
	return function cleanup(){
		abortController.abort();
	}
}, []);

return (
	<Paper className={classes.root} elevation={4}>
		<Typography variant="h6" className={classes.title}>
			All Users
		</Typography>
		<List dense>
		{users?
			(users.map((item, i) => {
				return <Link to={"/users/" + item._id} key={i}>
					<ListItem button>
						<ListItemAvatar>
							<Avatar>
								<Person/>
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary={item.name}/>
						<ListItemSecondaryAction>
							<IconButton>
								<ArrowForward/>
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				</Link>
			})
			)
		:	(
				<Link to={"/users/"} >
					<ListItem button>
						<ListItemAvatar>
							<Avatar>
								<Person/>
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary={"No Users Found"}/>
						<ListItemSecondaryAction>
							<IconButton>
								<ArrowForward/>
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				</Link>	
		)
		}
		</List>
	</Paper>
);

}





