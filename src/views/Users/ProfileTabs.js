import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {Tabs, Tab} from '@material-ui/core';

import FollowGrid from './FollowGrid';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
	height: '100%',
	minHeight: '200px',
	alignItems: 'center',
	justifyContent: 'center',
	//padding: '0px !important',
  }
}));

export default function ProfileTabs(props) {

	const classes = useStyles();
	const [value, setValue] = useState(0);

	const onChange = (e, value) =>{
		setValue(value);
	};
	const displayGrid = value =>{
		if(value === 2){
			return (<FollowGrid people={props.user.following}/>);
		}else if(value === 1){ 
			return (<FollowGrid people={props.user.followers}/>);
		}else{ return '';}
	};
	
	console.log('grid:',props.user.followers);
	return (<div className={classes.root}>
		
		<Tabs className={classes.tab} value={value} onChange={onChange} >
			<Tab label={"Posts"} selected={value ===0 ? "true":"false"}/>
			<Tab label="Followers" selected={value ===1 ? "true":"false"}/> 
			<Tab label="Following" selected={value ===2 ? "true":"false"}/>
		</Tabs>
		{( displayGrid(value) )}
	</div>)
};

ProfileTabs.propTypes = {
	user: PropTypes.array.isRequired
};
