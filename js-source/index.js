/* jshint esversion: 6 */
import { Router, Route, IndexRoute, IndexLink, browserHistory, hashHistory, Link } from 'react-router';
import { render } from 'react-dom';
import React from 'react';
import Leaderboard from './components/Leaderboard';
import SubmitResult from './components/Submit';
import UserDetail from './components/UserDetail';
import App from './components/App';


let data = [
  {
    name: 'Gayrus',
    wins: 10,
    losses: 5,
    elo: 2000,
    rank: 1,
    id: 1,
    increasing: true,
    eloHistory: [
      {
        date: '01/15/2015',
        elo: 1200
      },
      {
        date: '01/31/2015',
        elo: 1100
      },
      {
        date: '02/20/2015',
        elo: 1300
      },
      {
        date: '03/11/2015',
        elo: 1400
      },
      {
        date: '03/30/2015',
        elo: 1500
      },
      {
        date: '04/01/2015',
        elo: 1300
      },
      {
        date: '05/10/2015',
        elo: 1200
      },
      {
        date: '06/22/2015',
        elo: 1300
      },
      {
        date: '07/11/2015',
        elo: 1400
      },
      {
        date: '08/25/2015',
        elo: 1800
      },
      {
        date: '09/09/2015',
        elo: 900
      },
      {
        date: '10/20/2015',
        elo: 1300
      },
      {
        date: '11/11/2015',
        elo: 2000
      },
      {
        date: '01/01/2016',
        elo: 1700
      },
      {
        date: '02/01/2016',
        elo: 1400
      },
      {
        date: '03/01/2016',
        elo: 1200
      },
      {
        date: '04/01/2016',
        elo: 1400
      },
      {
        date: '05/01/2016',
        elo:1700
      },
      {
        date: '06/01/2016',
        elo: 1800
      },
      {
        date: '07/01/2016',
        elo: 2000
      }
    ]
  },
  {
    name: 'Jaymar',
    wins: 7,
    losses: 4,
    elo: 1700,
    rank: 2,
    id: 2,
    increasing: true,
    eloHistory: [
      {
        date: '01/15/2016',
        elo: 800
      },
      {
        date: '02/10/2016',
        elo: 1100
      },
      {
        date: '03/22/2016',
        elo: 1200
      },
      {
        date: '04/07/2016',
        elo: 1400
      },
      {
        date: '05/01/2016',
        elo:1700
      },
      {
        date: '06/01/2016',
        elo: 1800
      },
      {
        date: '07/19/2016',
        elo: 3100
      }
    ]
  },
  {
    name: 'Cuddles III',
    wins: 2,
    losses: 3,
    elo: 1500,
    rank: 3,
    id: 3,
    increasing: false,
    eloHistory: []
  },
  {
    name: 'Flemingo',
    wins: 5,
    losses: 3,
    elo: 1400,
    rank: 4,
    id: 4,
    increasing: true,
    eloHistory: []
  },
  {
    name: 'Frandildo',
    wins: 4,
    losses: 2,
    elo: 1200,
    rank: 5,
    id: 5,
    increasing: false,
    eloHistory: []
  }
];
let games  = [
  {
    winner: {
      name: 'Gayrus',
      score: 7,
      id: 1
    },
    loser: {
      name: 'Frandildo',
      score: 4,
      id: 5
    },
    date: '10/20/2016',
    draw: false,
    id: 1,
  },
  {
    winner: {
      name: 'Jaymar',
      score: 10,
      id: 2
    },
    loser: {
      name: 'Gayrus',
      score: 4,
      id: 1
    },
    date: '10/22/2016',
    draw: false,
    id: 2,
  },
  {
    winner: {
      name: 'Cuddles III',
      score: 6,
      id: 3
    },
    loser: {
      name: 'Flemingo',
      score: 4,
      id: 4
    },
    date: '10/25/2016',
    draw: false,
    id: 3,
  }
];

// let elo = [
//   {
//     date: '01/01/2016',
//     elo: 1000
//   },
//   {
//     date: '02/01/2016',
//     elo: 1100
//   },
//   {
//     date: '03/01/2016',
//     elo: 1200
//   },
//   {
//     date: '04/01/2016',
//     elo: 1400
//   },
//   {
//     date: '05/01/2016',
//     elo:1700
//   },
//   {
//     date: '06/01/2016',
//     elo: 1800
//   },
//   {
//     date: '07/01/2016',
//     elo: 2000
//   }

render(
  (
    <Router history={hashHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={Leaderboard}/>
        <Route path='submit' component={SubmitResult}/>
        <Route path='/users/:id' component={UserDetail}/>
      </Route>
    </Router>
  ),
  document.getElementById('app')
);
