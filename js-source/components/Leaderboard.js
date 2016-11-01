/* jshint esversion: 6 */
import React from 'react';
import * as services from '../api-services/apiService';



export default class Leaderboard extends React.Component {
  constructor() {
    console.log(2)
    super();
    this.state = {
      users: []
    };

    services.getUsers()
    .then(users => { this.setState({users})})
  }

  getLeaderboardItems () {
    let data = this.state.users;
    let rows = data.map(function (user, i) {
       return (
         <div key={i} className='row'>
           <div className='leaderboard-item position'>{i + 1}</div>
           <div className='leaderboard-item name'><a className='name' href={'./#/users/'+ user.id}>{user.name}</a></div>
           <div className='leaderboard-item wins'>{user.wins}</div>
           <div className='leaderboard-item losses'>{user.losses}</div>
           <div className='leaderboard-item elo'>{user.score}</div>
           <div className='leaderboard-item one-week'>
             {
               Math.random() < .5 ?
               (<i className="fa fa-arrow-up increasing" aria-hidden="true"></i>):
               (<i className="fa fa-arrow-down decreasing" aria-hidden="true"></i>)
             }
           </div>
         </div>
       );
    });
    return rows
  }

  componentWillMount () {
    this.getLeaderboardItems();
  }

  render () {
    let rows = this.getLeaderboardItems()
    return (
      <div>
      <div>
        <h1 className='ea-font'>FIFA 17 RANKINGS</h1>
      </div>
        <button className='submit-result'><a href='./#/submit'>SUBMIT RESULT</a></button>
        <div className='leaderboard'>
          <h2 className='ea-font rankings'>RANKINGS</h2>
          <div className='leaderboard-header'>
            <div className='leaderboard-header-item position'></div>
            <div className='leaderboard-header-item name'>Name</div>
            <div className='leaderboard-header-item wins'>Wins</div>
            <div className='leaderboard-header-item losses'>Losses</div>
            <div className='leaderboard-header-item elo'>Elo</div>
            <div className='leaderboard-header-item one-week'></div>
          </div>
          {rows}
        </div>
      </div>
    );
  }
}
