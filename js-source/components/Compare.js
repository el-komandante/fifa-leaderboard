/* jshint esversion: 6 */
/*jshint asi:true*/
import React, { Component } from 'react'
import * as services from '../api-services/apiService'
import moment from 'moment'
import { StaggeredMotion, spring } from 'react-motion'

export default class Compare extends Component {

}

(leftUser, rightUser) => {
  return (
    <div className="compare-container" style={ {display: 'flex'} }>
      <div className="left-user-name">leftUser.name</div>
    </div>
  )
}
