import React, { useContext, useEffect, useState } from 'react'
import cs from 'classnames'
import { useActiveWeb3React } from '../../web3'
import { FormattedMessage, injectIntl } from 'react-intl'
import axios from 'axios'
import { ApplicationBanner } from '../../components/application/applicationBanner'
import { InProgressCard } from '../../components/application/inProgressCard'
import Footer from '../../components/Footer'
import { VoteSpanVal, VoteEndToClaimSpan } from './Hooks'
import BigNumber from 'bignumber.js'
import { useBlockHeight } from './Hooks'

const Application = (props) => {
  const { account, active, library, chainId } = useActiveWeb3React()
  const { blockHeight } = useBlockHeight()
  const [statusFlag, setStatusFlag] = useState('InProgress')
  const [cardDataList, setCardDataList] = useState([])
  const voteCycle = VoteSpanVal()
  const voteEndClaimCycle = VoteEndToClaimSpan()

  const changeFlag = (val) => {
    setStatusFlag(val)
  }
  const cardList = () => {
    axios({
      method: 'post',
      url:
        'https://graph.westarter.org/heco/subgraphs/name/westarter/governance',
      data: {
        query: `{
          projectVotes(first: 1000, skip:0) {
            id
            ProjectId
            tokenId
            tokenURI
            begin
            voteMax
            voteYes
            voteNo
          }
        }`,
      },
    })
      .then((res) => {
        if (res.data.data.projectVotes) {
          setCardDataList(res.data.data.projectVotes)
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }

  useEffect(() => {
    cardList()
  }, [active, blockHeight])

  let span_time = voteCycle * 1000
  let claim_time = voteEndClaimCycle * 1000
  let now_time = Date.now()
  // 0 countdown  1 voting  2 end
  useEffect(() => {
    if (cardDataList.length) {
      cardDataList.map((item) => {
        let begin_time = item.begin * 1000
        if (begin_time - now_time > 0) {
          // start
          item.left_time = begin_time - Date.now()
        } else if (now_time < begin_time + span_time) {
          // voteing
          item.left_time = new BigNumber(begin_time)
            .plus(span_time)
            .minus(now_time)
            .toString()
          item.status = 1
        } else {
          item.left_time = 0
          item.status = 2
        }
        if (
          item.status === 2 &&
          now_time >= begin_time + span_time + claim_time
        ) {
          item.isClaim = true
        } else {
          item.isClaim = false
        }
      })
    }
  }, [props.location, cardDataList, voteCycle, voteEndClaimCycle])

  return (
    <div style={{ position: 'relative' }}>
      <ApplicationBanner />
      <div className='application_content'>
        <div className='application_content_tab'>
          <a
            className={cs(
              statusFlag === 'InProgress' && 'application_content_tab_active'
            )}
            onClick={() => {
              changeFlag('InProgress')
            }}
          >
            <FormattedMessage id='applicationText3' />
          </a>
          <a
            className={cs(
              statusFlag === 'over' && 'application_content_tab_active'
            )}
            onClick={() => {
              changeFlag('over')
            }}
          >
            <FormattedMessage id='applicationText4' />
          </a>
        </div>
        {statusFlag === 'InProgress' &&
          cardDataList.map((item, index) => {
            return (
              item.status !== 2 && (
                <InProgressCard listData={item} key={index} />
              )
            )
          })}
        {statusFlag === 'over' &&
          cardDataList.map((item, index) => {
            return (
              item.status === 2 && (
                <InProgressCard listData={item} key={index} />
              )
            )
          })}
        {/* <div className='no-data'>
          <img src={require('../../assets/icon/noData@2x.png')} className='no-proposal' />
          <p className='no-proposal-text'><FormattedMessage id='applicationText5' /></p>
          <p className='initiate-proposal'>
            <a><FormattedMessage id='applicationText2' /></a>
          </p>
        </div> */}
      </div>
      <Footer />
    </div>
  )
}

export default injectIntl(Application)
