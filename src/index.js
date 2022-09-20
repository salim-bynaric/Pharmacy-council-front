import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';

const browserHistory = createBrowserHistory({});

ReactDOM.render(
  <React.StrictMode>
    <Router history={browserHistory}>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
