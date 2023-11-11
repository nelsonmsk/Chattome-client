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
	minHeight: 'calc(100vh - 123px)',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0px !important',
  }
}));

export default function ProfileTabs(props) {

	const classes = useStyles();
	
	const [value, setValue] = useState(0);

	const onChange = (e, value) =>{
		setValue(value);
	};
	
	return (<div className={classes.root}>
		<Tabs className={classes.tab} value={value} onChange={onChange} >
			<Tab label="Posts" />
			<Tab label="Followers" /> 
			<Tab label="Following" />
		</Tabs>
		if(value === 0)();
		if(value === 1)(<FollowGrid people={props.user.followers}/>);
		if(value === 2)(<FollowGrid people={props.user.following}/>);
	</div>)
};

ProfileTabs.propTypes = {
	user: PropTypes.array.isRequired
};
