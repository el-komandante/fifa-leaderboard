import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

export default class App extends Component {
  render () {
    let path = this.props.location.pathname
    let segment = path.split('/')[1] || 'root'
    return (
      <div className='app'>
        {this.props.children}
       </div>
    )
  }
}
