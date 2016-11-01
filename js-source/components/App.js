/* jshint esversion: 6 */
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class App extends React.Component {
  render () {
    let path = this.props.location.pathname;
    let segment = path.split('/')[1] || 'root';
    return (
      <div className='app'>
        <ReactCSSTransitionGroup
          component={'div'}
          transitionName='pageSlide'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
          transitionAppear={true}
          transitionAppearTimeout={200}>
          {React.cloneElement(this.props.children, {key: segment})}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
