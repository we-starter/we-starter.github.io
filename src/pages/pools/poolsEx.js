import React, { useContext, useEffect, useState } from 'react'
import cs from 'classnames'
import BigNumber from 'bignumber.js'
import { withRouter } from 'react-router'
import { changeNetwork } from '../../connectors'
import { ChainId } from '../../web3/address'
import { message, Popover } from 'antd'
import noDataPng from '../../assets/icon/noData@2x.png'
import WARLBP from '../../assets/image/W@2x.png'
import BLACKLBP from '../../assets/image/B@2x.png'
import PAULLBP from '../../assets/image/PaulLbp.png'

import HyperPay from '../../assets/icon/HyperPay-Logo@2x.png'
import { usePoolsInfo, usePoolsLBPInfo } from './Hooks'
// 处理格式 千位符
import { formatNumber } from 'accounting'
// import pool from '../../configs/pools'
import { FormattedMessage } from 'react-intl'
import Web3 from 'web3'
import { formatAmount } from '../../utils/format'
import Timer from 'react-compound-timer'
import { useActiveWeb3React } from '../../web3'
import Banner from '../../components/banner/Banner'

export function NftCardTipContent({ nft }) {
  if (!nft) {
    return null
  }
  return (
    <div className="nft-card-tip-content">
      <img src={nft.icon} alt="" />
      <div>
        <h2>Only for {nft.name}</h2>
        <p>Claim from <a href={nft.claimUrl} target="_blank">{nft.claimUrl.split('//')[1]}</a></p>
        <p>NFT Offering by {nft.claimUrlName}</p>
      </div>
    </div>
  )
}

