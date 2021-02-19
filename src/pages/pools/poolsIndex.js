import React, { useEffect, useState } from 'react'
import cs from 'classnames'
import { withRouter } from 'react-router'
import HUSD from '../../assets/icon/HUSD@2x.png'
import noDataPng from '../../assets/icon/noData@2x.png'
import { usePoolsInfo } from './Hooks'
import { FormattedMessage } from 'react-intl'
import Web3 from 'web3'
import { formatAmount } from '../../utils/format'

const PoolsIndex = (props) => {
  const [listData, setListData] = useState([])
  const [tabFlag, setTabFlag] = useState(1)
  const changeTab = (val) => {
    setTabFlag(val)
  }

  const pools = usePoolsInfo()
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
  }, [tabFlag, pools])

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
    } = pool
    return (
      <div className='pools-type_card_box' key={pool.address}>
        <div className='pools-type_title'>
          <p className='pools-type_card_title'>
            <img src={HUSD} />
            {name}
          </p>
          {renderStatus(status)}
        </div>
        <div className='pools-type_title'>
          <p className='pools-type_card_ratio'>
            Ratio
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
            Progress
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
          Enter Pool
        </a>
      </div>
    )
  }
  const noData = () => {
    return (
      <div className='pools-type_noData'>
        <img src={noDataPng} />
        <p>
          <FormattedMessage id='noData' />
        </p>
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
              Top Pools
            </h2>
            <h2
              onClick={() => changeTab(2)}
              className={tabFlag === 2 ? 'tab_active' : ''}
            >
              <FormattedMessage id='myJoinPool' />
            </h2>
          </div>
          <div className='pools-type_card'>
            {listData &&
              listData.map((pool) => {
                return renderCard(pool)
              })}
            {!listData.length && noData()}
          </div>
        </div>
      </div>
      <div className='pools-type-bottom'>
        <h2>
          <FormattedMessage id='partner' />
        </h2>
      </div>
    </div>
  )
}
export default withRouter(PoolsIndex)
