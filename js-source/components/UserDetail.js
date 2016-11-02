// /* jshint esversion: 6 */
import React from 'react';
import { IndexLink } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
// import { select, axis, scaleTime, timeParse, scaleLinear, extent, axisBottom, axisLeft } from 'd3';
// import line from 'd3-shape';
import * as d3 from 'd3';
// import * as interpolatePath from 'd3-interpolate-path';
import * as services from '../api-services/apiService';
import moment from 'moment';


export default class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      games: [],
    };

    services.getUser(+this.props.params.id)
    .then( user => this.setState({user}))

    services.getGames(+this.props.params.id)
    .then( games => this.setState({games}))
  }

  // getUser (id) {
  //   let user = this.props.route.data.filter( user => user.id === id )[0];
  //   this.setState({
  //     user: user
  //   });
  // }

  getGames () {
    let games = this.state.games.slice(0,4);
    games = games.map( (game, i) => {
      return (
        <div key={i.toString()} className='row'>
          <div className='recent-game-item recent-game-result'>
            {game.winner.id === this.state.user.id ? 'W': 'L'}
          </div>
          <div className='recent-game-item recent-game-vs'>
            {
              game.winner.id === this.state.user.id ? <a href={'./#/users/' + game.loser.id}>{game.loser.name}</a>
              :<a href={'./#/users/' + game.winner.id}>{game.winner.name}</a>
            }
          </div>
          <div className='recent-game-item recent-game-score'>
            {game.winner_goals + ' - ' + game.loser_goals}
          </div>
          <div className='recent-game-item recent-game-date'>
            {moment.unix(game.date).format('MM/DD/YYYY')}
          </div>
        </div>
      )
    })
    return games
  }


  updateGraph (data) {
    let margin = {top: 20, right: 20, bottom: 20, left: 50};
    let width = 400 - margin.left - margin.right;
    let height = 300 - margin.top - margin.bottom;

    let parseTime = d3.timeParse('%m/%d/%Y');
    let formatTime = d3.timeFormat('%m/%d/%Y');


    data = this.state.games.map( game => {
      return {
        elo: this.state.user.id === game.loser.id ? game.winner_score : game.loser_score,
        date: new Date(1000*game.date)
      };
    });

    let x = d3.scaleTime()
            .rangeRound([0, width])
            .domain(d3.extent(data, d => d.date ));
    let y = d3.scaleLinear()
            .rangeRound([height, 0])
            .domain([0, d3.max(data, d => d.elo )]);

    let newLine = d3.line()
        .x( d => x(d.date) )
        .y( d => y(d.elo) );

    let svg = d3.select('svg');
    let div = d3.select('.elo-chart div');
    let g = svg.select('g');
    let t = d3.transition().duration(700);

    let trans0 = svg.transition(t);
    trans0.selectAll('.axis--y').call(d3.axisLeft(y));
    trans0.selectAll('.axis--x').call(d3.axisBottom(x));

    let path0 = d3.select('.line')
    // console.log(path0);
    let totalLength0 = path0.node().getTotalLength();
    console.log(totalLength0)
    path0
    .attr('stroke-dasharray', totalLength0)
      .attr('stroke-dashoffset', 0)
      // .transition(t)
      // .duration(550)
      .attr('stroke-dashoffset', totalLength0)
      .remove();

    let path1 = g.append('path')
              .datum(data)
              .attr('class', 'line')
              .attr('d', newLine(data));

    let totalLength1 = path1.node().getTotalLength();

    path1.attr('stroke-dasharray', totalLength1 + ' ' + totalLength1)
      .attr('stroke-dashoffset', totalLength1)
      .transition(t)
      .attr('stroke-dashoffset', 0);



    d3.selectAll('.point')
        .transition(t)
        .delay( (d, i) => Math.random() * 70 )
        .attr('cy', '260')
        .style('fill-opacity', 1e-6)
        .remove()

    let dots = d3.select('g').selectAll('dot').data(data)
    dots.enter().append("circle")
        .attr('class', 'point')
        .attr("r", 3)
        .attr("cx", d => x(d.date) )
        .style('fill-opacity', 1e-6)
        .attr('cy', 0)
        .on("mouseover", function (d) {
          d3.select(this).transition()
              .duration(120)
              .attr('r', 4);
          div.transition()
             .duration(100)
             .style("opacity", .8)
             .style("top", (d3.event.pageY - 50) + "px");
          div.html('&nbsp;&nbsp;' + formatTime(d.date) + ", "  + d.elo + '&nbsp;&nbsp;')
             .style("left", (d3.event.pageX - 70) + "px")
             .style("top", (d3.event.pageY - 31) + "px");
        })
        .on("mouseout", function (d) {
          d3.select(this).transition()
              .duration(120)
              .attr('r', 3);
            div.transition()
                .duration(300)
                .style("opacity", 0)
                .style('top', (parseFloat(div.style('top')) + 20) + 'px')
        })
        .transition(t)
        .attr("cy", d => y(d.elo) )
        .style('fill-opacity', 1)
  }

  componentWillMount () {
    let id = parseInt(this.props.params.id);
    // this.getUser(id);
    // this.getGames(id);
  }

  componentDidMount () {
    let data = this.state.games.map( game => {
      return {
        elo: this.state.user.id === game.winner.id ? game.winner_score : game.loser_score,
        date: game.date
      };
    });

    let parseTime = d3.timeParse('%m/%d/%Y');
    let formatTime = d3.timeFormat('%m/%d/%Y');

    data = data.map( d => { return {elo: +d.elo, date: new Date(d.date * 1000)}; } );

    let margin = {top: 20, right: 20, bottom: 20, left: 50};
    let width = 400 - margin.left - margin.right;
    let height = 300 - margin.top - margin.bottom;

    let div = d3.select('.elo-chart').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    let svg = d3.select('.elo-chart').append('svg')
        .attr('viewBox', '0 0 400 300')
        .attr('preserveAspectRatio', 'xMidYMid meet');

    let g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    let x = d3.scaleTime()
            .rangeRound([0, width]);

    let y = d3.scaleLinear()
            .rangeRound([height, 0]);

    x.domain(d3.extent(data, d => d.date ));
    y.domain([0, d3.max(data, d => d.elo )]);

    let line = d3.line()
        .x( d => x(d.date) )
        .y( d => y(d.elo) );

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#333")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Elo");

    let path = g.append('path')
                 .datum(data)
                 .attr('class', 'line')
                 .attr('d', line);

    let totalLength = path.node().getTotalLength();

    path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
    	.attr('stroke-dashoffset', totalLength)
      .transition()
    	.duration(1000)
    	.attr('stroke-dashoffset', 0);


    g.selectAll('dot')
      .data(data)
    .enter().append('circle')
      .attr('class', 'point')
      .attr('r', 3)
      .attr('cx', d => x(d.date) )
      .attr('cy', 0)
      .attr('fill-opacity', 1e-6)
      .on('mouseover', function(d) {
        d3.select(this).transition()
            .duration(120)
            .attr('r', 4);
        div.transition()
            .duration(100)
            .style('opacity', .8)
            .style('top', (d3.event.pageY - 50) + "px");
        div.html('&nbsp;&nbsp;' + formatTime(d.date) + ", "  + d.elo + '&nbsp;&nbsp;')
            .style('left', (d3.event.pageX - 70) + "px")
            .style('top', (d3.event.pageY - 31) + "px");
        })
      .on("mouseout", function(d) {
          d3.select(this).transition()
             .duration(200)
             .attr('r', 3);
          div.transition()
              .duration(300)
              .style("opacity", 0)
              .style('top', (parseFloat(div.style('top')) + 20) + 'px')
              // .style("top", (d3.event.pageY - 50) + "px");
      })
      .transition()
      .duration(700)
      .delay(400)
      // .delay( (d, i) => i * Math.random() *100 )
      .attr("cy", d => y(d.elo) )
      .style('fill-opacity', 1);

  }

  componentWillReceiveProps (nextProps) {
    let id = parseInt(nextProps.params.id);
    services.getUser(id)
    .then( user => this.setState({user}))

    services.getGames(id)
    .then( games => this.setState({games}))

    // this.getUser(id);
    this.getGames();
  }

  componentDidUpdate () {

    this.updateGraph(this.state.games);

  }

  render () {
    let games = this.getGames();
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
          {games}
        </div>
      </div>
    );
  }
}
