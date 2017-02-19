import React from 'react'
import { IndexLink } from 'react-router'
import * as d3 from 'd3'
import * as services from '../api-services/apiService'
import moment from 'moment'
import { Motion, spring } from 'react-motion'

export default class UserDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      games: null,
    }

    const id = +this.props.params.id
    services.getUser(id)
    .then( user => {
      services.getGames(id)
      .then( games => this.setState({user, games}))
    })

  }

  getGames () {
    const user = this.state.user
    let games = this.state.games.length >= 5 ? this.state.games.reverse().slice(0,5): this.state.games.reverse().slice(0, this.state.games.length)
    // console.log(games)
    if (games) {
      games = games.map((game) => {
        if (game.winner_goals === game.loser_goals) {
          game.result = 'D'
        } else if (game.winner_id === user.id) {
          game.result = 'W'
        } else {
          game.result = 'L'
        }
        return game
      })
    }
    const startOpacity = 0
    const endO = 1
    const startY = 70
    const endY = 0

    return (
      <Motion
        defaultStyle={ {y: startY, o: startOpacity} }
        style={ {y: spring(endY), o: spring(endO)} }>
        { style =>
          <div style={ {transform: `translate3d(0, ${style.y}px, 0)`, opacity: style.o} }>
            {games.map((game) =>
              <div key={game.date} className='row'>
                <div className='recent-game-item recent-game-result'>
                  { game.result }
                </div>
                <div className='recent-game-item recent-game-vs'>
                  {
                    game.winner.id === user.id ? <a href={`./#/users/${game.loser.id}`}>{game.loser.name}</a>
                  :<a href={`./#/users/${game.winner.id}`}>{game.winner.name}</a>
                  }
                </div>
                <div className='recent-game-item recent-game-score'>
                  {`${game.winner_goals} - ${game.loser_goals}`}
                </div>
                <div className='recent-game-item recent-game-date'>
                  {moment.unix(game.date).format('MM/DD/YYYY')}
                </div>
              </div>
            )}
          </div>
        }
      </Motion>
    )
  }
  timeBetween (start, end) {
    const day = 1000 * 60 * 60 * 24
    const m1 = start.getTime()
    const m2 = end.getTime()
    const diff = m1 - m2

    return Math.round(diff / day)
  }
  updateGraph () {
      const margin = {top: 20, right: 20, bottom: 70, left: 50}
      const width = 400 - margin.left - margin.right
      const height = 300 - margin.top - margin.bottom

      // const formatTime = d3.timeFormat('%m/%d/%Y')


      const data = this.state.games.map( game => {
        return {
          elo: this.state.user.id === game.loser.id ? game.winner_score : game.loser_score,
          date: new Date(1000 * game.date)
        }
      })
      const daysBetween = this.timeBetween(data[0].date, data[data.length - 1].date)
      const formatTime = daysBetween > 5 ? d3.timeFormat('%b %d %-I%p') : d3.timeFormat("%m/%d/%y")

      let x = d3.scaleTime()
              .rangeRound([0, width])
              .domain(d3.extent(data, d => d.date ))
      let y = d3.scaleLinear()
              .rangeRound([height, 0])
              .domain([0, (Math.floor(d3.max(data, d => d.elo ) / 100) * 100) + 100])

      let newLine = d3.line()
          .x( d => x(d.date) )
          .y( d => y(d.elo) )

      let svg = d3.select('svg')
      let div = d3.select('.elo-chart div')
      let g = svg.select('g')

      const t = d3.transition().duration(500)
      const lineT = d3.transition().duration(500)
      const trans0 = svg.transition(t)

      trans0.selectAll('.axis--y').call(d3.axisLeft(y))
      trans0.selectAll('.axis--x').call(d3.axisBottom(x).ticks(6).tickFormat(formatTime))
      .selectAll('text')
          .style('text-anchor', 'end')
          .attr('dx', '-.8em')
          .attr('dy', '.15em')
          .attr('font-size', '10')
          .attr('transform', 'rotate(-65)')

      let path0 = d3.select('.line')
      let totalLength0 = path0.node().getTotalLength()

      path0.attr('stroke-dasharray', totalLength0)
        .attr('stroke-dashoffset', 0)
        .transition()
        .duration(200)
        .attr('stroke-dashoffset', -totalLength0)
        .remove()

      let path1 = g.append('path')
                .datum(data)
                .attr('class', 'line')
                .attr('d', newLine(data))

      let totalLength1 = path1.node().getTotalLength()

      path1.attr('stroke-dasharray', totalLength1 + ' ' + totalLength1)
        .attr('stroke-dashoffset', -totalLength1)
        .transition(lineT)
        .attr('stroke-dashoffset', 0)
        .attr('stroke-antialiasing', 'true')



      d3.selectAll('.point')
          .transition(t)
          .delay( (d, i) => Math.random() * 70 )
          .attr('cy', '260')
          .style('fill-opacity', 1e-6)
          .remove()

      let dots = d3.select('g').selectAll('dot').data(data)
      dots.enter().append("circle")
          .attr('class', 'point')
          .attr('r', 2.5)
          .attr('cx', d => x(d.date) )
          .style('fill-opacity', 1e-6)
          .attr('cy', 0)
          .on('mouseover', function (d) {
            d3.select(this).transition()
                .duration(120)
                .attr('r', 3)
            div.transition()
               .duration(100)
               .style("opacity", .8)
               .style("top", (d3.event.pageY - 50) + "px")
            div.html('&nbsp&nbsp' + formatTime(d.date) + ", "  + d.elo + '&nbsp&nbsp')
               .style("left", (d3.event.pageX - 70) + "px")
               .style("top", (d3.event.pageY - 31) + "px")
          })
          .on("mouseout", function (d) {
            d3.select(this).transition()
                .duration(120)
                .attr('r', 2.5)
              div.transition()
                  .duration(300)
                  .style("opacity", 0)
                  .style('top', (parseFloat(div.style('top')) + 20) + 'px')
          })
          .transition(t)
          .attr("cy", d => y(d.elo) )
          .style('fill-opacity', 1)
    }



    componentDidMount () {
        // data = this.state.games.map( game => {
        //   return {
        //     elo: this.state.user.id === game.winner.id ? game.winner_score : game.loser_score,
        //     date: game.date
        //   }
        // })
        let data = []
        let formatTime = d3.timeFormat('%m/%d/%Y')

        data = data.map( d => { return {elo: +d.elo, date: new Date(d.date * 1000)} } )

        let margin = {top: 20, right: 20, bottom: 70, left: 50}
        let width = 400 - margin.left - margin.right
        let height = 300 - margin.top - margin.bottom

        let div = d3.select('.elo-chart').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)

        let svg = d3.select('.elo-chart').append('svg')
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
  componentWillReceiveProps (nextProps) {
    let id = parseInt(nextProps.params.id, 10)
    services.getUser(id)
    .then( user => {
      services.getGames(id)
      .then( games => {
        this.setState({user, games})
      })
    })
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextState !== this.state
  }

  componentDidUpdate () {
      this.updateGraph()
  }

  render () {
    if (this.state.games && this.state.user) {
      let games = this.getGames()
      return (
        <div className='container'>
          <div className='detail-name'>
            <h1 className='ea-font'>
              {this.state.user.name}
            </h1>
          </div>
          <div className='back'>
            <h2>
              <IndexLink to="/">
                <i className="fa fa-arrow-left back" aria-hidden="true"></i>
              </IndexLink>
            </h2>
          </div>
          <div className='elo-chart'></div>
          <h2>Recent</h2>
          <div className='recent-game-header'>
            <div className='recent-game-header-item recent-game-result'>Result</div>
            <div className='recent-game-header-item recent-game-vs'>VS</div>
            <div className='recent-game-header-item recent-game-score'>Score</div>
            <div className='recent-game-header-item recent-game-date'>Date</div>
          </div>
          <div className='recent-games'>
            { games }
          </div>
        </div>
      )
    }
    return (
      <div className='container'>
        <div className='detail-name'>
          <h1 className='ea-font'>
          </h1>
        </div>
        <div className='back'>
          <h2>
            <IndexLink to="/">
              <i className="fa fa-arrow-left back" aria-hidden="true"></i>
            </IndexLink>
          </h2>
        </div>
        <div className='elo-chart'></div>
        <h2>Recent</h2>
        <div className='recent-game-header'>
          <div className='recent-game-header-item recent-game-result'>Result</div>
          <div className='recent-game-header-item recent-game-vs'>VS</div>
          <div className='recent-game-header-item recent-game-score'>Score</div>
          <div className='recent-game-header-item recent-game-date'>Date</div>
        </div>
        <div className='recent-games'>
          <div className="loader"></div>
        </div>
      </div>
    )
  }
}
