import React, { Component } from 'react'
import { TransitionMotion, Motion, spring } from 'react-motion'

export default class CompareButton extends Component {
  willEnter () {
    return {width: 0, opacity: 0}
  }
  willLeave () {
    return {width: spring(0, springParams), opacity: spring(0, springParams)}
  }

  render () {
    const springParams = {stiffness: 200, damping: 20}
    return (
      <Motion style={ {width: spring(this.props.numberChecked === 2 ? 200 : 0, springParams), opacity: spring(this.props.numberChecked === 2 ? 1 : 0, springParams)} }>
        { ({width, opacity}) =>
            <span>
              <button className='compare-button' onClick={this.props.onClick} style={ {width, opacity} }>COMPARE</button>
            </span>
        }
      </Motion>
    )
  }
  // render () {
  //   return (
  //     <TransitionMotion
  //       willEnter={ this.willEnter }
  //       willLeave={ this.willLeave }
  //       styles={ [{key: '1', style: {width: spring(20)}}] }
  //     >
  //       {interpolatedStyles =>
  //         <span>
  //           {interpolatedStyles.map(({key, style}) => {
  //             return this.props.numberChecked === 2 && <button className='compare-button' onClick={this.props.onClick} key={key} style={ style }>COMPARE</button>
  //           })}
  //         </span>
  //       }
  //     </TransitionMotion>
  //   )
  // }
}
