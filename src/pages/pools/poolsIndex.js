import React, { useEffect, useState } from 'react'
import cs from 'classnames'
import { withRouter } from 'react-router'
import PoolsTextHeader from '../../components/staterPools/poolsTextHeader'
import HUSD from '../../assets/icon/HUSD@2x.png'

const PoolsIndex = (props) => {
  // 列表查看详情
  const goDetail = (item) => {
    props.history.push(`/pools/detail/${item.address}`)
  }
  return (
    <div className='pools-type'>
      <PoolsTextHeader />
      <div className='pools-type_content'>
        <h2>Top Pools</h2>
        <div className='pools-type_card'>
          <div className='pools-type_card_box'>
            <div className='pools-type_title'>
              <p className='pools-type_card_title'>
                <img src={HUSD} />
                HUSD POOL
              </p>
              <span className='pools-type_coming_status'>即将上线</span>
            </div>
            <div className='pools-type_title'>
              <p className='pools-type_card_ratio'>
                Ratio
                <i>1HT = xxx coin</i>
              </p>
              <p
                className='pools-type_card_ratio'
                style={{ textAlign: 'right' }}
              >
                募集总量
                <i>102302032 HT</i>
              </p>
            </div>
            <div className='pools-type_title'>
              <p
                className='pools-type_card_ratio'
                style={{ marginTop: '24px' }}
              >
                Progress
              </p>
            </div>
            <div className='pools-type_percentage'>
              <a>
                <i
                  className='pools-type_progress_bar'
                  style={{ width: '0' + '%' }}
                ></i>
              </a>
              <p>0%</p>
            </div>
            <a
              className='pools-type_enter'
              onClick={() => {
                goDetail()
              }}
            >
              Enter Pool
            </a>
          </div>
          <div className='pools-type_card_box'>
            <div className='pools-type_title'>
              <p className='pools-type_card_title'>
                <img src={HUSD} />
                HUSD POOL
              </p>
              <span className='pools-type_progress_status'>募集中</span>
            </div>
            <div className='pools-type_title'>
              <p className='pools-type_card_ratio'>
                Ratio
                <i>1HT = xxx coin</i>
              </p>
              <p
                className='pools-type_card_ratio'
                style={{ textAlign: 'right' }}
              >
                募集总量
                <i>102302032 HT</i>
              </p>
            </div>
            <div className='pools-type_title'>
              <p
                className='pools-type_card_ratio'
                style={{ marginTop: '24px' }}
              >
                Progress
              </p>
            </div>
            <div className='pools-type_percentage'>
              <a>
                <i
                  className='pools-type_progress_bar'
                  style={{ width: '10' + '%' }}
                ></i>
              </a>
              <p>10%</p>
            </div>
            <a
              className='pools-type_enter'
              onClick={() => {
                goDetail()
              }}
            >
              Enter Pool
            </a>
          </div>
          <div className='pools-type_card_box'>
            <div className='pools-type_title'>
              <p className='pools-type_card_title'>
                <img src={HUSD} />
                HUSD POOL
              </p>
              <span className='pools-type_over_status'>已结束</span>
            </div>
            <div className='pools-type_title'>
              <p className='pools-type_card_ratio'>
                Ratio
                <i>1HT = xxx coin</i>
              </p>
              <p
                className='pools-type_card_ratio'
                style={{ textAlign: 'right' }}
              >
                募集总量
                <i>102302032 HT</i>
              </p>
            </div>
            <div className='pools-type_title'>
              <p
                className='pools-type_card_ratio'
                style={{ marginTop: '24px' }}
              >
                Progress
              </p>
            </div>
            <div className='pools-type_percentage'>
              <a>
                <i
                  className='pools-type_progress_bar'
                  style={{ width: '100' + '%' }}
                ></i>
              </a>
              <p>100%</p>
            </div>
            <a
              className='pools-type_enter'
              onClick={() => {
                goDetail()
              }}
            >
              Enter Pool
            </a>
          </div>
          <div className='pools-type_card_box'>
            <div className='pools-type_title'>
              <p className='pools-type_card_title'>
                <img src={HUSD} />
                HUSD POOL
              </p>
              <span className='pools-type_coming_status'>即将上线</span>
            </div>
            <div className='pools-type_title'>
              <p className='pools-type_card_ratio'>
                Ratio
                <i>1HT = xxx coin</i>
              </p>
              <p
                className='pools-type_card_ratio'
                style={{ textAlign: 'right' }}
              >
                募集总量
                <i>102302032 HT</i>
              </p>
            </div>
            <div className='pools-type_title'>
              <p
                className='pools-type_card_ratio'
                style={{ marginTop: '24px' }}
              >
                Progress
              </p>
            </div>
            <div className='pools-type_percentage'>
              <a>
                <i
                  className='pools-type_progress_bar'
                  style={{ width: '0' + '%' }}
                ></i>
              </a>
              <p>0%</p>
            </div>
            <a
              className='pools-type_enter'
              onClick={() => {
                goDetail()
              }}
            >
              Enter Pool
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
export default withRouter(PoolsIndex)
