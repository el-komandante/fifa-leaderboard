/* jshint esversion: 6 */
import { Router, Route, IndexRoute, IndexLink, browserHistory, hashHistory, Link } from 'react-router';
import { render } from 'react-dom';
import React from 'react';
import Leaderboard from './components/Leaderboard';
import SubmitResult from './components/Submit';
import UserDetail from './components/UserDetail';
import App from './components/App';

render(
  (
    <Router history={hashHistory}>
      <Route path='/' component={ App }>
        <IndexRoute component={ Leaderboard}/>
        <Route path='submit' component={ SubmitResult }/>
        <Route path='/users/:id' component={ UserDetail }/>
      </Route>
    </Router>
  ),
  document.getElementById('app')
);
