import React, { useState } from 'react'
import cs from 'classnames'
import PoolsHeader from '../../components/staterPools/poolsHeader'
import chromeLine from '../../assets/icon/chrome-line@2x.png'
import bookMarkLine from '../../assets/icon/book-mark-line@2x.png'
import transitions from '@material-ui/core/styles/transitions'

export const PoolsDetail = () => {
  const [detailTab, setDetailTab] = useState('detail')
  const [recordTab, setRecordTab] = useState(1)

  return (
    <div>
      <PoolsHeader />
      <div className='pools_card'>
        <div className='pools_card_content'>
          <div className='pools_card_content_title'>
            <span>Swap Amount</span>
            <span>1HT =143.22 WAR</span>
          </div>
          <div className='pools_card_val'>100000.00 WAR</div>
          <div className='pools_card_start'>即将上线…</div>
          <div className='pools_card_content_title'>
            <span>Swap Progress</span>
          </div>
          <div className='pools_card_progress__bar'>
            <span style={{ left: '0%' }}></span>
            <p>
              <a style={{ width: '0%' }}></a>
            </p>
          </div>
          <div className='pools_card_content_title pools_card_schedule'>
            <span>0%</span>
            <span>0/1000000</span>
          </div>
        </div>
      </div>
      <div className='pools_detail'>
        <div className='pools_detail_content'>
          <div className='pools_detail_content_tab'>
            <a
              onClick={() => setRecordTab(1)}
              className={cs(recordTab === 1 && 'active')}
            >
              募资记录
            </a>
            <a
              onClick={() => setRecordTab(2)}
              className={cs(recordTab === 2 && 'active')}
            >
              claim
            </a>
          </div>
          {recordTab === 1 && (
            <div
              className='pools_detail_table_box'
              style={{ marginBottom: '40px' }}
            >
              <table className='pools_detail_table pools_detail_table__list'>
                <thead>
                  <tr>
                    <th>时间</th>
                    <th>数量</th>
                    <th>预计中签率</th>
                    <th>预计中签量</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>11111111</td>
                    <td>11111111</td>
                    <td>11111111</td>
                    <td>11111111</td>
                  </tr>
                  <tr>
                    <td>11111111</td>
                    <td>11111111</td>
                    <td>11111111</td>
                    <td>11111111</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {recordTab === 2 && (
            <div>
              <div style={{ marginTop: '24px' }}>
                <a className='pools_detail_coin__list pools_detail_coin__list_active'>
                  HT
                </a>
                <a className='pools_detail_coin__list'>WAR</a>
              </div>
              <div
                className='pools_detail_table_box'
                style={{ marginBottom: '40px', marginTop: '24px' }}
              >
                <table className='pools_detail_table pools_detail_table__list'>
                  <thead>
                    <tr>
                      <th>剩余HT数量</th>
                      <th>获取XXX数量</th>
                      <th>预计中签量</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>11111111</td>
                      <td>11111111</td>
                      <td>
                        <a className='pools_detail_table__confirm'>Claim</a>
                      </td>
                    </tr>
                    <tr>
                      <td>111111</td>
                      <td>111111</td>
                      <td>
                        <a className='pools_detail_table__confirm'>Claim</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <div className='pools_detail_content'>
          <div className='pools_detail_content_tab'>
            <a
              onClick={() => setDetailTab('detail')}
              className={cs(detailTab === 'detail' && 'active')}
            >
              Pool Details
            </a>
            <a
              onClick={() => setDetailTab('project')}
              className={cs(detailTab === 'project' && 'active')}
            >
              About the Project
            </a>
          </div>
          {detailTab === 'detail' && (
            <div className='pools_detail_table_box'>
              <table className='pools_detail_table pools-detail_table__left'>
                <thead>
                  <tr>
                    <th>Pool Information</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <p>
                        <span>Token Distribution</span>
                        <span>January 30th 2021, 1</span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <span>Min. Allocation</span>
                        <span>No minimum HT</span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <span>Max. Allocation</span>
                        <span>0.25 HT</span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <span>Min Swap Level</span>
                        <span>27 HT</span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <span>Access Type</span>
                        <span>Private</span>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className='pools_detail_table pools-detail_table__right'>
                <thead>
                  <tr>
                    <th>Token Information</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <p>
                        <span>Name</span>
                        <span>We Starter</span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <span>Address</span>
                        <span>0x725C263e32c72dDC3A</span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <span>Total Supply</span>
                        <span>160,000,000.0</span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <span>Holders</span>
                        <span>3,433</span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        <span>Transfers</span>
                        <span>10,041</span>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {detailTab === 'project' && (
            <div className='pools_detail_content_link'>
              <a>
                <img src={chromeLine} />
                网站
              </a>
              <a>
                <img src={bookMarkLine} />
                白皮书
              </a>
              <a>
                <svg width='24' height='24' viewBox='0 0 30 30'>
                  <path d='M27.7 7.07c-.95.42-1.96.7-3 .82A5.25 5.25 0 0027 5a10.45 10.45 0 01-3.32 1.27 5.23 5.23 0 00-8.9 4.77A14.84 14.84 0 014 5.57a5.21 5.21 0 001.61 6.98 5.21 5.21 0 01-2.36-.65v.06a5.23 5.23 0 004.2 5.13c-.78.21-1.59.24-2.37.1a5.23 5.23 0 004.88 3.62 10.49 10.49 0 01-7.74 2.17 14.79 14.79 0 008.02 2.35c9.61 0 14.87-7.97 14.87-14.88 0-.22 0-.45-.02-.67 1.03-.74 1.91-1.66 2.61-2.7v-.01z' />
                </svg>
                推特
              </a>
              <a>
                Westarter是一个连接加密货币创新者和投资者的对接平台，
                任何创新者都可以无需许可的使用标准化的界面来发起和管理流动性的拍卖。
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
