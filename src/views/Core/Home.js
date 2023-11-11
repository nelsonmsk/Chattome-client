import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import unicornbikeImg from './../../assets/images/cover1.jpg';

const useStyles = makeStyles(theme => ({
	card: {
		maxWidth: '100%',
		height: '100%',
		minHeight: 'calc(100vh - 123px)',
		margin: 'auto',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '0px !important',
		marginTop: '0px !important',
		backgroundImage: 'url(' + unicornbikeImg + ')' ,
		backgroundRepeat: 'no-repeat',
		backgroundAttachment: 'scroll',
		backgroundSize: 'cover',
	},
	content: {
	backgroundColor: 'rgb(0 0 0 / 35%)',	
	minHeight: 'calc(100vh - 123px)',
	width: '100%',
    justifyContent: 'center',
    display: 'flex',
	color: 'white !important',
	alignItems: 'center'
	},
	title: {
		padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
		color: theme.palette.openTitle,
	},
	h1 :{
		
	},
	media: {
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',	
		minHeight: 'calc(100vh - 126px)',
		height:'100%',
	}
}));

export default function Home(){
	const classes = useStyles();
		return (
			<Card className={classes.card}>
				<CardContent className={classes.content}>
					<Typography variant="h2" component="p">
						Connect with Friends & Family on Chattome.
					</Typography>
				</CardContent>
			</Card>
		)
};