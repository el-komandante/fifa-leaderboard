/* jshint esversion: 6 */
import React from 'react'
import * as services from '../api-services/apiService'
import { IndexLink } from 'react-router'
import { Motion, spring } from 'react-motion'

export default class SubmitResult extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      winner_id: 1,
      loser_id: 1,
      winner_goals: 0,
      loser_goals: 0,
      password: '',
      users: [],
      goalError: false,
      playerError: false,
      pwError: false,
      isSubmitted: false
    }
    services.getUsers()
    .then(users => {
      users = users.sort( (a, b) => {
        if (a.id < b.id) {
          return -1
        }
        if (a.id > b.id) {
          return 1
        }
        return 0
      })
      this.setState({users})
    })
  }

  getOptions () {
    let users = this.state.users.map( (user, i) => {
      return <option key={user} data-id={user.id} key={i}>{user.name}</option>
    })
    return users
  }

  handleSubmit (e) {
    let goalError = false
    let playerError = false
    let game = {
      winner_goals: this.state.winner_goals,
      loser_goals: this.state.loser_goals,
      winner_id: this.state.winner_id,
      loser_id: this.state.loser_id
    }
    if (game.winner_goals < game.loser_goals) {
      goalError = true
      this.setState({goalError: true})
    }
    else if (game.winner_goals >= game.loser_goals) {
      goalError = false
      this.setState({goalError: false})
    }

    if (game.winner_id === game.loser_id) {
      playerError = true
      this.setState({playerError: true})
    }
    else if (game.winner_id != game.loser_id) {
      playerError = false
      this.setState({playerError: false})
    }

    if (!goalError && !playerError) {
      services.submitGame(game, this.state.password)
      .then(response => {
          this.setState({
            isSubmitted: true,
            pwError: false
          }, setTimeout(
            () => {this.context.router.push('/')},
            1500
          ))
      })
      .catch(err => {
        if (err.response.status === 401) {
          this.setState({
            pwError: true
          })
        } else {
          console.error(err)
        }
      })
    }
  }

  handleWinnerChange (e) {
    let value = +e.target.options[e.target.selectedIndex].dataset.id
    this.setState({
      winner_id: value
    })
  }

  handleLoserChange (e) {
    let value = +e.target.options[e.target.selectedIndex].dataset.id
    this.setState({
      loser_id: value
    })
  }

  handleWinScoreChange (e) {
    let value = parseInt(e.target.value) || 0
    this.setState({
      winner_goals: value
    })
  }

  handleLoseScoreChange (e) {
    let value = parseInt(e.target.value) || 0
    this.setState({
      loser_goals: value
    })
  }

  handlePasswordChange(e) {
    let value = e.target.value || ''
    this.setState({
      password: value
    })
  }
  render () {
    let options = this.getOptions()
    const { isSubmitted } = this.state
    const startO = 0
    const endO = isSubmitted ? 1 : 0
    const startY = 150
    const endY = isSubmitted ? 0 : 150
    return (
        <div className='container'>
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
              <label>
                <select className={this.state.playerError && 'error'} onChange={this.handleWinnerChange.bind(this)}>
                  {this.getOptions()}
                </select>
              </label>
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
                    <input className={this.state.goalError ? 'score-input error': 'score-input'} value={this.state.winner_goals} onChange={this.handleWinScoreChange.bind(this)}></input>
                  </div>
                  <div className='lose-score'>
                    <input className={this.state.goalError ? 'score-input error': 'score-input'} value={this.state.loser_goals} onChange={this.handleLoseScoreChange.bind(this)}></input>
                  </div>
                  <div className='splitter'></div>
                </div>
              </div>
            </div>
            <div className={'loser-select select'}>
              <h2>Loser</h2>
              <label>
                <select className={this.state.playerError && 'error'} onChange={this.handleLoserChange.bind(this)}>
                  {this.getOptions()}
                </select>
              </label>
            </div>
          </div>
          <div className="password-container">
            <h3 className="password-header">Password</h3>
            <input type="text" className={this.state.pwError ? 'password error' : 'password'} onChange={ this.handlePasswordChange.bind(this) }/>
          </div>
          <button className='submit-button' onClick={this.handleSubmit.bind(this)}>SUBMIT</button>
          <Motion defaultStyle={ {o: startO, y: startY} } style={ {o: spring(endO), y: spring(endY)} }>
            { style => (
                <div className="submit-success" style={ {opacity: style.o, transform: `translateY(${style.y}%)`} }>
                  <h3>Nice!</h3>
                </div>
              )
            }
          </Motion>
        </div>
    )
  }
}

SubmitResult.contextTypes = {
   router: React.PropTypes.object.isRequired
 }
