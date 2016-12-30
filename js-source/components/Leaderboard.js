/* jshint esversion: 6 */
import React from 'react'
import * as services from '../api-services/apiService'
import CompareButton from './CompareButton'
import { Link } from 'react-router'
import { StaggeredMotion, spring } from 'react-motion'



export default class Leaderboard extends React.Component {
  constructor() {
    super()
    this.state = {
      users: null,
      sort: 'elo-desc',
      checked: {'0': 0},
      numberChecked: 0
    }
    services.getUsers()
      .then(users => {
        users = users.map( (user, i) => {
          user.rank = i+1
          return user
        })
        for (let i = 0; i < users.length; i++) {
          let user = users[i]
          services.getGames(user.id).then( games => {
            user.games = games.reverse()
            //winner_score and loser_score are reversed
            user.oldScore = user.id === user.games[1].winner.id ? games[1].loser_score: games[1].winner_score
            user.newScore = user.score
            users[i] = user
          })
          this.setState({users})
      }})

  }
  handleClick (e) {
    const user_id = e.target.value
    const { checked } = this.state
    const { numberChecked } = this.state

    if (numberChecked >= 2 && !this.isChecked(user_id)) {
      e.preventDefault()
      e.stopPropagation()
      return false
    } else if (this.state.checked[user_id] === 1) {
      checked[user_id] = 0
      this.setState({
        checked: checked,
        numberChecked: this.state.numberChecked - 1
      });
    } else {
      checked[user_id] = 1
      this.setState({
        checked: checked,
        numberChecked: this.state.numberChecked + 1
      })
    }
  }
  isChecked (user_id) {
    return this.state.checked[user_id] === 1
  }
  getLeaderboardItems () {
    const { users } = this.state
    const startOpacity = 0
    const startY = 80
    const startMargin = 0
    const selectedMargin = -2
    const startWidth = 100
    const selectedWidth = 104
    const startHeight = 32
    const selectedHeight = 50
    const startShadow = 0
    const selectedShadow = 0.5
    const defaultStyles = users.map( () => { return {o: startOpacity, y: startY, width: startWidth, height: startHeight, marginLeft: startMargin}})
    const springParams = {stiffness: 220, damping: 24}
    const heightSpringParams = {stiffness: 200, damping: 20}
    const widthSpringParams = {stiffness: 300, damping: 20}
    return (
      <StaggeredMotion
        defaultStyles={ defaultStyles }
        styles={prevInterpolatedStyles => prevInterpolatedStyles.map((_, i) => {
          const { users } = this.state
          const isChecked = this.isChecked(users[i].id)
          return i === 0
            ? {
                o: spring(1, springParams),
                y: spring(0, springParams),
                marginLeft: (isChecked ? spring(selectedMargin, widthSpringParams) : spring(startMargin, widthSpringParams)),
                width: (isChecked ? spring(selectedWidth, widthSpringParams) : spring(startWidth, widthSpringParams)),
                height: (isChecked ? spring(selectedHeight, heightSpringParams) : spring(startHeight, heightSpringParams)),
                shadow: isChecked ? spring(selectedShadow) : spring(startShadow)
              }
            : {
                o: spring(prevInterpolatedStyles[i - 1].o),
                y: spring(prevInterpolatedStyles[i - 1].y, springParams),
                marginLeft: (isChecked ? spring(selectedMargin, widthSpringParams) : spring(startMargin, widthSpringParams)),
                width: (isChecked ? spring(selectedWidth, widthSpringParams) : spring(startWidth, widthSpringParams)),
                height: (isChecked ? spring(selectedHeight, heightSpringParams) : spring(startHeight, heightSpringParams)),
                shadow: isChecked ? spring(selectedShadow) : spring(startShadow)
              }
      })}>
      {interpolatingStyles =>
        <div>
          {interpolatingStyles.map((style, i) => {
            const isChecked = this.isChecked(users[i].id)
            return (
              <div key={i} className={isChecked ? 'row checked' : 'row'} style={{opacity: style.o, transform: `translate(0%, ${style.y}px)`, width: `${style.width}%`, height: style.height, marginLeft: `${style.marginLeft}%`, boxShadow: '0px 20px 20px -20px rgba(0,0,0,0.5), 0px -20px 20px -20px rgba(0,0,0,0.5)'}}>
                <div className={'leaderboard-item checkbox'}><input type='checkbox' value={users[i].id} onClick={this.handleClick.bind(this)} /></div>
                <div className='leaderboard-item position'>{users[i].rank}</div>
                <div className='leaderboard-item name'><a className='name' href={`./#/users/${users[i].id}`}>{users[i].name}</a></div>
                <div className='leaderboard-item wins'>{users[i].wins}</div>
                <div className='leaderboard-item losses'>{users[i].losses}</div>
                <div className='leaderboard-item elo'>{users[i].score}</div>
                <div className='leaderboard-item one-week'>
                  {
                    users[i].oldScore === users[i].newScore
                    ? '-'
                    :users[i].newScore > users[i].oldScore
                      ?(<i className="fa fa-arrow-up increasing" aria-hidden="true"></i>)
                      :(<i className="fa fa-arrow-down decreasing" aria-hidden="true"></i>)
                  }
                </div>
              </div>
            )
          })}
        </div>
      }
    </StaggeredMotion>
    )
  }

