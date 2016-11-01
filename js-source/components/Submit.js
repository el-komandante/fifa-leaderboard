/* jshint esversion: 6 */
import React from 'react';
import * as services from '../api-services/apiService';
import { IndexLink } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


export default class SubmitResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      winner: '',
      loser: '',
      winScore: 0,
      loseScore: 0,
      users: []
    };
    services.getUsers()
    .then(users => { this.setState({users})})
  }

  getOptions () {
    let users = this.state.users.map( (user, i) => {
      return <option key={i}>{user.name}</option>;
    });
    return users;
  }

  handleSubmit (e) {
    console.log(this.state);
  }

  handleWinnerChange (e) {
    let value = e.target.value;
    this.setState({
      winner: value
    });
  }

  handleLoserChange (e) {
    let value = e.target.value;
    this.setState({
      loser: value
    });
  }

  handleWinScoreChange (e) {
    let value = parseInt(e.target.value) || 0;
    this.setState({
      winScore: value
    });
  }

  handleLoseScoreChange (e) {
    let value = parseInt(e.target.value) || 0;
    this.setState({
      loseScore: value
    });
  }

  render () {
    return (
        <div>
          <div className='submit-name'>
            <h1 className='ea-font'>
              Submit Result
            </h1>
          </div>
          <div className='back'>
            <h2>
              <IndexLink to="/">
                <i className="fa fa-arrow-left back" aria-hidden="true"></i>
              </IndexLink>
            </h2>
          </div>
          <div className='form'>
            <div className='winner-select select'>
              <h2>Winner</h2>
              <select onChange={this.handleWinnerChange.bind(this)}>
                {this.getOptions()}
              </select>
            </div>
            <div className='score-form'>
              <h2>Score</h2>
              <div className='match-score'>
                <div className='letters'>
                  <div className='splitter'></div>
                  <div className='w'><h2>W</h2></div>
                  <div className='l'><h2>L</h2></div>
                  <div className='splitter'></div>
                </div>
                <div className='score'>
                  <div className='splitter'></div>
                  <div className='win-score'>
                    <input className='score-input' onChange={this.handleWinScoreChange.bind(this)} value={this.state.winScore}></input>
                  </div>
                  <div className='lose-score'>
                    <input className='score-input' value={this.state.loseScore} onChange={this.handleLoseScoreChange.bind(this)}></input>
                  </div>
                  <div className='splitter'></div>
                </div>
              </div>
            </div>
            <div className='loser-select select'>
              <h2>Loser</h2>
              <select>
                {this.getOptions()}
              </select>
            </div>
          </div>
          <button className='submit-button' onClick={this.handleSubmit.bind(this)}><a>SUBMIT</a></button>
        </div>
    );
  }
}