const PoolsIndex = (props) => {
  const [listData, setListData] = useState([])
  const [tabFlag, setTabFlag] = useState(1)
  const [disableFlag, setDisableFlag] = useState(true)
  const [isLogin, setIsLogin] = useState(false)
  const [hoverFlag, setHoverFlag] = useState(false)
  const [poolSum, setPoolSum] = useState(0)
  const { account, active, library, chainId } = useActiveWeb3React()
  const pools = usePoolsInfo()
  const poolsLBP = usePoolsLBPInfo()

  const _poolsIDO = JSON.parse(JSON.stringify(pools))
  const _poolsLBP = JSON.parse(JSON.stringify(poolsLBP))

  const _pools = [..._poolsIDO, ..._poolsLBP]
  // poolsLBP.map((item) => {
  //   let count = []
  //   count = pools.filter((filterItem) => {
  //     return filterItem.address === item.address
  //   })
  //   if (count.length > 0) return
  //   pools.push(item && item)
  // })

  const [now, setNow] = useState(parseInt(Date.now() / 1000))

  useEffect(() => {
    const timerId = setTimeout(() => {
      const now = parseInt(Date.now() / 1000)
      setNow(now)
    }, 1000)
    return () => {
      clearTimeout(timerId)
    }
  }, [now])

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
  _pools.sort(function (x, y) {
    if (x.status < 3 && y.status < 3) {
      // return x.start_at - y.start_at
      return y.start_at - x.start_at
    } else {
      return y.start_at - x.start_at
    }
  })

  const changeTab = (val) => {
    setTabFlag(val)
  }

  const setData = async () => {
    switch (tabFlag) {
      case 1:
        setListData(_pools.filter((o) => o.is_top))
        break
      case 2:
        setListData(
          _pools.filter(
            (o) =>
              o.is_join ||
              (window.localStorage.is_join && o.underlying.name === 'LBP')
          )
        )
        break
      case 3:
        setListData(_pools.filter((o) => o.is_flash))
        break
      default:
        setListData(_pools.filter((o) => o.is_top))
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
  }, [tabFlag, pools, active, poolsLBP])

  const goFinance = (e, flag, url) => {
    e.stopPropagation()
    if (!flag) {
      return
    }
    if (url) {
      window.open(url)
    }
  }

  useEffect(() => {
    console.log(hoverFlag, 'hoverFlag')
  }, [hoverFlag])

  // 列表查看详情
  const goDetail = (e, flag, address, symbol) => {
    e.stopPropagation()
    if (flag) {
      return
    }
    if (symbol == 'LBP') {
      props.history.push(`/pools/detailLBP/${address}`)
    } else {
      props.history.push(`/pools/detail/${address}`)
    }
  }

  const renderStatus = (pool) => {
    const { status, timeClose = 0 } = pool
    switch (status) {
      case 0:
        return (
          <span className='pools-example_coming_status'>
            <FormattedMessage id='willStart' />
          </span>
        )
      case 1:
        if (timeClose - 0 === 0 || timeClose > now) {
          return (
            <span className='pools-example_progress_status'>
              <FormattedMessage id='recruit' />
            </span>
          )
        } else {
          return (
            <span className='pools-example_progress_status'>
              <FormattedMessage id='recruitOver' />
            </span>
          )
        }

      case 2:
        return (
          <span className='pools-example_progress_status'>
            <FormattedMessage id='settlement' />
          </span>
        )
      case 3:
        return (
          <span className='pools-example_over_status'>
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
      timeClose, // 募资结束时间
      icon,
      type,
      quotaOf,
    } = pool
    let left_time = 0
    if (status === 0) {
      left_time = start_at * 1000 - Date.now()
    } else if (status === 1) {
      if (type === 0) {
        if (now >= timeClose) {
          // 等待中
          left_time = (time - now) * 1000
        } else {
          // 募资中
          left_time = (timeClose - now) * 1000
        }
      } else {
        left_time = (time - now) * 1000
      }
    }

    return (
      <div
        className={cs(
          'pools-example_card_box',
          ((pool && pool.underlying.symbol === 'FIX') || type === 1) &&
          'pools-example_private',
          pool && pool.is_coming && ('pools-type_hover_style_' + pool.networkId),
          tabFlag === 3 && 'pools-type_flashPool'
        )}
        onClick={(e) =>
          goFinance(e, pool && pool.is_coming, pool && pool.link_url)
        }
        key={pool.address + '' + index}
      >
        <div className='pools-example_card_box_t'>
          <div className='pools-type_title'>
            <p className='pools-type_card_title'>
              {pool && pool.svipFlag && <span className='svip'></span>}
              {pool && pool.underlying.name === 'LBP' && (
                <a className='pools-type_card_warning'>
                  <span
                    className='warning_tips'
                    onMouseOver={() => setHoverFlag(index + 'LBP')}
                    onMouseOut={() => setHoverFlag(null)}
                  >
                    {hoverFlag == index + 'LBP' && (
                      <i className='warning_tips_content'>
                        <FormattedMessage id='publicTips2' />
                      </i>
                    )}
                  </span>
                </a>
              )}
            </p>

          </div>

        </div>
        <div className='pools-example_card_box_b'>
          {pool && pool.icon && <div className='pools-example_card_box_b_logo'><img src={pool.icon} /></div>}
          {pool && <h3 className='pools-example_card_box_b_name'>{pool.name} POOL</h3>}
          <p className='pools-example_card_box_b_time'>
            {renderStatus(pool)}
            {(
              <span className='pools-type_time'>
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
          <p className='pools-example_card_box_b_text'>
            <FormattedMessage id='poolsIndexText1' />
            <i>{ratio}</i>
          </p>
          {pool && pool.underlying.name === 'LBP' && (
            <p
              className='pools-example_card_box_b_text'
            >
              <FormattedMessage id='LBPSupply' />
              <i>
                {formatNumber(
                  formatAmount(totalPurchasedAmount, 0, 2)
                )}{' '}
                {pool.underlying.symbol}
              </i>
            </p>
          )}
          {pool && pool.underlying.name !== 'LBP' && (
            <p
              className='pools-example_card_box_b_text'
            >
              <FormattedMessage id='totalRaised' />
              <i>
                {formatNumber(
                  formatAmount(totalPurchasedAmount, 0, 2)
                )}{' '}
                {currency.symbol}
              </i>
            </p>
          )}
          <p
            className='pools-example_card_box_b_text'
          >
            <FormattedMessage id='poolsIndexText2' />
            <i> {(progress * 100).toFixed(0)}%</i>
          </p>
          <a
            onClick={(e) => {
              console.log(pool)
              goDetail(
                e,
                pool &&
                (pool.is_coming ||
                  (status === 3 &&
                    ((pool.type === 0 &&
                      pool.settleable &&
                      pool.settleable.amount == 0 &&
                      pool.settleable.volume == 0) ||
                      (pool.settleable &&
                        pool.type === 1 &&
                        pool.settleable.claimedOf * 1 !== 0) ||
                      (pool.settleable && pool.settleable.volume == 0))) ||
                  (!active && status === 3) ||
                  (status === 3 && pool.underlying.name === 'LBP')),
                address,
                pool && pool.underlying.name
              )
            }}
            className='pools-example_card_box_b_enter'
          >
            Enter Pool
          </a>
        </div>
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
              className={cs(
                `pools-type_progress_bar`
              )}
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
    <div>
      {/* banner图 */}
      <Banner />
      <div className='pools-example' id='position'>
        <div className='pools-example_title'>
          <h3>Project</h3>
          <a href='/pool'>View All</a>
        </div>
        <div className='pools-example_card'>
          {listData &&
            listData.slice(0, 3).map((pool, index) => {
              return renderCard(pool, index)
            })}
          {tabFlag === 1 && listData.length < 3 && [1, 2, 3].map(noLogin)}
          {[2].includes(tabFlag) && !listData.length && noData()}
        </div>
      </div>
    </div>
  )
}
export default withRouter(PoolsIndex)