  handleNameSort () {
    if (this.state.sort != 'name-desc') {
      const sorted = this.state.users.sort( (a, b) => {
        if (a.name < b.name) {
          return -1
        }
        if (a.name > b.name) {
          return 1
        }
        return 0
      })
      this.setState({
        users: sorted,
        sort: 'name-desc'
      })
    }
    else if (this.state.sort === 'name-desc') {
      const sorted = this.state.users.sort ( (a, b) => {
        if (a.name < b.name) {
          return 1
        }
        if (a.name > b.name) {
          return -1
        }
        return 0
      })
      this.setState({
        users: sorted,
        sort: 'name-asc'
      })
    }
  }

  handleEloSort () {
    if (this.state.sort != 'elo-desc') {
      const sorted = this.state.users.sort( (a, b) => {
        if (a.score < b.score) {
          return 1
        }
        if (a.score > b.score) {
          return -1
        }
        return 0
      })
      this.setState({
        users: sorted,
        sort: 'elo-desc'
      })
    }
    else if (this.state.sort === 'elo-desc') {
      const sorted = this.state.users.sort( (a, b) => {
        if (a.score < b.score) {
          return -1
        }
        if (a.score > b.score) {
          return 1
        }
        return 0
      })
      this.setState({
        users: sorted,
        sort: 'elo-asc'
      })
    }
  }

  handleWinSort () {
    if (this.state.sort != 'win-desc') {
      const sorted = this.state.users.sort( (a, b) => {
        if (a.wins < b.wins) {
          return 1
        }
        if (a.wins > b.wins) {
          return -1
        }
        return 0
      })
      this.setState({
        users: sorted,
        sort: 'win-desc'
      })
    }
    else if (this.state.sort === 'win-desc') {
      const sorted = this.state.users.sort ( (a, b) => {
        if (a.wins < b.wins) {
          return -1
        }
        if (a.wins > b.wins) {
          return 1
        }
        return 0
      })
      this.setState({
        users: sorted,
        sort: 'win-asc'
      })
    }
  }

  handleLoseSort () {
    if (this.state.sort != 'lose-desc') {
      const sorted = this.state.users.sort( (a, b) => {
        if (a.losses < b.losses) {
          return 1
        }
        if (a.losses > b.losses) {
          return -1
        }
        return 0
      })
      this.setState({
        users: sorted,
        sort: 'lose-desc'
      })
    }
    else if (this.state.sort === 'lose-desc') {
      const sorted = this.state.users.sort( (a, b) => {
        if (a.losses < b.losses) {
          return -1
        }
        if (a.losses > b.losses) {
          return 1
        }
        return 0
      })
      this.setState({
        users: sorted,
        sort: 'lose-asc'
      })
    }
  }

  handleCompare () {
    const { checked } = this.state
    const ids = Object.keys(checked).filter((key, i) => {
      if (checked[key] === 1) {
        return 1
      }
      return 0
    })
    this.context.router.push(`/compare/${ids[0]}/${ids[1]}`)
  }
  render () {
    const { numberChecked } = this.state
      return (
        <div className='container'>
          <div>
            <h1 className='ea-font'>FIFA 17 RANKINGS</h1>
          </div>
          <div className='submit-container'>
            <a className='submit-result' href='./#/submit'>SUBMIT RESULT</a>
          </div>
          <div className='leaderboard'>
            <h2 className='ea-font rankings'>RANKINGS</h2><CompareButton onClick={this.handleCompare.bind(this)} numberChecked={numberChecked}/>
            <div className='leaderboard-header'>
              <div className='leaderboard-header-item checkbox'></div>
              <div className='leaderboard-header-item position'>Rank</div>
              <div className='leaderboard-header-item name' onClick={this.handleNameSort.bind(this)}><a href='javascript:void(0)'>Name</a></div>
              <div className='leaderboard-header-item wins' onClick={this.handleWinSort.bind(this)}><a href='javascript:void(0)'>Wins</a></div>
              <div className='leaderboard-header-item losses' onClick={this.handleLoseSort.bind(this)}><a href='javascript:void(0)'>Losses</a></div>
              <div className='leaderboard-header-item elo' onClick={this.handleEloSort.bind(this)}><a href='javascript:void(0)'>Elo</a></div>
              <div className='leaderboard-header-item one-week'></div>
            </div>
          </div>
          <div>{this.state.users ? this.getLeaderboardItems() : <div className='loader'></div>}</div>
        </div>
      )
    // }
  }
}

Leaderboard.contextTypes = {
   router: React.PropTypes.object.isRequired
 }
