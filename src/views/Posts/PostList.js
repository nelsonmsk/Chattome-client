import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Post from './Post';

const useStyles = makeStyles(theme => ({
  root: {
	height: '100%',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0px !important',
	marginTop: '24px'
  },
  	title: {
		padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
		color: theme.palette.openTitle,
	},
}));

export default function PostList (props) {
	
	const classes = useStyles();
	return (
		<div className={classes.root}>
			{props.posts?
				(props.posts.map((item, i) => {
					return <Link to={"/posts/" + item._id} style={{textDecoration:'none', border:'none'}}>
								<Post post={item} key={i}
									onRemove={props.removeUpdate}/>
							</Link>
					})
				):(
					<Typography variant="h4" className={classes.title}>
						No Posts!!
					</Typography>
				)
			}
		</div>
	)
};

PostList.propTypes = {
	posts: PropTypes.array.isRequired,
	removeUpdate: PropTypes.func.isRequired
};
