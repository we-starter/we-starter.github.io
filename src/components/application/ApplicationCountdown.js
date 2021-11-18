import React, { useEffect, useState, useMemo } from 'react'
import cs from 'classnames'
import { FormattedMessage } from 'react-intl'
import Timer from 'react-compound-timer'
import { getContract, useActiveWeb3React } from '../../web3'
import { voteMain } from '../../web3/address'
import BigNumber from 'bignumber.js'

export default function ApplicationCountdown(props) {
  const { account, active, library, chainId } = useActiveWeb3React()
  const { time } = props
  const [voteCycle, setVoteCycle] = useState('')

  const getVoteSpan = () => {
    if (!active) {
      return false
    }
    const pool_contract = getContract(library, voteMain.abi, voteMain.address)
    pool_contract.methods
      .voteSpan()
      .call()
      .then((res) => {
        setVoteCycle(res)
      })
      .catch((err) => {
        console.log('error', err)
      })
  }

  useMemo(() => {
    getVoteSpan()
  }, [])
  // 0 countdown  1 voting  2 end
  let status = 0
  // let left_time = props.time 1637220763
  let left_time = 0
  let begin_time = time * 1000
  let span_time = voteCycle * 1000
  let now_time = Date.now()
  if (begin_time - now_time > 0) {
    // start
    left_time = begin_time - Date.now()
  } else if (now_time < begin_time + span_time) {
    // voteing
    left_time = new BigNumber(begin_time)
      .plus(span_time)
      .minus(now_time)
      .toString()
    status = 1
  } else {
    left_time = 0
    status = 2
  }

  return (
    <>
      {status !== 2 && (
        <p className='application_countdown'>
          <span className='countdown'>
            {status === 0 ? <FormattedMessage id='farm8' /> : '进行中'}:{' '}
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
      {status === 2 && (
        <p className='success'>
          {/* <FormattedMessage id='applicationText10' /> */}
          已结束
        </p>
      )}
    </>
  )
}
