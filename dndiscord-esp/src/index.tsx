import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import App from './App';
import CreateCharacter from './pages/CreateCharacter';
import Rules from './pages/Rules';
import Play from './pages/Play';
import './index.css';

render(
	() => (
		<Router>
			<Route path="/" component={App} />
			<Route path="/create" component={CreateCharacter} />
			<Route path="/play" component={Play} />
			<Route path="/rules" component={Rules} />
		</Router>
	),
	document.getElementById('root') as HTMLElement
);


