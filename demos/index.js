import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import 'cloud-react/cloud-react.css';

import App from './app';


const rootElement = document.getElementById('root');

ReactDOM.render(
	<Router>
		<App />
	</Router>,
	rootElement
);
