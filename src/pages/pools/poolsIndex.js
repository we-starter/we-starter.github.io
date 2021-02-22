import React, { useEffect, useState } from 'react'
import cs from 'classnames'
import { withRouter } from 'react-router'
import HUSD from '../../assets/icon/HUSD@2x.png'
import noDataPng from '../../assets/icon/noData@2x.png'
import { usePoolsInfo } from './Hooks'
import { FormattedMessage } from 'react-intl'
import Web3 from 'web3'
import { formatAmount } from '../../utils/format'
import Timer from 'react-compound-timer'
import {useActiveWeb3React} from "../../web3";

const PoolsIndex = (props) => {
  const [listData, setListData] = useState([])
  const [tabFlag, setTabFlag] = useState(1)
  const [disableFlag, setDisableFlag] = useState(true)
  const [isLogin, setIsLogin] = useState(false)
  const changeTab = (val) => {
    setTabFlag(val)
  }

  const {account, active, library} = useActiveWeb3React()

  const pools = usePoolsInfo()
  console.log(pools, 'pools')
  const setData = async () => {
    switch (tabFlag) {
      case 1:
        setListData(pools.filter((o) => o.is_top))
        break
      case 2:
        setListData(pools.filter((o) => o.is_join))
        break
      default:
        setListData(pools.filter((o) => o.is_top))
    }
  }

  useEffect(() => {
    setData()
    setIsLogin(active)
  }, [tabFlag, pools, active])

  // 列表查看详情
  const goDetail = (address) => {
    props.history.push(`/pools/detail/${address}`)
  }

  const renderStatus = (status) => {
    switch (status) {
      case 0:
        return (
          <span className='pools-type_coming_status'>
            <FormattedMessage id='comingSoon' />
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

  const renderCard = (pool) => {
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
    } = pool

    let left_time = 0
    if (status === 0) {
      left_time = start_at * 1000 - Date.now()
    } else if (status === 1) {
      left_time = time * 1000 - Date.now()
    }

    return (
      <div className='pools-type_card_box' key={pool.address}>
        <div className='pools-type_title'>
          <p className='pools-type_card_title'>
            <img src={HUSD} />
            {name}
          </p>
          <p className='pools-type_card_title_right'>
            {renderStatus(status)}
            {status < 2 && (
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
              {formatAmount(totalPurchasedAmount)} {currency.symbol}
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
        <a
          className='pools-type_enter'
          onClick={() => {
            goDetail(address)
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
          {tabFlag === 1 && <FormattedMessage id='noData' />}
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
    <div className='pools-type'>
      <div className='pools-type-top'>
        <div className='pools-type_content'>
          <div className='pools-type_tab'>
            <h2
              onClick={() => changeTab(1)}
              className={tabFlag === 1 ? 'tab_active' : ''}
            >
              <FormattedMessage id='poolsIndexText4' />
            </h2>
            <h2
              onClick={() => changeTab(2)}
              className={tabFlag === 2 ? 'tab_active' : ''}
            >
              <FormattedMessage id='myJoinPool' />
            </h2>
          </div>
          <div className='pools-type_card'>
            {
              isLogin ? (
                  <>
                    {listData &&
                    listData.map((pool) => {
                      return renderCard(pool)
                    })}
                    {tabFlag === 2 && !listData.length && noData()}
                  </>
              ):
              (
                  <>
                    {!isLogin && [1,2,3].map(noLogin)}
                  </>
              )
            }
          </div>
        </div>
      </div>
      {/* <div className='pools-type-bottom'>
        <h2>
          <FormattedMessage id='partner' />
        </h2>
      </div> */}
    </div>
  )
}
export default withRouter(PoolsIndex)
