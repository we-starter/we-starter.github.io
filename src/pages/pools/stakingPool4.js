import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { formatAddress } from '../../utils/format'
import { HANDLE_SHOW_MENUMASK_MODAL } from '../../const'
import cs from 'classnames'
import { withRouter } from 'react-router'
import { Pagination } from 'antd'
import PoolsTextHeader from '../../components/staterPools/poolsTextHeader'
import { usePoolsInfo } from './Hooks'
import BigNumber from 'bignumber.js'

const StakingPool4 = (props) => {
  const [showTab, setShowTab] = useState(2)
  const [searchData, setSearchData] = useState('')
  const [listData, setListData] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const pools = usePoolsInfo()
  //   列表初始值
  const setData = async () => {
    console.log(pools)
    showTab === 1 && setListData(pools)
    showTab === 2 && setListData(pools.filter((o) => o.is_top))
    showTab === 3 && setListData(pools.filter((o) => o.is_join))
    showTab === 4 && setListData(pools.filter((o) => o.is_create))
  }
  useEffect(() => {
    setData()
    setPage(1)
  }, [showTab, pools])
  //  search 筛选框进行筛选
  useEffect(() => {
    searchData.length &&
      setListData(
        listData.filter((item) => {
          if (item.name.toLowerCase().indexOf(searchData.toLowerCase()) > -1) {
            return item
          }
        })
      )
    !searchData.length && setData()
  }, [searchData])
  //   search 筛选框赋值
  const change = (e) => {
    setSearchData(e.target.value)
  }
  // 列表查看详情
  const goDetail = (item) => {
    props.history.push(`/pools/detail/${item.address}`)
  }

  // 翻页
  const changePage = (page, pageSize) => {
    console.log(page, pageSize)
    setPage(page)
  }

  useEffect(() => {
    // 更新数据
  }, [page])

  return (
    <div className='pools-index'>
      <PoolsTextHeader />
      <div className='pools-index_content'>
        <div className='pools-index_tab'>
          {/*<a*/}
          {/*  onClick={() => setShowTab(1)}*/}
          {/*  className={cs(showTab === 1 && 'active')}*/}
          {/*>*/}
          {/*  ALL Pools*/}
          {/*</a>*/}
          <a
            onClick={() => setShowTab(2)}
            className={cs(showTab === 2 && 'active')}
          >
            Top Pools
          </a>
          <a
            onClick={() => setShowTab(3)}
            className={cs(showTab === 3 && 'active')}
          >
            Pools Joined
          </a>
          {/*<a*/}
          {/*  onClick={() => setShowTab(4)}*/}
          {/*  className={cs(showTab === 4 && 'active')}*/}
          {/*>*/}
          {/*  Pools Created*/}
          {/*</a>*/}
        </div>
        {false && (
          <div className='pools-index_search'>
            <input
              placeholder='Search by Pool ID,Pool name,Token contract address,Token symbo'
              value={searchData}
              onChange={(event) => {
                change(event)
              }}
            />
          </div>
        )}
        <table className='pools-index_table'>
          <thead>
            <tr>
              <td>Pool Name</td>
              <td>Ratio</td>
              {/*<td>Access</td>*/}
              <td style={{ width: '250px' }}>Progress</td>
              <td>Status</td>
            </tr>
          </thead>
          <tbody>
            {listData.map((item, index) => {
              return (
                <tr
                  key={index}
                  onClick={() => {
                    goDetail(item)
                  }}
                >
                  <td>
                    <span className='pools-index_list_logo'></span>
                    {item.name}
                  </td>
                  <td>{item.ratio}</td>
                  {/*<td>{item.access}</td>*/}
                  <td>
                    <span className='pools-index_ratio'>{item.progress}%</span>
                    <a>
                      <i
                        className='pools-index_progress_bar'
                        style={{ width: item.progress + '%' }}
                      ></i>
                    </a>
                  </td>
                  {item.status === 0 ? (
                    <td>
                      <p className='pools-index_coming_status'>即将上线</p>
                    </td>
                  ) : item.status === 1 ? (
                    <td>
                      <p className='pools-index_progress_status'>募集中</p>
                    </td>
                  ) : item.status === 2 ? (
                    <td>
                      <p className='pools-index_progress_status'>结算中</p>
                    </td>
                  ) : (
                    <td>
                      <p className='pools-index_over_status'>已结束</p>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
          {!listData.length && (
            <tbody>
              <tr>
                <td colSpan='5' className='pools-index_noData'>
                  暂无数据
                </td>
              </tr>
            </tbody>
          )}
        </table>
        {listData.length > 10 && (
          <Pagination
            defaultCurrent={1}
            current={page}
            total={50}
            onChange={changePage}
            // hideOnSinglePage // 当数据不足一页时不展示分页
            pageSize='10' // 显示数据条数 默认十条
          />
        )}
      </div>
    </div>
  )
}
export default withRouter(StakingPool4)
