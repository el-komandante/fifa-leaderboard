/* jshint esversion: 6 */
import React from 'react';
import * as services from '../api-services/apiService';
import { StaggeredMotion, spring } from 'react-motion';



export default class Leaderboard extends React.Component {
  constructor() {
    super();
    this.state = {
      users: null
    };
    services.getUsers()
      .then(users => {
        for (let i = 0; i < users.length; i++) {
          let user = users[i]
          services.getGames(user.id).then( games => {
            user.games = games.reverse();
            // console.log(user.games)
            user.oldScore = user.id === user.games[0].winner.id ? games[0].winner_score: games[0].loser_score;
            user.newScore = user.id === user.games[1].winner.id ? user.games[1].winner_score: user.games[1].loser_score;
            users[i] = user
          })
          this.setState({users})
      }});

  }
  componentDidMount () {
    // let users = services.getUsers()
    // .then(users => {
    //   this.state.users = users
    //   this.forceUpdate()
    //
      // for (let i = 0; i < users.length; i++) {
      //   let user = users[i]
      //   services.getGames(user.id).then( games => {
      //     user.games = games.reverse();
      //     // console.log(user.games)
      //     user.oldScore = user.id === user.games[0].winner.id ? games[0].winner_score: games[0].loser_score;
      //     user.newScore = user.id === user.games[1].winner.id ? user.games[1].winner_score: user.games[1].loser_score;
      //     users[i] = user
      //     this.forceUpdate()
      //   })
      // }
    // })
  }

  getLeaderboardItems () {
    const users = this.state.users;
    const startOpacity = 0;
    const startY = 100;
    const defaultStyles = users.map( () => { return {o: startOpacity, y: startY} });
    const springParams = {stiffness: 190, damping: 22};

    return (
      <StaggeredMotion
      defaultStyles={defaultStyles}
      styles={prevInterpolatedStyles => prevInterpolatedStyles.map((_, i) => {
        return i === 0
          ? {o: spring(1, springParams), y: spring(0, springParams)}
          : {o: spring(prevInterpolatedStyles[i - 1].o), y: spring(prevInterpolatedStyles[i - 1].y, springParams)}
      })}>
      {interpolatingStyles =>
        <div>
          {interpolatingStyles.map((style, i) =>
            <div key={i} className='row' style={{opacity: style.o, transform: `translateY(${style.y}px)`}}>
              <div className='leaderboard-item position'>{i + 1}</div>
              <div className='leaderboard-item name'><a className='name' href={`./#/users/${users[i].id}`}>{users[i].name}</a></div>
              <div className='leaderboard-item wins'>{users[i].wins}</div>
              <div className='leaderboard-item losses'>{users[i].losses}</div>
              <div className='leaderboard-item elo'>{users[i].score}</div>
              <div className='leaderboard-item one-week'>
                {
                  users[i].oldScore === users[i].newScore
                  ? '-'
                  :users[i].oldScore < users[i].newScore
                    ?(<i className="fa fa-arrow-up increasing" aria-hidden="true"></i>)
                    :(<i className="fa fa-arrow-down decreasing" aria-hidden="true"></i>)
                }
              </div>
            </div>
          )}
        </div>
      }
    </StaggeredMotion>
    )
  }

  render () {
    if (this.state.users) {
      const leaderboardItems = this.getLeaderboardItems();
      return (
        <div className='container'>
          <div>
            <h1 className='ea-font'>FIFA 17 RANKINGS</h1>
          </div>
          <div className='submit-container'>
            <a className='submit-result' href='./#/submit'>SUBMIT RESULT</a>
          </div>
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
          </div>
          <div>{leaderboardItems}</div>
        </div>
      );
    }
    return (
      <div className='container'>
        <div>
          <h1 className='ea-font'>FIFA 17 RANKINGS</h1>
        </div>
        <div className='submit-container'>
          <a className='submit-result' href='./#/submit'>SUBMIT RESULT</a>
        </div>
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
        </div>
      </div>
    );
    // const users = this.state.users;
    // const startOpacity = 0;
    // const defaultStyles = users.map( () => { return {o: startOpacity} })
    // let rows = this.getLeaderboardItems();
    // console.log(defaultStyles);
  }
}
