import React, { useEffect, useState } from 'react'
import cs from 'classnames'
import { withRouter } from 'react-router'
import HUSD from '../../assets/icon/HUSD@2x.png'
import DFT from '../../assets/icon/DFT@2x.png'
import DORA from '../../assets/icon/DoraFactory@2x.png'
import timePng from '../../assets/icon/time@2x.png'
import MATTER from '../../assets/icon/MATTER@2x.png'
import FIX from '../../assets/icon/FIX@2x.png'
import COOK from '../../assets/icon/COOK@2x.png'
import noDataPng from '../../assets/icon/noData@2x.png'
import HUOBI from '../../assets/icon/huobi.png'
import Metamask from '../../assets/icon/Metamask@2x.png'
import TokenPocket from '../../assets/icon/tokenPocket.png'
import AoLink from '../../assets/icon/aolink.png'
import BitKeep from '../../assets/icon/bitkeep.png'
import Bingoo from '../../assets/icon/bingoo.png'
import HyperPay from '../../assets/icon/HyperPay-Logo@2x.png'
import { usePoolsInfo } from './Hooks'
// 处理格式 千位符
import { formatNumber } from 'accounting'
// import pool from '../../configs/pools'
import { FormattedMessage } from 'react-intl'
import Web3 from 'web3'
import { formatAmount } from '../../utils/format'
import Timer from 'react-compound-timer'
import { useActiveWeb3React } from '../../web3'

