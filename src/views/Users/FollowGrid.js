import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import {ImageList, ImageListItem, Button, Avatar, Typography} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
	height: '50%',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0px 16px !important',
  },
  imageList:{
  },
  listItem:{
	height: '100px !important',
	[theme.breakpoints.up('md')]: {
		width: '15% !important',
	},
	[theme.breakpoints.up('sm')]: {
		width: '20% !important',
	},
	[theme.breakpoints.down('xs')]: {
		width: '25% !important',
	},
  },
  tileText:{
	fontSize: '80%'
  }
}));

export default function FollowGrid (props) {
	
	const classes = useStyles();
	
	return (<div className={classes.root}>
		<ImageList className={classes.imageList}>
			{props.people?
				(props.people.map((person, i) => {
					return <ImageListItem className={classes.listItem} key={i}>
						<Link to={"/users/" + person._id} style={{textDecoration:'none'}}>
							<Avatar src={'/api/users/photo/'+person._id}
								className={classes.bigAvatar}/>
							<Typography className={classes.tileText}>
								{person.name}
							</Typography>
						</Link>
					</ImageListItem>
				}))
			:
				(
					 <ImageListItem style={{'height':120}}>
						<Link to={"/users/"} style={{textDecoration:'none'}}>
							<Avatar src={''}
								className={classes.bigAvatar}/>
							<Typography className={classes.tileText}>
								{'No Name found'}
							</Typography>
						</Link>
					</ImageListItem>
				)
			}
		</ImageList>
	</div>)
};

FollowGrid.propTypes = {
	people: PropTypes.array.isRequired
};
