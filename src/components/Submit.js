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
      winner_goals: " ",
      loser_goals: " ",
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
      return <option key={user.name} data-id={user.id}>{ user.name }</option>
    })
    return users
  }

  handleSubmit (e) {
    const { winner_id, loser_id, password } = this.state
    let { winner_goals, loser_goals } = this.state
    // winner_goals = parseInt(winner_goals)
    // loser_goals = parseInt(loser_goals)
    let errors = 0
    let game = {
      winner_goals,
      loser_goals,
      winner_id,
      loser_id
    }
    if (winner_goals < loser_goals || (winner_goals < 0 || loser_goals < 0)) {
      this.setState({goalError: true})
      errors += 1
    } else if (winner_goals >= loser_goals) {
      this.setState({goalError: false})
    }

    // if (winner_goals < 0 || loser_goals < 0) {
    //   this.setState({goalError: true})
    // } else {
    //   this.setState({goalError: false})
    // }

    if (winner_id === loser_id) {
      this.setState({playerError: true})
      errors += 1
    } else if (winner_id !== loser_id) {
      this.setState({playerError: false})
    }

    if (errors === 0) {
      services.submitGame(game, password)
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
    let value = parseInt(e.target.value, 10)
    this.setState({
      winner_goals: value
    })
  }

  handleLoseScoreChange (e) {
    let value = parseInt(e.target.value, 10)
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
    const { isSubmitted, goalError, playerError, pwError } = this.state
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
                <select className={ playerError && 'error' } onChange={ this.handleWinnerChange.bind(this) }>
                  { this.getOptions() }
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
                    <input type="number" min="0" className={ goalError ? 'score-input error': 'score-input' } placeholder={ 0 } onChange={ this.handleWinScoreChange.bind(this) }></input>
                  </div>
                  <div className='lose-score'>
                    <input type="number" min="0" className={ goalError ? 'score-input error': 'score-input' } placeholder={ 0 } onChange={ this.handleLoseScoreChange.bind(this) }></input>
                  </div>
                  <div className='splitter'></div>
                </div>
              </div>
            </div>
            <div className="loser-select select">
              <h2>Loser</h2>
              <label>
                <select className={ playerError && 'error' } onChange={ this.handleLoserChange.bind(this) }>
                  { this.getOptions() }
                </select>
              </label>
            </div>
          </div>
          <div className="password-container">
            <h2 className="password-header">Password</h2>
            <input type="text" className={ pwError ? 'password error' : 'password' } onChange={ this.handlePasswordChange.bind(this) }/>
          </div>
          <button className='submit-button' onClick={ this.handleSubmit.bind(this) }>SUBMIT</button>
          <Motion defaultStyle={ {o: startO, y: startY} } style={ {o: spring(endO), y: spring(endY)} }>
            { style => (
                <div className="submit-success" style={ {opacity: style.o, transform: `translateY(${style.y}%)`} }>
                  <h1>Nice!</h1>
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
