import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';

import theme from './theme/theme';
import MainRouter from './Routes';

export default class App extends Component {
  render() {
	return (
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<MainRouter/>
			</ThemeProvider>
		</BrowserRouter>
    );
  }
};
