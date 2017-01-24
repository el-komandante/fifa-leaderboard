/* jshint esversion: 6 */
/*jshint asi:true*/
import React, { Component } from 'react'
import { IndexLink, Link } from 'react-router'
import Loader from './Loader'
import * as services from '../api-services/apiService'
import * as d3 from 'd3'
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
  componentDidMount() {
    let data = []
    let parseTime = d3.timeParse('%m/%d/%Y')
    let formatTime = d3.timeFormat('%m/%d/%Y')

    data = data.map( d => { return {elo: +d.elo, date: new Date(d.date * 1000)} } )

    let margin = {top: 20, right: 20, bottom: 70, left: 50}
    let width = 400 - margin.left - margin.right
    let height = 300 - margin.top - margin.bottom

    let div = d3.select('.left-chart').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)

    let svg = d3.select('.left-chart').append('svg')
        .attr('viewBox', '0 0 400 300')
        .attr('preserveAspectRatio', 'xMidYMid meet')

    let g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    let x = d3.scaleTime()
            .rangeRound([0, width])

    let y = d3.scaleLinear()
            .rangeRound([height, 0])

    x.domain(d3.extent(data, d => d.date ))
    y.domain([0, (Math.floor(d3.max(data, d => d.elo ) / 100) * 100) + 100])

    let line = d3.line()
        .x( d => x(d.date) )
        .y( d => y(d.elo) )

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x).ticks(6).tickFormat(d3.timeFormat("%m/%d/%y")))
      .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)")


    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#333")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr('x', -90)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Elo")

    let path = g.append('path')
                 .datum(data)
                 .attr('class', 'line')
                 .attr('d', line)

    // let totalLength = path.node().getTotalLength()
    //
    // path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
    // 	.attr('stroke-dashoffset', totalLength)
    //   .transition()
    // 	.duration(1000)
    // 	.attr('stroke-dashoffset', 0)


    g.selectAll('dot')
      .data(data)
    .enter().append('circle')
      .attr('class', 'point')
      .attr('r', 2.5)
      .attr('cx', d => x(d.date) )
      .attr('cy', 0)
      .attr('fill-opacity', 1e-6)
      .on('mouseover', function(d) {
        d3.select(this).transition()
            .duration(120)
            .attr('r', 3)
        div.transition()
            .duration(100)
            .style('opacity', .8)
            .style('top', (d3.event.pageY - 50) + "px")
        div.html('&nbsp&nbsp' + formatTime(d.date) + ", "  + d.elo + '&nbsp&nbsp')
            .style('left', (d3.event.pageX - 70) + "px")
            .style('top', (d3.event.pageY - 31) + "px")
        })
      .on("mouseout", function(d) {
          d3.select(this).transition()
             .duration(200)
             .attr('r', 2.5)
          div.transition()
              .duration(300)
              .style("opacity", 0)
              .style('top', (parseFloat(div.style('top')) + 20) + 'px')
              // .style("top", (d3.event.pageY - 50) + "px")
      })
      .transition()
      .duration(700)
      .delay(400)
      // .delay( (d, i) => i * Math.random() *100 )
      .attr("cy", d => y(d.elo) )
      .style('fill-opacity', 1)
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
        <div className="compare-charts">
          <div className="left-chart"></div>
        </div>
        <div className='compare-header'>
          <div className='compare-header-item recent-game-result'>Winner</div>
          <div className='compare-header-item recent-game-vs'>Loser</div>
          <div className='compare-header-item recent-game-score'>Score</div>
          <div className='compare-header-item recent-game-date'>Date</div>
        </div>
        { this.getRows() }
      </div>
    )
  }
}
