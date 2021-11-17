import React, { useContext, useEffect, useState } from 'react'
import cs from 'classnames'
import { useActiveWeb3React } from '../../web3'
import { FormattedMessage, injectIntl } from 'react-intl'
import axios from 'axios'
import { ApplicationBanner } from '../../components/application/applicationBanner'
import { InProgressCard } from '../../components/application/inProgressCard'
import Footer from '../../components/Footer'

const Application = (props) => {
  const [statusFlag, setStatusFlag] = useState('InProgress')
  const [cardDataList, setCardDataList] = useState([])
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
    }).then(res => {
      if (res.data.data.projectVotes) {
        setCardDataList(res.data.data.projectVotes)
      }
    })
    .catch(e => {
      console.log(e)
    })
  }

  useEffect(() => {
    cardList()
  },[])

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
        {cardDataList.map((item, index) => {
          return <InProgressCard listData={item} key={index} />
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
