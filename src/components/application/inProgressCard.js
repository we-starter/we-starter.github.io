import React, { useContext, useEffect, useMemo, useState } from 'react'
import cs from 'classnames'
import { FormattedMessage, injectIntl } from 'react-intl'
import { voteMain } from '../../web3/address'
import { getContract, useActiveWeb3React } from '../../web3'
import { useBalance, useAllowance } from '../../pages/Hooks'
import { mainContext } from '../../reducer'
import { getIPFSJson, getIPFSFile } from '../../utils/ipfs'
import ApplicationCountdown from './ApplicationCountdown'
import { formatAmount } from '../../utils/format'
import BigNumber from 'bignumber.js'
import { NavLink } from 'react-router-dom'
import ApplicationClaimPopup from './claimPopup'

export const InProgressCard = (props) => {
  const { listData } = props
  console.log(listData, 'listData')
  const { library, account, active } = useActiveWeb3React()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [detailData, setDetailData] = useState({})
  const [progressData, setProgressData] = useState('')

  const getVotesData = (propId) => {
    if (!active) {
      return false
    }
    const pool_contract = getContract(library, voteMain.abi, voteMain.address)
    pool_contract.methods
      .getVotes(propId)
      .call()
      .then((res) => {
        setProgressData(
          new BigNumber(formatAmount(res[1]))
            .div(new BigNumber(formatAmount(listData.voteMax)))
            .toFixed(2, 1)
            .toString()
        )
      })
      .catch((err) => {
        console.log('error', err)
      })
  }

  useMemo(() => {
    if (listData && listData.ProjectId) {
      getVotesData(listData.ProjectId)
    }
  }, [listData])

  useMemo(() => {
    if (listData && listData.tokenURI && progressData) {
      getIPFSJson(listData.tokenURI)
        .then((res) => {
          if (res.data) {
            res.data.ProjectId = listData.ProjectId
            res.data.id = listData.id
            res.data.begin = listData.begin
            res.data.voteMax = listData.voteMax
            res.data.progressData = progressData
            setDetailData(res.data)
          }
        })
        .catch((e) => {
          console.log(e, 'e')
        })
    }
  }, [listData, progressData])

  return (
    <div className='application_card'>
      <div className='application_card_title'>
        <i>ID:{listData.id}</i>

        <div className='application_countdown_box'>
          <ApplicationCountdown time={listData && listData.begin} />
        </div>
      </div>
      <div className='application_card_content'>
        <img src={getIPFSFile(detailData && detailData.logo)} />
        <p className='application_card_content_title'>
          <FormattedMessage id='applicationText6' />
          <span>{detailData && detailData.name}</span>
        </p>
        <p className='application_card_content_title'>
          <FormattedMessage id='applicationText7' />
          <span>${detailData && detailData.totalRaise}</span>
        </p>
        <p className='application_card_content_title application_card_content_progress'>
          <FormattedMessage id='poolsIndexText2' />
          <a>
            <span
              style={{
                width: `${progressData > 1 ? 100 : progressData * 100}%`,
              }}
            ></span>
          </a>
        </p>
        <p className='application_card_content_btn'>
          <NavLink
            to={{
              pathname: `/application/vote`,
              state: {
                detailData: detailData,
              },
            }}
          >
            <FormattedMessage id='applicationText8' />
          </NavLink>
          {/* <a className='disable_failed'><FormattedMessage id='applicationText9' /></a> */}
          {/* <a onClick={() => setIsModalVisible(true)}>
            <FormattedMessage id='claim' />
          </a> */}
          <NavLink
            to={{
              pathname: `/application/vote`,
              state: {
                detailData: detailData,
              },
            }}
          >
            <FormattedMessage id='claim' />
          </NavLink>
        </p>
      </div>
      <div className='application_card_content_h5'>
        <img src={getIPFSFile(detailData && detailData.logo)} />
        <p className='application_card_content_title_h5'>
          <FormattedMessage id='applicationText6' />
          <span>{detailData && detailData.name}</span>
        </p>
        <div className='application_card_content_h5_box'>
          <p className='application_card_content_title'>
            <FormattedMessage id='applicationText7' />
            <span>${detailData && detailData.totalRaise}</span>
          </p>
          <p className='application_card_content_title application_card_content_progress'>
            <FormattedMessage id='poolsIndexText2' />
            <a>
              <span style={{ width: '80px' }}></span>
            </a>
          </p>
        </div>
        <p className='application_card_content_btn'>
          {/* <NavLink to='/application/vote'>
            <FormattedMessage id='applicationText8' />
          </NavLink> */}
          <a className='disable_failed'>
            <FormattedMessage id='applicationText9' />
          </a>
          {/* <a onClick={() => setIsModalVisible(true)}>
            <FormattedMessage id='claim' />
          </a> */}
          <NavLink
            to={{
              pathname: `/application/vote`,
              state: {
                detailData: detailData,
              },
            }}
          >
            <FormattedMessage id='claim' />
          </NavLink>
        </p>
      </div>
      {/* <ApplicationClaimPopup
        visible={isModalVisible}
        tokenUrl={listData.tokenURI}
        onClose={() => setIsModalVisible(false)}
      /> */}
    </div>
  )
}

export default injectIntl((props) => {
  const { dispatch, state } = useContext(mainContext)
  return useMemo(() => <InProgressCard {...props} dispatch={dispatch} />, [
    dispatch,
    props,
  ])
})
