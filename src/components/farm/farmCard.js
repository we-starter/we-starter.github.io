import React, {useContext, useEffect, useMemo, useState} from 'react'
import cs from 'classnames'
import { FormattedMessage, injectIntl } from 'react-intl'
import BigNumber from 'bignumber.js'
import { useActiveWeb3React } from '../../web3'
import { HANDLE_WALLET_MODAL } from '../../const'
import { mainContext } from '../../reducer'
import { changeNetwork } from '../../connectors'
import { message } from 'antd'
import { formatAmount, splitFormat } from '../../utils/format'
import {useAPR, useFarmInfo, useMdxARP} from '../../pages/pools/Hooks'
import { useBalance } from '../../pages/Hooks'
import Timer from 'react-compound-timer'
import Countdown from './countdown'
// 处理格式 千位符
import { formatNumber } from 'accounting'
import { ChainId } from '../../web3/address'

const FarmCard = (props) => {
  let { pools:farmPools, dispatch} = props
  const [hoverFlag, setHoverFlag] = useState(false)
  farmPools = useFarmInfo(farmPools.address)
  const { balance } = useBalance(farmPools && farmPools.MLP, props.pools.networkId)
  console.log('balance', balance)
  const { chainId } = useActiveWeb3React()
  const [balanceProportion, setBalanceProportion] = useState(0)
  // const [now, setNow] = useState(parseInt(Date.now() / 1000))
  const apr = useAPR(
    farmPools.address,
    farmPools.abi,
    farmPools.MLP,
    farmPools.rewards1Address,
    farmPools.valueAprToken,
    farmPools.valueAprPath,
    farmPools.rewardsAprPath,
    farmPools.settleToken,
    farmPools.earnName === 'APY' ? 2 : 1,
    farmPools.networkId
  )

  const mdexApr = useMdxARP(
    farmPools.mdexReward ? farmPools.address : null,
    farmPools.abi,
    farmPools.MLP,
    farmPools.rewards1Address,
    farmPools.networkId
  )


  const [aprPercentage, setPercentage] = useState('-')
  useMemo(() => {
    if (!isNaN(apr) && apr > 0 && (!farmPools.mdexReward || mdexApr > 0)) {
      setPercentage((apr * 100 + mdexApr * 100).toFixed(2))
    }
  }, [apr, mdexApr])

  // useMemo(() => {
  //   const timerId = setTimeout(() => {
  //     const now = parseInt(Date.now() / 1000)
  //     setNow(now)
  //   }, 1000)
  //   return () => {
  //     clearTimeout(timerId)
  //   }
  // }, [now])
  //
  // let left_time = 0
  // if (farmPools && farmPools.openDate > now) {
  //   left_time = (farmPools && farmPools.openDate - now) * 1000
  // } else if (farmPools && farmPools.dueDate > now) {
  //   left_time = (farmPools.dueDate - now) * 1000
  // }
  useMemo(() => {
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
  console.log('farmPools', farmPools)
  return (
    <div
      className={`farm_index_card ${farmPools.name} ${
        farmPools && 'farm_index_card_' + farmPools.networkId
      }`}
    >
      <div className='farm_index_card_chainId_content'>
        <a className={cs('farm_index_card_chainId_box')}>
          <span className={cs('farm_index_card_chainId')}></span>
        </a>
      </div>
      <h3
        className={cs(
          `farm_index_card_title ${
            farmPools && 'farm_index_card_title_' + farmPools.networkId
          }`
        )}
      >
        {farmPools && farmPools.name}
      </h3>
      <Countdown
        farmPools={farmPools}
        aprPercentage={aprPercentage}
        hoverFlag={hoverFlag}
        setHoverFlag={setHoverFlag}
      />
      <p className='farm_index_card_value'>
        <FormattedMessage id='farm10' />
        {farmPools && farmPools.icon && (
          <img src={require('../../assets/icon/farm/' + farmPools.icon)} />
        )}
      </p>
      <p className='farm_index_card_value'>
        <FormattedMessage id='farm11' />
        <span>
          {farmPools &&
          farmPools.totalSupply &&
          farmPools.name !== 'WAR POOL (DAO)'
            ? formatNumber(
                formatAmount(farmPools.totalSupply, farmPools.decimal, 6),
                {
                  thousand: ',',
                  decimal: '.',
                  precision:
                    formatAmount(farmPools.totalSupply) - 0 > 0 ? 6 : 0,
                }
              )
            : farmPools &&
              farmPools.totalSupply &&
              farmPools.name === 'WAR POOL (DAO)'
            ? formatNumber(
                formatAmount(farmPools.totalSupply, farmPools.decimal, 4),
                {
                  thousand: ',',
                  decimal: '.',
                  precision:
                    formatAmount(farmPools.totalSupply) - 0 > 0 ? 4 : 0,
                }
              )
            : '--'}
        </span>
      </p>
      <p className='farm_index_card_value'>
        <FormattedMessage id='farm12' />
        <span>
          {farmPools &&
          farmPools.balanceOf &&
          farmPools.name !== 'WAR POOL (DAO)'
            ? formatNumber(splitFormat(farmPools.balanceOf, 6), {
                thousand: ',',
                decimal: '.',
                precision: farmPools.balanceOf - 0 > 0 ? 6 : 0,
              }) +
              '(' +
              (balanceProportion - 0 === 0 ? '0.00' : balanceProportion) +
              '%)'
            : farmPools &&
              farmPools.balanceOf &&
              farmPools.name === 'WAR POOL (DAO)'
            ? formatNumber(splitFormat(farmPools.balanceOf, 4), {
                thousand: ',',
                decimal: '.',
                precision: farmPools.balanceOf - 0 > 0 ? 4 : 0,
              }) +
              '(' +
              (balanceProportion - 0 === 0 ? '0.00' : balanceProportion) +
              '%)'
            : '--'}
        </span>
      </p>
      <p className='farm_index_card_value'>
        <FormattedMessage id='farm4' />
        {/* 为了和 farmPools.balanceOf 展示同步 formatNumber */}
        <span>
          {farmPools &&
          farmPools.balanceOf &&
          farmPools.name !== 'WAR POOL (DAO)'
            ? formatNumber(formatAmount(balance, farmPools.decimal, 6), {
                thousand: ',',
                decimal: '.',
                precision: formatAmount(balance) - 0 > 0 ? 6 : 0,
              })
            : farmPools &&
              farmPools.balanceOf &&
              farmPools.name === 'WAR POOL (DAO)'
            ? formatNumber(formatAmount(balance, farmPools.decimal, 4), {
                thousand: ',',
                decimal: '.',
                precision: formatAmount(balance) - 0 > 0 ? 4 : 0,
              })
            : '--'}
        </span>
      </p>
      {farmPools && farmPools.name !== 'WAR POOL (DAO)' && (
        <a
          className={cs(
            `farm_index_card_getMLP ${
              farmPools && 'farm_index_card_getMLP_' + farmPools.networkId
            }`
          )}
          href={farmPools.byLink}
          target='_black'
        >
          <FormattedMessage id='farm13' /> {farmPools && farmPools.name}(
          {farmPools && farmPools.lpToken})
        </a>
      )}
      {farmPools && farmPools.name === 'WAR POOL (DAO)' && (
        <a
          className={cs(
            `farm_index_card_getMLP ${
              farmPools && 'farm_index_card_getMLP_' + farmPools.networkId
            }`
          )}
          onClick={() => {
            dispatch({
              type: HANDLE_WALLET_MODAL,
              walletModal: 'buyCoin',
            })
          }}
        >
          <FormattedMessage id='farm17' /> {farmPools.rewards}
        </a>
      )}
      {farmPools && farmPools.networkId == chainId && (
        <div className='farm_index_card_btn'>
          <a
            className={cs(
              `deposit_btn ${farmPools && 'deposit_btn_' + farmPools.networkId}`
            )}
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
          {farmPools && farmPools.name !== 'WAR POOL (DAO)' && (
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
          {farmPools && farmPools.name === 'WAR POOL (DAO)' && (
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
      )}
      {farmPools && farmPools.networkId !== chainId && (
        <div className='farm_index_card_btn'>
          <a
            className={cs(
              `deposit_btn ${farmPools && 'deposit_btn_' + farmPools.networkId}`
            )}
            style={{ width: '100%' }}
            onClick={() => {
              changeNetwork(farmPools.networkId).then(() => {
                message.success('Switch success')
              })
            }}
          >
            {farmPools.networkId == ChainId.HECO && (
              <FormattedMessage id='poolTextS128' />
            )}
            {farmPools.networkId == ChainId.BSC && (
              <FormattedMessage id='poolTextS56' />
            )}
            {farmPools.networkId == ChainId.MATIC && (
              <FormattedMessage id='poolTextS137' />
            )}
          </a>
        </div>
      )}
      <div
        className={cs(
          `farm_index_card_rewards ${
            farmPools && 'farm_index_card_rewards_' + farmPools.networkId
          }`
        )}
      >
        <p className='form-app__inputbox-after-text farm_popup_avaliable'>
          <FormattedMessage
            id='farm6'
            values={{ coin: farmPools && farmPools.rewards1 }}
          />
          <span>
            {farmPools &&
            farmPools.earned &&
            farmPools.name !== 'WAR POOL (DAO)'
              ? formatNumber(
                  formatAmount(farmPools.earned, farmPools.decimal, 6),
                  {
                    thousand: ',',
                    decimal: '.',
                    precision: formatAmount(farmPools.earned) - 0 > 0 ? 6 : 0,
                  }
                )
              : farmPools &&
                farmPools.earned &&
                farmPools.name === 'WAR POOL (DAO)'
              ? formatNumber(
                  formatAmount(farmPools.earned, farmPools.decimal, 4),
                  {
                    thousand: ',',
                    decimal: '.',
                    precision: formatAmount(farmPools.earned) - 0 > 0 ? 4 : 0,
                  }
                )
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
                ? formatNumber(
                    formatAmount(farmPools.earned2, farmPools.decimal, 6),
                    formatAmount(farmPools.earned2) - 0 > 0 ? 6 : 0
                  )
                : '--'}
            </span>
          </p>
        )}
      </div>
      {farmPools &&
        farmPools.name === 'WAR POOL (DAO)' &&
        farmPools.networkId == chainId && (
          <a
            className={cs(
              `deposit_btn ${farmPools && 'deposit_btn_' + farmPools.networkId}`
            )}
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

export default injectIntl((props) => {
  const { dispatch, state } = useContext(mainContext)
  return useMemo(() => <FarmCard {...props} dispatch={dispatch}/>, [props])
})
