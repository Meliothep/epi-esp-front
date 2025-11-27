import { render } from 'solid-js/web';
import App from './App';
import './index.css';

const root = document.getElementById('root');

if ((import.meta as any).env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or did the id attribute get misspelled?',
  );
}

render(() => <App />, root!);
