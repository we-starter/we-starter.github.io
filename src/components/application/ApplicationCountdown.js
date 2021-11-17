import React, { useEffect, useState } from 'react'
import cs from 'classnames'
import { FormattedMessage } from 'react-intl'
import Timer from 'react-compound-timer'

export default function ApplicationCountdown(props) {
  let left_time = props.time
  console.log(left_time, 'left_time')
  return (
    <>
      {left_time > 0 && (
        <p className='application_countdown'>
          <span className='countdown'>
            <FormattedMessage id='farm8' />:{' '}
          </span>
          <Timer
            initialTime={left_time}
            key={left_time}
            direction='backward'
            formatValue={(number) => {
              if (number === 0) return '00'
              if (number < 10) {
                return `0${number}`
              }
              return number
            }}
          >
            <span>
              <span className={cs(`countdown_time`)}>
                <Timer.Hours />
                {/* <b>
                <FormattedMessage id='HourM' />
              </b> */}
              </span>{' '}
              <i>:</i>{' '}
              <span className={cs(`countdown_time`)}>
                {' '}
                <Timer.Minutes />
                {/* <b>
                <FormattedMessage id='MinM' />
              </b> */}
              </span>{' '}
              <i>:</i>{' '}
              <span className={cs(`countdown_time`)}>
                {' '}
                <Timer.Seconds />
                {/* <b>
                <FormattedMessage id='SecondM' />
              </b> */}
              </span>
            </span>
          </Timer>
        </p>
      )}
      {left_time == 0 && (
        <p className='success'>
          <FormattedMessage id='applicationText10' />
        </p>
      )}
    </>
  )
}