const PoolsIndex = (props) => {
  const [listData, setListData] = useState([])
  const [tabFlag, setTabFlag] = useState(1)
  const [disableFlag, setDisableFlag] = useState(true)
  const [isLogin, setIsLogin] = useState(false)
  const [hoverFlag, setHoverFlag] = useState(false)
  const [poolSum, setPoolSum] = useState(0)

  // const getURLStuff = (stuff) => {
  //   let url = props.location.search
  //   let query = url.split('?').length > 1 ? url.split('?')[1] : ''
  //   let param = query === stuff
  //   return param && query
  // }

  // useEffect(() => {
  //   console.log(2222)
  //   let anchor = getURLStuff('position')
  //   if (!!anchor) {
  //     let anchorElement = document.getElementById(anchor)
  //     if (anchorElement) {
  //       window.scrollTop(anchorElement.offsetTop)
  //     }
  //   }
  // }, [props.location])

  const { account, active, library } = useActiveWeb3React()

  const pools = usePoolsInfo()
  pools.sort(function (x, y) {
    return y.start_at - x.start_at
  })

  const changeTab = (val) => {
    setTabFlag(val)
  }

  const setData = async () => {
    switch (tabFlag) {
      case 1:
        setListData(pools.filter((o) => o.is_top))
        break
      case 2:
        setListData(pools.filter((o) => o.is_join))
        break
      case 3:
        setListData(pools.filter((o) => o.is_flash))
        break
      default:
        setListData(pools.filter((o) => o.is_top))
    }
  }

  useEffect(() => {
    if (tabFlag !== 1) return
    setPoolSum(
      listData.filter((o) => {
        return o.is_top && (o.status === 0 || o.status === 1 || o.status === 2)
      }).length
    )
  }, [listData])

  useEffect(() => {
    setData()
    setIsLogin(active)
  }, [tabFlag, pools, active])

  const goFinance = (e, flag, url) => {
    e.stopPropagation()
    if (!flag) {
      return
    }
    window.open(url)
  }

  // 列表查看详情
  const goDetail = (e, flag, address) => {
    e.stopPropagation()
    if (flag) {
      return
    }
    props.history.push(`/pools/detail/${address}`)
  }

  const renderStatus = (status) => {
    switch (status) {
      case 0:
        return (
          <span className='pools-type_coming_status'>
            <FormattedMessage id='willStart' />
          </span>
        )
      case 1:
        return (
          <span className='pools-type_progress_status'>
            <FormattedMessage id='recruit' />
          </span>
        )
      case 2:
        return (
          <span className='pools-type_progress_status'>
            <FormattedMessage id='settlement' />
          </span>
        )
      case 3:
        return (
          <span className='pools-type_over_status'>
            <FormattedMessage id='completed' />
          </span>
        )
    }
  }

  const renderCard = (pool, index) => {
    const {
      address,
      name,
      ratio,
      progress,
      status,
      totalPurchasedAmount,
      currency,
      start_at, // 开始时间
      time, // 结算时间
      icon,
      type,
      quotaOf,
    } = pool
    let left_time = 0
    if (status === 0) {
      left_time = start_at * 1000 - Date.now()
    } else if (status === 1) {
      left_time = time * 1000 - Date.now()
    }

    return (
      <div
        className={cs(
          'pools-type_card_box',
          ((pool && pool.underlying.symbol === 'FIX') || type === 1) &&
            'pools-type_private',
          pool && pool.is_coming && 'pools-type_hover_style',
          tabFlag === 3 && 'pools-type_flashPool'
        )}
        onClick={(e) =>
          goFinance(e, pool && pool.is_coming, pool && pool.link_url)
        }
        key={pool.address}
      >
        <div className='pools-type_title'>
          <p className='pools-type_card_title'>
            {pool && pool.underlying.symbol === 'MATTER' && (
              <img src={MATTER} />
            )}
            {pool && pool.underlying.symbol === 'DFT' && <img src={DFT} />}
            {pool && pool.underlying.symbol === 'FIX' && <img src={FIX} />}
            {pool && pool.underlying.symbol === 'DORA' && <img src={DORA} />}
            {pool && pool.underlying.symbol === 'COOK' && <img src={COOK} />}
            {pool && pool.underlying.name}
          </p>
          <p className='pools-type_card_title_right'>
            {renderStatus(status)}
            {status < 3 && (
              <span className='pools-type_time'>
                <Timer
                  initialTime={left_time}
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
                    <Timer.Consumer>
                      {({ h, d, formatValue }) => formatValue(d * 24 + h)}
                    </Timer.Consumer>
                  </span>
                  &nbsp;:&nbsp;
                  <span>
                    <Timer.Minutes />
                  </span>
                  &nbsp;:&nbsp;
                  <span>
                    <Timer.Seconds />
                  </span>
                </Timer>
              </span>
            )}
          </p>
        </div>
        <div className='pools-type_title'>
          <p className='pools-type_card_ratio'>
            <FormattedMessage id='poolsIndexText1' />
            <i>{ratio}</i>
          </p>
          <p className='pools-type_card_ratio' style={{ textAlign: 'right' }}>
            <FormattedMessage id='totalRaised' />
            <i>
              {formatNumber(
                formatAmount(totalPurchasedAmount, pool.currency.decimal, 2)
              )}{' '}
              {currency.symbol}
            </i>
          </p>
        </div>
        <div className='pools-type_title'>
          <p className='pools-type_card_ratio' style={{ marginTop: '24px' }}>
            <FormattedMessage id='poolsIndexText2' />
          </p>
        </div>
        <div className='pools-type_percentage'>
          <a>
            <i
              className='pools-type_progress_bar'
              style={{
                width: `${pool.progress > 1 ? 100 : pool.progress * 100}%`,
              }}
            ></i>
          </a>
          <p>{progress * 100}%</p>
        </div>
        <div className='pools-type_title'>
          <p
            className='pools-type_card_ratio pools-type_card_access'
            style={{
              color: '#7A7F82',
            }}
          >
            <FormattedMessage id='accessType' />
          </p>
          {type === 1 && (
            <p
              className='pools-type_card_ratio pools-type_card_access'
              style={{ textAlign: 'right' }}
            >
              <span
                className={cs('crown', quotaOf > 0 && 'crown-highlight')}
              ></span>
              <FormattedMessage id='private' />
              <span
                className='tips'
                onMouseOver={() => setHoverFlag(index)}
                onMouseOut={() => setHoverFlag(null)}
              >
                {hoverFlag === index && (
                  <i className='tips_content'>
                    <FormattedMessage id='privateTips' />
                  </i>
                )}
              </span>
            </p>
          )}
          {type !== 1 && (
            <p
              className='pools-type_card_ratio pools-type_card_access'
              style={{ textAlign: 'right' }}
            >
              <FormattedMessage id='public' />
              <span
                className='tips'
                onMouseOver={() => setHoverFlag(index)}
                onMouseOut={() => setHoverFlag(null)}
              >
                {hoverFlag === index && (
                  <i className='tips_content'>
                    <FormattedMessage id='publicTips' />
                  </i>
                )}
              </span>
            </p>
          )}
        </div>
        <a
          className={cs(
            'pools-type_enter',
            pool && pool.is_coming && 'pools-type_disable_enter'
          )}
          onClick={(e) => {
            goDetail(e, pool && pool.is_coming, address)
          }}
        >
          <FormattedMessage id='poolsIndexText3' />
        </a>
      </div>
    )
  }
  const noData = () => {
    return (
      <div className='pools-type_noData'>
        <img src={noDataPng} />
        <p>
          {(tabFlag === 1 || pools.is_flash) && (
            <FormattedMessage id='noData' />
          )}
          {tabFlag === 2 && <FormattedMessage id='noJoinPool' />}
        </p>
      </div>
    )
  }
  const noLogin = (index) => {
    return (
      <div className='pools-type_card_box' key={`nologin${index}`}>
        <h1 className='pools-type_big_title'>
          <FormattedMessage id='comingSoon' />
        </h1>
        <div className='pools-type_title'>
          <p className='pools-type_card_ratio' style={{ marginTop: '24px' }}>
            <FormattedMessage id='poolsIndexText2' />
          </p>
        </div>
        <div className='pools-type_percentage'>
          <a>
            <i
              className='pools-type_progress_bar'
              style={{
                width: `0%`,
              }}
            ></i>
          </a>
          <p>0%</p>
        </div>
        <div className='pools-type_title'>
          <p
            className='pools-type_card_ratio pools-type_card_access'
            style={{
              color: '#7A7F82',
            }}
          ></p>
          <p
            className='pools-type_card_ratio pools-type_card_access'
            style={{ textAlign: 'right' }}
          >
            <span></span>
          </p>
        </div>
        <a
          className={cs(
            'pools-type_enter',
            disableFlag && 'pools-type_disable_enter'
          )}
          style={{
            marginTop: '40px',
          }}
          onClick={() => {
            // goDetail()
          }}
        >
          <FormattedMessage id='poolsIndexText3' />
        </a>
      </div>
    )
  }

  return (
    <div className='pools-type' id='position'>
      <div className='pools-type-top'>
        <div className='pools-type_content'>
          <div className='pools-type_tab'>
            <h2
              onClick={() => changeTab(1)}
              className={cs('new_flag', tabFlag === 1 ? 'tab_active' : '')}
            >
              <FormattedMessage id='poolsIndexText4' />
              {
                poolSum > 0 && <span className='pools_sum'>{poolSum}</span>
              }
            </h2>

            <h2
              onClick={() => changeTab(3)}
              className={cs(tabFlag === 3 ? 'tab_active' : '')}
            >
              <img className='flashPool_png' src={timePng} />
              <FormattedMessage id='flashPool' />
            </h2>
            <h2
              onClick={() => changeTab(2)}
              className={tabFlag === 2 ? 'tab_active' : ''}
            >
              <FormattedMessage id='myJoinPool' />
            </h2>
          </div>
          <div className='pools-type_card'>
            {/* {isLogin ? (
              <>
                {listData &&
                  listData.map((pool, index) => {
                    return renderCard(pool, index)
                  })}
                {tabFlag === 1 && [1, 2].map(noLogin)}
                {tabFlag === 2 && !listData.length && noData()}
              </>
            ) : (
              <>
                {!isLogin && tabFlag === 1 ? [1, 2, 3].map(noLogin) : noData()}
              </>
            )} */}
            {listData &&
              listData.map((pool, index) => {
                return renderCard(pool, index)
              })}
            {tabFlag === 1 && [1, 2].map(noLogin)}
            {[1, 2].includes(tabFlag) && !listData.length && noData()}
          </div>
        </div>
      </div>
      <div className='pools-type-bottom'>
        <h2>
          <FormattedMessage id='supportWallet' />
        </h2>
        <div className='pools-type-bottom_content'>
          <div className='pools-type-bottom_content_box'>
            <img src={HyperPay} />
            <img src={Metamask} />
            <img src={AoLink} />
          </div>
          <div className='pools-type-bottom_content_box'>
            <img src={HUOBI} />
            <img src={TokenPocket} />
            <img src={BitKeep} />
          </div>
          <div
            className='pools-type-bottom_content_box'
            style={{ justifyContent: 'center' }}
          >
            <img src={Bingoo} />
          </div>
        </div>
      </div>
    </div>
  )
}
export default withRouter(PoolsIndex)
