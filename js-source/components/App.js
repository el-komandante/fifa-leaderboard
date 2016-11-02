/* jshint esversion: 6 */
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class App extends React.Component {
  render () {
    let path = this.props.location.pathname;
    let segment = path.split('/')[1] || 'root';
    console.log(segment);
    return (
      <div className='app'>
          <ReactCSSTransitionGroup
            className='transitionGroup'
            component={'div'}
            transitionName={
              (segment === 'submit' || segment === 'users') ? 'pageSlide': 'reversePageSlide'
            }
            transitionEnterTimeout={300}
            transitionLeaveTimeout={200}>
            {React.cloneElement(this.props.children, {key: segment})}
          </ReactCSSTransitionGroup>
      </div>
    );
  }
}
