import React, { useContext, useEffect, useState } from 'react'
import cs from 'classnames'
import { FormattedMessage, injectIntl } from 'react-intl'
import BigNumber from 'bignumber.js'
import { HANDLE_WALLET_MODAL } from '../../const'
import { mainContext } from '../../reducer'
import { formatAmount } from '../../utils/format'
import { useAPR, useMdxARP } from '../../pages/pools/Hooks'
import { useBalance } from '../../pages/Hooks'
import Timer from 'react-compound-timer'

const FarmCard = (props) => {
  const { dispatch, state } = useContext(mainContext)
  const { pools } = props
  const farmPools = pools
  const [hoverFlag, setHoverFlag] = useState(false)
  const { balance } = useBalance(farmPools && farmPools.MLP)
  const [balanceProportion, setBalanceProportion] = useState(0)
  const [now, setNow] = useState(parseInt(Date.now() / 1000))

  const apr = useAPR(
    farmPools.address,
    farmPools.abi,
    farmPools.MLP,
    farmPools.rewards1Address,
    farmPools.valueAprToken,
    farmPools.valueAprPath,
    farmPools.rewardsAprPath,
    farmPools.settleToken,
    farmPools.earnName === 'APY' ? 2 : 1
  )
  // const apr = 0
  const mdexApr = useMdxARP(
    farmPools.mdexReward ? farmPools.address : null,
    farmPools.abi,
    farmPools.MLP,
    farmPools.rewards1Address
  )
  const [aprPercentage, setPercentage] = useState('-')
  useEffect(() => {
    console.log('apr', apr)
    console.log('mdexApr', mdexApr)
    if (!isNaN(apr) && apr > 0 && (!farmPools.mdexReward || mdexApr > 0)) {
      setPercentage((apr * 100 + mdexApr * 100).toFixed(2))
    }
  }, [apr, mdexApr])

  useEffect(() => {
    const timerId = setTimeout(() => {
      const now = parseInt(Date.now() / 1000)
      setNow(now)
    }, 1000)
    return () => {
      clearTimeout(timerId)
    }
  }, [now])

  let left_time = 0
  if (farmPools && farmPools.openDate > now) {
    left_time = (farmPools && farmPools.openDate - now) * 1000
  } else if (farmPools && farmPools.dueDate > now) {
    left_time = (farmPools.dueDate - now) * 1000
  }

  useEffect(() => {
    if (farmPools && farmPools.balanceOf * 1 && farmPools.totalSupply) {
      setBalanceProportion(
        new BigNumber(farmPools.balanceOf)
          .dividedBy(new BigNumber(formatAmount(farmPools.totalSupply)))
          .multipliedBy(new BigNumber(100))
          .toNumber()
          .toFixed(2) * 1
      )
    } else {
      setBalanceProportion(0)
    }
  }, [farmPools, farmPools.balanceOf, farmPools.totalSupply])

  return (
    <div className={`farm_index_card ${farmPools.name}`}>
      <h3 className='farm_index_card_title'>{farmPools && farmPools.name}</h3>
      <div className='farm_index_card_content'>
        <p className='apr'>
          {aprPercentage}%
          <span className='content_name'>
            {farmPools && farmPools.earnName}
            {farmPools && farmPools.name === 'WAR' && (
              <span
                className='tips'
                onMouseOver={() => setHoverFlag(true)}
                onMouseOut={() => setHoverFlag(false)}
              >
                <svg
                  t='1622718431544'
                  className='icon'
                  viewBox='0 0 1024 1024'
                  version='1.1'
                  xmlns='http://www.w3.org/2000/svg'
                  p-id='1141'
                  width='16'
                  height='16'
                >
                  <path
                    d='M512 43.885714c258.121143 0 468.114286 209.993143 468.114286 468.114286 0 258.121143-209.993143 468.114286-468.114286 468.114286A468.626286 468.626286 0 0 1 43.885714 512C43.885714 253.878857 253.878857 43.885714 512 43.885714z m0 643.657143a58.514286 58.514286 0 1 0-0.073143 116.955429A58.514286 58.514286 0 0 0 512 687.542857zM512 219.428571c-96.768 0-175.542857 71.460571-175.542857 159.305143 0 25.161143 22.454857 45.494857 50.176 45.494857 27.721143 0 50.102857-20.333714 50.102857-45.494857 0-37.668571 33.792-68.315429 75.264-68.315428s75.264 30.72 75.264 68.315428c0 34.962286-29.110857 63.853714-66.56 67.803429L512 446.902857c-27.794286 0-50.176 20.333714-50.176 45.494857v91.062857c0 25.161143 22.454857 45.494857 50.176 45.494858 27.794286 0 50.176-20.333714 50.176-45.494858v-52.955428C634.368 510.829714 687.542857 450.633143 687.542857 378.733714 687.542857 290.889143 608.768 219.428571 512 219.428571z'
                    p-id='1142'
                  ></path>
                </svg>
                {hoverFlag && (
                  <i className='tips_content'>
                    <FormattedMessage id='farm23' />
                  </i>
                )}
              </span>
            )}
          </span>
        </p>

        {farmPools && farmPools.openDate && (
          <p className='countdown'>
            {farmPools && farmPools.openDate > now && (
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
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0 6px',
                      background: '#C5E5C9',
                      borderRadius: '3px',
                    }}
                  >
                    <Timer.Hours />
                    <b>
                      <FormattedMessage id='HourM' />
                    </b>
                  </span>{' '}
                  <i>/</i>{' '}
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0 6px',
                      background: '#C5E5C9',
                      borderRadius: '3px',
                    }}
                  >
                    {' '}
                    <Timer.Minutes />
                    <b>
                      <FormattedMessage id='MinM' />
                    </b>
                  </span>
                </span>
              </Timer>
            )}
            {farmPools && farmPools.dueDate > now && farmPools.openDate < now && (
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
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0 6px',
                      background: '#C5E5C9',
                      borderRadius: '3px',
                    }}
                  >
                    <Timer.Days />
                    <b>
                      <FormattedMessage id='DayM' />
                    </b>
                  </span>{' '}
                  <i>/</i>{' '}
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0 6px',
                      background: '#C5E5C9',
                      borderRadius: '3px',
                    }}
                  >
                    <Timer.Hours />
                    <b>
                      <FormattedMessage id='HourM' />
                    </b>
                  </span>
                </span>
              </Timer>
            )}
            {farmPools && farmPools.dueDate <= now && farmPools.openDate < now && (
              <span>
                <FormattedMessage id='completed' />
              </span>
            )}

            {/* {farmPools && typeof farmPools.openDate == 'object' ? (
              <span>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0 6px',
                    background: '#C5E5C9',
                    borderRadius: '3px',
                  }}
                >
                  {farmPools.openDate.hour}
                  <b>
                    <FormattedMessage id='HourM' />
                  </b>
                </span>{' '}
                <i>/</i>{' '}
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0 6px',
                    background: '#C5E5C9',
                    borderRadius: '3px',
                  }}
                >
                  {' '}
                  {farmPools.openDate.minute}
                  <b>
                    <FormattedMessage id='MinM' />
                  </b>
                </span>
              </span>
            ) : typeof farmPools.dueDate == 'object' ? (
              <span>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0 6px',
                    background: '#C5E5C9',
                    borderRadius: '3px',
                  }}
                >
                  {farmPools.dueDate.day}
                  <b>
                    <FormattedMessage id='DayM' />
                  </b>
                </span>{' '}
                <i style={{ color: '#7a7f82' }}>/</i>{' '}
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0 6px',
                    background: '#C5E5C9',
                    borderRadius: '3px',
                  }}
                >
                  {farmPools.dueDate.hour}
                  <b>
                    <FormattedMessage id='HourM' />
                  </b>
                </span>
              </span>
            ) : (
              <span>{farmPools.dueDate}</span>
            )} */}
            <span className='content_name'>
              <FormattedMessage id='farm8' />
            </span>
          </p>
        )}
        {farmPools && !farmPools.openDate && (
          <p className='countdown'>
            <span>
              {' '}
              <FormattedMessage id='farm14' />
            </span>
            <span className='content_name'>
              <FormattedMessage id='farm8' />
            </span>
          </p>
        )}
      </div>
      <p className='farm_index_card_value'>
        <FormattedMessage id='farm10' />
        {farmPools && farmPools.icon && (
          <img src={require('../../assets/icon/farm/' + farmPools.icon)} />
        )}
      </p>
      <p className='farm_index_card_value'>
        <FormattedMessage id='farm11' />
        <span>
          {farmPools && farmPools.totalSupply && farmPools.name !== 'WAR'
            ? formatAmount(farmPools.totalSupply)
            : farmPools && farmPools.totalSupply && farmPools.name === 'WAR'
            ? formatAmount(farmPools.totalSupply, farmPools.decimal, 6)
            : '--'}
        </span>
      </p>
      <p className='farm_index_card_value'>
        <FormattedMessage id='farm12' />
        <span>
          {farmPools && farmPools.balanceOf && farmPools.name !== 'WAR'
            ? farmPools.balanceOf +
              '(' +
              (balanceProportion - 0 === 0 ? '0.00' : balanceProportion) +
              '%)'
            : farmPools && farmPools.balanceOf && farmPools.name === 'WAR'
            ? formatAmount(farmPools.balanceOf, farmPools.decimal, 6) +
              '(' +
              (balanceProportion - 0 === 0 ? '0.00' : balanceProportion) +
              '%)'
            : '--'}
        </span>
      </p>
      <p className='farm_index_card_value'>
        <FormattedMessage id='farm4' />
        {/* 为了和 farmPools.balanceOf 展示同步 */}
        <span>
          {farmPools && farmPools.balanceOf ? formatAmount(balance) : '--'}
        </span>
      </p>
      {farmPools && farmPools.name !== 'WAR' && (
        <a
          className='farm_index_card_getMLP'
          href={farmPools.byLink}
          target='_black'
        >
          <FormattedMessage id='farm13' /> {farmPools && farmPools.name}(MDEX LP
          Token)
        </a>
      )}
      {farmPools && farmPools.name === 'WAR' && (
        <a
          className='farm_index_card_getMLP'
          onClick={() => {
            dispatch({
              type: HANDLE_WALLET_MODAL,
              walletModal: 'buyCoin',
            })
          }}
        >
          <FormattedMessage id='farm17' /> {farmPools.name}
        </a>
      )}
      <div className='farm_index_card_btn'>
        <a
          className='deposit_btn'
          onClick={() => {
            dispatch({
              type: HANDLE_WALLET_MODAL,
              walletModal: 'deposit',
              pool: farmPools && farmPools,
            })
          }}
        >
          <FormattedMessage id='farm3' />
        </a>
        {farmPools && farmPools.name !== 'WAR' && (
          <a
            className='claim_btn'
            onClick={() => {
              dispatch({
                type: HANDLE_WALLET_MODAL,
                walletModal: 'claim',
                pool: farmPools && farmPools,
              })
            }}
          >
            <FormattedMessage id='farm16' />
          </a>
        )}
        {farmPools && farmPools.name === 'WAR' && (
          <a
            className='claim_btn'
            onClick={() => {
              dispatch({
                type: HANDLE_WALLET_MODAL,
                walletModal: 'claim',
                pool: farmPools && farmPools,
              })
            }}
          >
            <FormattedMessage id='farm16' />
          </a>
        )}
      </div>
      <div className='farm_index_card_rewards'>
        <p className='form-app__inputbox-after-text farm_popup_avaliable'>
          <FormattedMessage
            id='farm6'
            values={{ coin: farmPools && farmPools.rewards1 }}
          />
          <span>
            {farmPools && farmPools.earned
              ? formatAmount(farmPools.earned)
              : '--'}
          </span>
        </p>
        {farmPools.rewards2 && (
          <p className='form-app__inputbox-after-text farm_popup_avaliable'>
            <FormattedMessage
              id='farm6'
              values={{ coin: farmPools && farmPools.rewards2 }}
            />
            <span>
              {farmPools && farmPools.earned2
                ? formatAmount(farmPools.earned2)
                : '--'}
            </span>
          </p>
        )}
      </div>
      {farmPools && farmPools.name === 'WAR' && (
        <a
          className='deposit_btn'
          style={{ marginTop: '8px', width: '100%' }}
          onClick={() => {
            dispatch({
              type: HANDLE_WALLET_MODAL,
              walletModal: 'compound',
              pool: farmPools && farmPools,
            })
          }}
        >
          <FormattedMessage id='farm21' />
        </a>
      )}
    </div>
  )
}

export default injectIntl(FarmCard)
