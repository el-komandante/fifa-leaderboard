/* jshint esversion: 6 */
import React from 'react';
import * as services from '../api-services/apiService';



export default class Leaderboard extends React.Component {
  constructor() {
    super();
    this.state = {
      users: []
    };

    let users = services.getUsers()
    .then(users => {
      this.state.users = users
      this.forceUpdate()

      for (let i = 0; i < users.length; i++) {
        let user = users[i]
        services.getGames(user.id).then( games => {
          user.games = games;
          user.oldScore = (user.id === user.games[0].winner.id) ? games[0].winner.score: games[0].loser.score;
          user.newScore = (user.id === user.games[1].winner.id) ? user.games[1].winner.score: user.games[1].loser.score;
          users[i] = user
          this.forceUpdate()
        })
      }
    })
  }

  getLeaderboardItems () {
    let data = this.state.users;
    // data = data.map( user => {
    //   // user.games = [];
    //   services.getGames(user.id).then( games => { user.games = games.reverse().slice(games.length-3, games.length-1) })
    //   // user.games = games;
    //   return user;
    // })
    console.log(data);
    let rows = data.map( (user, i) => {
      // let oldScore = (user.id === user.games[0].winner.id) ? user.games[0].winner.score: user.games[0].loser.score;
      // let newScore = (user.id === user.games[1].winner.id) ? user.games[1].winner.score: user.games[1].loser.score;
      console.log(user.oldScore)
       return (
         <div key={i} className='row'>
           <div className='leaderboard-item position'>{i + 1}</div>
           <div className='leaderboard-item name'><a className='name' href={'./#/users/'+ user.id}>{user.name}</a></div>
           <div className='leaderboard-item wins'>{user.wins}</div>
           <div className='leaderboard-item losses'>{user.losses}</div>
           <div className='leaderboard-item elo'>{user.score}</div>
           <div className='leaderboard-item one-week'>
             {
               user.oldScore === user.newScore ? '-' :user.oldScore < user.newScore ?
                   (<i className="fa fa-arrow-up increasing" aria-hidden="true"></i>):
                   (<i className="fa fa-arrow-down decreasing" aria-hidden="true"></i>)
             }
           </div>
         </div>
       );
    });
    return rows
  }

  // componentWillMount () {
  //   console.log(this.state)
  // }
  componentDidMount () {
    // console.log(this.state)
  }

  // componentDidUpdate () {
  //   // let users = this.state.users.map( user => {
  //   //   user.games = services.getGames(user.id).then(games => { return games; });
  //   //   return user;
  //   // })
  //   // console.log(this.state.users)
  //   // this.setState({users});
  //   // this.getLeaderboardItems();
  // }

  render () {
    console.log(this.state)
    let rows = this.getLeaderboardItems();
    return (
      <div className='container'>
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
