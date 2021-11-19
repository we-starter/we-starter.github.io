import React, { useEffect } from 'react'
import cs from 'classnames'
import { FormattedMessage } from 'react-intl'
import Timer from 'react-compound-timer'

export default function ApplicationCountdown({ left_time, status, successStatus, title }) {
  return (
    <>
      {status !== 2 && (
        <p className='application_countdown'>
          <span className='countdown'>
            {title ? (
              title
            ) : status === 0 ? (
              <FormattedMessage id='farm8' />
            ) : (
              '进行中'
            )}
            :{' '}
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
                {left_time > 0 && (
                  <Timer.Consumer>
                    {({ h, d, formatValue }) => formatValue(d * 24 + h)}
                  </Timer.Consumer>
                )}
                {left_time <= 0 && '-'}
              </span>{' '}
              <i>:</i>{' '}
              <span className={cs(`countdown_time`)}>
                {' '}
                {left_time > 0 && <Timer.Minutes />}
                {left_time <= 0 && '-'}
              </span>{' '}
              <i>:</i>{' '}
              <span className={cs(`countdown_time`)}>
                {' '}
                {left_time > 0 && <Timer.Seconds />}
                {left_time <= 0 && '-'}
              </span>
            </span>
          </Timer>
        </p>
      )}
      {status === 2 && successStatus && (
        <p className='success'>
          {/* <FormattedMessage id='applicationText10' /> */}
          Success
        </p>
      )}
      {status === 2 && !successStatus && (
        <p className='success'>
          {/* <FormattedMessage id='applicationText10' /> */}
          Fail
        </p>
      )}
    </>
  )
}
