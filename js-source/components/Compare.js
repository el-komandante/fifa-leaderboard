/* jshint esversion: 6 */
/*jshint asi:true*/
import React, { Component } from 'react'
import { IndexLink, Link } from 'react-router'
import Loader from './Loader'
import * as services from '../api-services/apiService'
import moment from 'moment'
import { StaggeredMotion, spring } from 'react-motion'

export default class Compare extends Component {
  constructor (props) {
    super(props)
    this.state = {
      users: [],
      games: []
    }
    console.log(this.props.params)
    const id1 = +this.props.params.id1
    const id2 = +this.props.params.id2
    services.getUser(id1)
    .then( user => {
      services.getGames(id1)
      .then( games => this.setState({
        users: this.state.users.concat(user),
        games: this.state.games.concat(games)
      }))
    })
    services.getUser(id2)
    .then( user => {
      services.getGames(id2)
      .then( games => this.setState({
        users: this.state.users.concat(user),
        games: this.state.games.concat(games)
      }))
    })

  }
  getRows () {
    const { users } = this.state
    let { games } = this.state
    let filtered = games.filter((game) => {
      if (game.winner.id === users[0].id &&  game.loser.id === users[1].id) {
        return 1
      } else if (game.winner.id === users[1].id &&  game.loser.id === users[0].id) {
        return 1
      } else {
        return 0
      }
    })
    const startOpacity = 0
    const startY = 100
    const defaultStyles = filtered.slice(0, 5).map( () => { return {o: startOpacity, y: startY} })
    const springParams = {stiffness: 220, damping: 22}

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
                  <div className='compare-item compare-winner'>
                    <Link to={ `/users/${games[i].winner.id}` }>
                      { games[i].winner.name }
                    </Link>
                  </div>
                  <div className='compare-item compare-loser'>
                    <Link to={ `/users/${games[i].loser.id}` }>
                      { games[i].loser.name }
                    </Link>
                  </div>
                  <div className='compare-item compare-score'>
                    {`${games[i].winner_goals} - ${games[i].loser_goals}`}
                  </div>
                  <div className='compare-item compare-date'>
                    {moment.unix(games[i].date).format('MM/DD/YYYY')}
                  </div>
                </div>
              )}
            </div>
          }
        </StaggeredMotion>
    )
  }
  render () {
    const { users } = this.state
    return users.length < 2
    ? <Loader />
    :(
      <div className='container'>
        <div className='detail-name'>
          <h1 className='ea-font'>
            {`${users[0].name} VS. ${users[1].name}`}
          </h1>
        </div>
        <div className='back'>
          <h2>
            <IndexLink to="/">
              <i className="fa fa-arrow-left back" aria-hidden="true"></i>
            </IndexLink>
          </h2>
        </div>
        <div className='compare-header'>
          <div className='compare-header-item recent-game-result'>Winner</div>
          <div className='compare-header-item recent-game-vs'>Loser</div>
          <div className='compare-header-item recent-game-score'>Score</div>
          <div className='compare-header-item recent-game-date'>Date</div>
        </div>
        {this.getRows()}
      </div>
    )
  }
}
