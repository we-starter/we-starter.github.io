import React, {useContext, useEffect, useMemo, useState} from 'react'
import cs from 'classnames'
import {FormattedMessage, injectIntl} from 'react-intl'
import BigNumber from 'bignumber.js'
import {useActiveWeb3React} from '../../web3'
import {HANDLE_WALLET_MODAL, NOT_ACCESS_MODAL} from '../../const'
import {mainContext} from '../../reducer'
import {changeNetwork} from '../../connectors'
import {Button, message, Popover} from 'antd'
import {formatAmount, splitFormat} from '../../utils/format'
import {useAllow, useAPR, useFarmInfo, useMdxARP} from '../../pages/pools/Hooks'
import {useBalance} from '../../pages/Hooks'
import Timer from 'react-compound-timer'
import Countdown from './countdown'
// 处理格式 千位符
import {formatNumber} from 'accounting'
import {ChainId} from '../../web3/address'
import AllowPublicIcon from '../../assets/icon/home_N01_night@2x.png'
import AllowPrivateIcon from '../../assets/icon/home_N02_night@2x.png'
import Tips from '../../assets/icon/06 icon／minor／info@2x.png'
import {NftCardTipContent} from "../../pages/pools/poolsIndex";

import TipIcon from '../../assets/icon/06 icon／minor／info@2x.png'
const FarmCard = (props) => {
  let {pools: farmPools, dispatch} = props
  const [hoverFlag, setHoverFlag] = useState(false)
  farmPools = useFarmInfo(farmPools.address)
  const {balance} = useBalance(
    farmPools && farmPools.MLP,
    props.pools.networkId
  )
  const {chainId} = useActiveWeb3React()
  const [balanceProportion, setBalanceProportion] = useState(0)
  // const [now, setNow] = useState(parseInt(Date.now() / 1000))
  // 白名单 allow=0为不在白名单
  const allow = useAllow(farmPools)
  const notAllow = farmPools.accessType === 'private' && !allow


  // const mdexApr = useMdxARP(
  //   farmPools.mdexReward ? farmPools.address : null,
  //   farmPools.abi,
  //   farmPools.MLP,
  //   farmPools.networkId,
  //   farmPools.mdexDaily,
  //   farmPools.mdexPid,
  //   farmPools
  // )
  const [now, setNow] = useState(parseInt(Date.now() / 1000))
  const isFinish =
    farmPools &&
    farmPools.dueDate &&
    farmPools.dueDate <= now &&
    farmPools.openDate < now
  useEffect(() => {
    let timerId = null
    const fn = () => {
      timerId = setTimeout(() => {
        const now = parseInt(Date.now() / 1000)
        setNow(now)
        if (isFinish) {
          clearTimeout(timerId)
        } else {
          fn()
        }
      }, 1000)
    }
    fn()
    return () => {
      clearTimeout(timerId)
    }
  }, [isFinish])

  // const [aprPercentage, setPercentage] = useState('-')
  // useMemo(() => {
  //   if (!isNaN(apr) && apr > 0 && (!farmPools.mdexReward || mdexApr > 0)) {
  //     let apr_ = (apr * 100 + mdexApr * 100).toFixed(2)
  //     if (isFinite(apr_)){
  //       setPercentage(apr_)
  //     }
  //   }
  // }, [apr, mdexApr])

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

  // const apr = useAPR(
  //   farmPools.address,
  //   farmPools.abi,
  //   farmPools.MLP,
  //   farmPools.rewards1Address,
  //   farmPools.valueAprToken,
  //   farmPools.valueAprPath,
  //   farmPools.rewardsAprPath,
  //   farmPools.settleToken,
  //   farmPools.earnName === 'APY' ? 2 : 1,
  //   farmPools.networkId,
  //   farmPools
  // )

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
  }, [farmPools])

  const notStart = !farmPools || farmPools.start_at * 1000 > new Date().getTime()
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
        {farmPools && (farmPools.title || farmPools.name)}
        {farmPools && farmPools.svipFlag && <span className='svip'></span>}
      </h3>
      <Countdown
        farmPools={farmPools}
        aprPercentage={farmPools && farmPools.APR || '-'}
        hoverFlag={hoverFlag}
        setHoverFlag={setHoverFlag}
        now={now}
        isFinish={isFinish}
      />
      <p className='farm_index_card_value'>
        <FormattedMessage id='farm10'/>
        {farmPools && farmPools.icon && (
          <img src={require('../../assets/icon/farm/' + farmPools.icon)}/>
        )}
      </p>
      <p className='farm_index_card_value'>
        <FormattedMessage id='farm11'/>
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
        <FormattedMessage id='farm12'/>
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
        <FormattedMessage id='farm4'/>
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
      {farmPools && farmPools.byLink && (
        <a
          className={cs(
            `farm_index_card_getMLP ${
              farmPools && 'farm_index_card_getMLP_' + farmPools.networkId
            }`
          )}
          href={farmPools.byLink}
          target='_black'
        >
          {farmPools && farmPools.buyName}
        </a>
      )}
      {farmPools && farmPools.byModal && farmPools.networkId === chainId && (
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
          {farmPools.buyName}
        </a>
      )}
      {farmPools && farmPools.networkId == chainId && (
        <div className='farm_index_card_btn'>
          {/*<FormattedMessage id="cannotProject"/>*/}
          <Button
            disabled={notStart || isFinish}
            className={cs(
              `deposit_btn ${
                farmPools && 'deposit_btn_' + farmPools.networkId
              } ${notStart || isFinish ? 'disabled' : ''}`
            )}
            onClick={() => {
              if (notAllow) {
                dispatch({
                  type: NOT_ACCESS_MODAL,
                  notAccessModal: true,
                })
                return
              }
              dispatch({
                type: HANDLE_WALLET_MODAL,
                walletModal: 'deposit',
                pool: farmPools && farmPools,
              })
            }}
          >
            <FormattedMessage id='farm3'/>
          </Button>
          {farmPools && (
            <Button
              className={'claim_btn' + (notStart ? ' disabled' : '')}
              disabled={notStart}
              onClick={() => {
                if (notAllow) {
                  dispatch({
                    type: NOT_ACCESS_MODAL,
                    notAccessModal: true,
                  })
                  return
                }
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: 'claim',
                  pool: farmPools && {
                    ...farmPools,
                    isFinish: isFinish,
                  },
                })
              }}
            >
              <FormattedMessage id='farm16'/>
            </Button>
          )}
        </div>
      )}
      {farmPools && farmPools.networkId !== chainId && (
        <div className='farm_index_card_btn'>
          <Button
            className={cs(
              `deposit_btn ${farmPools && 'deposit_btn_' + farmPools.networkId}`
            )}
            style={{width: '100%'}}
            onClick={() => {
              changeNetwork(farmPools.networkId).then(() => {
                if (window.onto){
                  message.warning('Please switch manually in the ONTO wallet')
                } else {
                  message.success('Switch success')
                }
              })
            }}
            disabled={!window.ethereum}
          >
            {farmPools.networkId == ChainId.HECO && (
              <FormattedMessage id='poolTextS128'/>
            )}
            {farmPools.networkId == ChainId.BSC && (
              <FormattedMessage id='poolTextS56'/>
            )}
            {farmPools.networkId == ChainId.MATIC && (
              <FormattedMessage id='poolTextS137'/>
            )}
          </Button>
        </div>
      )}
      <div
        className={cs(
          `farm_index_card_rewards ${
            farmPools && 'farm_index_card_rewards_' + farmPools.networkId
          }`
        )}
      >
        {
          // WAR-USDT LPT special
          !(farmPools && farmPools.address === '0x777d69a99fE220471f23e2643007f9d086B7d714' && Number(farmPools.earned) === 0 || !farmPools.earned) &&
          <p className='form-app__inputbox-after-text farm_popup_avaliable'>
            <FormattedMessage
              id='farm6'
              values={{coin: farmPools && farmPools.rewards1}}
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
        }
        {farmPools.rewards2 && (
          <p className='form-app__inputbox-after-text farm_popup_avaliable'>
            <FormattedMessage
              id='farm6'
              values={{coin: farmPools && farmPools.rewards2}}
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

      {farmPools && farmPools.svipFlag && (
        <p className='vip_tip'>
          <FormattedMessage id='farm24'/>
        </p>
      )}

      {farmPools &&
      farmPools.name === 'WAR POOL (DAO)' &&
      farmPools.networkId == chainId && (
        <a
          className={cs(
            `deposit_btn ${farmPools && 'deposit_btn_' + farmPools.networkId}`
          )}
          style={{marginTop: '8px', width: '100%'}}
          onClick={() => {
            dispatch({
              type: HANDLE_WALLET_MODAL,
              walletModal: 'compound',
              pool: farmPools && farmPools,
            })
          }}
        >
          <FormattedMessage id='farm21'/>
        </a>
      )}
      {farmPools.accessType === 'private' && (
        <div className='farm_pools_card_access'>
          <div className='farm_pools_card_access_title'>
            <FormattedMessage id='accessType'/>
          </div>
          <div className='farm_pools_card_access_content'>
            <span className='tips'>
              <img src={Tips} alt=''/>
              <i className='tips_content'>
                <FormattedMessage id='privateTips'/>
              </i>
            </span>
            <span className='access-type-text'>
              <FormattedMessage id='private'/>
            </span>
            <img src={notAllow ? AllowPrivateIcon : AllowPublicIcon} alt=''/>
          </div>
        </div>
      )}
      {farmPools.accessType === 'public' && (
        <div className='farm_pools_card_access'>
          <div className='farm_pools_card_access_title'>
            <FormattedMessage id='accessType'/>
          </div>
          <div className='farm_pools_card_access_content'>
            <span className='tips'>
              <img src={Tips} alt=''/>
              <i className='tips_content'>
                <FormattedMessage id='publicTips'/>
              </i>
            </span>
            <span className='access-type-text'>
              <FormattedMessage id='public'/>
            </span>
            <img src={AllowPublicIcon} alt=''/>
          </div>
        </div>
      )}
      {
        farmPools.awardNft && (
          <div className="farm_pools_card_award-nft">
            <div>
              <img className="nft-img" src={farmPools.awardNft.icon} alt=""/>
              {farmPools.awardNft.name}
              <Popover content={() => <NftCardTipContent nft={farmPools.awardNft}/>} title={null}>
                <img src={TipIcon} className="tips-icon" alt=""/>
              </Popover>
            </div>
            <p className="desc">{farmPools.awardNft.desc}</p>
          </div>
        )
      }
    </div>
  )
}

export default injectIntl((props) => {
  const {dispatch, state} = useContext(mainContext)
  return useMemo(() => <FarmCard {...props} dispatch={dispatch}/>, [dispatch, props])
})
