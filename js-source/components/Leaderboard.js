/* jshint esversion: 6 */
import React from 'react'
import * as services from '../api-services/apiService'
import { Link } from 'react-router'
import { StaggeredMotion, spring } from 'react-motion'



export default class Leaderboard extends React.Component {
  constructor() {
    super()
    this.state = {
      users: null,
      sort: 'elo-desc',
      checked: {'0': 0}
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
            console.log(user.games)
            //winner_score and loser_score are reversed
            user.oldScore = user.id === user.games[1].winner.id ? games[1].loser_score: games[1].winner_score
            user.newScore = user.score
            users[i] = user
            console.log(user)
          })
          this.setState({users})
      }})

  }
  handleChange (e) {
    let index = +e.target.value
    let { checked } = this.state
    if (this.state.checked[index] === 1) {
      checked[index] = 0
      this.setState({
        checked: checked
      });
    } else {
      checked[index] = 1
      this.setState({
        checked: checked
      })
    }
  }
  handleClick (e) {
    const index = e.target.value
    const { checked } = this.state
    const numberChecked = Object.values(checked).reduce((a, b) => {
      return a + b
    })
    if (numberChecked >= 2 && !this.isChecked(index)) {
      e.preventDefault()
      e.stopPropagation()
      return false
    }
    if (this.state.checked[index] === 1) {
      checked[index] = 0
      this.setState({
        checked: checked
      });
    } else {
      checked[index] = 1
      this.setState({
        checked: checked
      })
    }
  }
  isChecked (index) {
    return this.state.checked[index] === 1
  }
  getInitialStyles (i) {
    if (i === 0) {

    }
  }
  getLeaderboardItems () {
    const { users } = this.state
    const startOpacity = 0
    const startY = 80
    const startX = 0
    const width = 100
    const height = 32
    const defaultStyles = users.map( () => { return {o: startOpacity, y: startY, x: startX, width: width, height: height, marginLeft: startX}})
    const springParams = {stiffness: 220, damping: 24}
    const heightSpringParams = {stiffness: 200, damping: 20}
    const widthSpringParams = {stiffness: 300, damping: 20}
    return (
      <StaggeredMotion
        defaultStyles={defaultStyles}
        styles={prevInterpolatedStyles => prevInterpolatedStyles.map((_, i) => {
          const isChecked = this.isChecked(i)
          return i === 0
            ? {
                o: spring(1, springParams),
                y: spring(0, springParams),
                marginLeft: (isChecked ? spring(-3.5, widthSpringParams) : spring(startX, widthSpringParams)),
                width: (isChecked ? spring(width + 7, widthSpringParams) : spring(width, widthSpringParams)),
                height: (isChecked ? spring(50, heightSpringParams) : spring(32, heightSpringParams))
              }
            : {
                o: spring(prevInterpolatedStyles[i - 1].o),
                y: spring(prevInterpolatedStyles[i - 1].y, springParams),
                marginLeft: (isChecked ? spring(-3.5, widthSpringParams) : spring(startX, widthSpringParams)),
                width: (isChecked ? spring(width + 7, widthSpringParams) : spring(width, widthSpringParams)),
                height: (isChecked ? spring(50, heightSpringParams) : spring(32, heightSpringParams))
              }
      })}>
      {interpolatingStyles =>
        <div>
          {interpolatingStyles.map((style, i) => {
            const isChecked = this.isChecked(i)
            return (
              <div key={i} className={isChecked ? 'row checked' : 'row'} style={{opacity: style.o, transform: `translate(0%, ${style.y}px)`, width: `${style.width}%`, height: style.height, marginLeft: `${style.marginLeft}%`}}>
                <div className={'leaderboard-item checkbox'}><input type='checkbox' value={i} onClick={this.handleClick.bind(this)} /></div>
                <div className='leaderboard-item position'>{users[i].rank}</div>
                <div className='leaderboard-item name'><a className='name' href={`./#/users/${users[i].id}`}>{users[i].name}</a></div>
                <div className='leaderboard-item wins'><span>{users[i].wins}</span></div>
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

  render () {
    if (this.state.users) {
      const leaderboardItems = this.getLeaderboardItems()
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
              <div className='leaderboard-header-item checkbox'></div>
              <div className='leaderboard-header-item position'></div>
              <div className='leaderboard-header-item name' onClick={this.handleNameSort.bind(this)}><a href='javascript:void(0)'>Name</a></div>
              <div className='leaderboard-header-item wins' onClick={this.handleWinSort.bind(this)}><a href='javascript:void(0)'>Wins</a></div>
              <div className='leaderboard-header-item losses' onClick={this.handleLoseSort.bind(this)}><a href='javascript:void(0)'>Losses</a></div>
              <div className='leaderboard-header-item elo' onClick={this.handleEloSort.bind(this)}><a href='javascript:void(0)'>Elo</a></div>
              <div className='leaderboard-header-item one-week'></div>
            </div>
          </div>
          <div>{leaderboardItems}</div>
        </div>
      )
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
        <div className="loader"></div>
      </div>
    )
    // const users = this.state.users
    // const startOpacity = 0
    // const defaultStyles = users.map( () => { return {o: startOpacity} })
    // let rows = this.getLeaderboardItems()
    // console.log(defaultStyles)
  }
}
