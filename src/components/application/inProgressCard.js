import React, { useContext, useEffect, useMemo, useState } from 'react'
import cs from 'classnames'
import { FormattedMessage, injectIntl } from 'react-intl'
import { voteMain } from '../../web3/address'
import Web3 from 'web3'
import { getContract, useActiveWeb3React } from '../../web3'
import { mainContext } from '../../reducer'
import { getIPFSJson, getIPFSFile } from '../../utils/ipfs'
import ApplicationCountdown from './ApplicationCountdown'
import { formatAmount } from '../../utils/format'
import BigNumber from 'bignumber.js'
import { NavLink } from 'react-router-dom'
import ApplicationClaimPopup from './claimPopup'
import { SuccessPercent, VotesData } from '../../pages/pools/Hooks'

export const InProgressCard = (props) => {
  const { listData } = props
  const { library, account, active } = useActiveWeb3React()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [detailData, setDetailData] = useState({})
  const [logoUrl, setLogoUrl] = useState('')
  let progressData = VotesData(
    listData && listData.ProjectId,
    listData && listData.voteMax
  )
  let successPercentVal = SuccessPercent()

  useEffect(() => {
    if (listData && listData.tokenURI && progressData) {
      getIPFSJson(listData.tokenURI)
        .then((res) => {
          if (res.data) {
            res.data.ProjectId = listData.ProjectId
            res.data.id = listData.id
            res.data.begin = listData.begin
            res.data.voteMax = listData.voteMax
            res.data.progressData = progressData
            res.data.left_time = listData.left_time
            res.data.status = listData.status
            res.data.isClaim = listData.isClaim
            res.data.claim_time = listData.claim_time
            res.data.successStatus = progressData * 100 >= 100
            setDetailData(res.data)
          }
        })
        .catch((e) => {
          console.log(e, 'e')
        })
    }
  }, [listData.left_time, progressData, active, successPercentVal])

  useEffect(() => {
    if (detailData && detailData.logo) {
      setLogoUrl(getIPFSFile(detailData && detailData.logo))
    }
  }, [detailData])

  return (
    <div className='application_card'>
      <div className='application_card_title'>
        <i>ID:{listData.id}</i>

        <div className='application_countdown_box'>
          <ApplicationCountdown
            left_time={listData && listData.left_time}
            status={listData && listData.status}
            successStatus={progressData * 100 >= 100}
          />
        </div>
      </div>
      <div className='application_card_content'>
        {!logoUrl && <p className='placeholder_map'></p>}
        {logoUrl && <img src={logoUrl} />}
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
                width: `${progressData >= 1 ? 100 : progressData * 100}%`,
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
              <span
                style={{
                  width: `${progressData > 1 ? 100 : progressData * 100}%`,
                }}
              ></span>
            </a>
          </p>
        </div>
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
