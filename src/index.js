import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import ReactDOM from 'react-dom'
import React from 'react'
import Leaderboard from './components/Leaderboard'
import SubmitResult from './components/Submit'
import UserDetail from './components/UserDetail'
import App from './App'
import './index.css'
import './font-awesome.css'

ReactDOM.render(
  (
    <Router history={hashHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={Leaderboard}/>
        <Route path='submit' component={SubmitResult}/>
        <Route path='/users/:id' component={UserDetail}/>
      </Route>
    </Router>
  ),
  document.getElementById('root')
);
