/* jshint esversion: 6 */
import React from 'react';
import { TransitionMotion, spring } from 'react-motion';


export default class App extends React.Component {
  render () {
    let path = this.props.location.pathname;
    let segment = path.split('/')[1] || 'root';
    // console.log(segment);
    return (
      <div className='app'>
        {this.props.children}
       </div>
    );
  }
}
