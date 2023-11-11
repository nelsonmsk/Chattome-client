import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import {GridList, GridListTile, Button, Avatar, Typography} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
	height: '50%',
	minHeight: 'calc(100vh - 123px)',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0px !important',
  }
}));

export default function FollowGrid (props) {
	
	const classes = useStyles();
	
	return (<div className={classes.root}>
		<GridList cellHeight={160} className={classes.gridList} cols={4}>
			{props.people?
				(props.people.map((person, i) => {
					return <GridListTile style={{'height':120}} key={i}>
						<Link to={"/user/" + person._id}>
							<Avatar src={'/api/users/photo/'+person._id}
								className={classes.bigAvatar}/>
							<Typography className={classes.tileText}>
								{person.name}
							</Typography>
						</Link>
					</GridListTile>
				}))
			:
				(
					 <GridListTile style={{'height':120}}>
						<Link to={"/users/"}>
							<Avatar src={''}
								className={classes.bigAvatar}/>
							<Typography className={classes.tileText}>
								{'No Name found'}
							</Typography>
						</Link>
					</GridListTile>
				)
			}
		</GridList>
	</div>)
};

FollowGrid.propTypes = {
	people: PropTypes.array.isRequired
};
