import React, {useContext, useEffect, useState} from 'react'
import cs from 'classnames'
import {getContract, useActiveWeb3React} from '../../web3'
import {FormattedMessage, injectIntl} from 'react-intl'
import axios from 'axios'
import {ApplicationBanner} from '../../components/application/applicationBanner'
import {InProgressCard} from '../../components/application/inProgressCard'
import Footer from '../../components/Footer'
import {mainContext} from '../../reducer'
import {changeNetwork} from '../../connectors'
import {ChainId, voteMain, voteNFT} from '../../web3/address'
import NoData from '../../assets/icon/noData@2x.png'
import {
  HANDLE_CHANGE_NETWORKS,
} from '../../const'
import {Spin} from 'antd'
import {
  useBlockHeight,
  VoteSpanVal,
  VoteEndToClaimSpan,
} from './Hooks'
import {getWeb3 as getClientWeb3, Contract as ClientContract} from '@chainstarter/multicall-client.js'
import BigNumber from 'bignumber.js'
import {NavLink} from "react-router-dom";
import {multicallClient} from "../../utils/multicall";
import {fromWei} from "../../utils/format";

const Application = (props) => {
  const {account, active, library, chainId} = useActiveWeb3React()
  const {blockHeight} = useBlockHeight()
  const [statusFlag, setStatusFlag] = useState(1)
  const [cardDataList, setCardDataList] = useState([])
  const [progressData, setProgressData] = useState('')
  const [loading, setLoading] = useState(false)
  const {dispatch, state} = useContext(mainContext)
  const voteCycle = VoteSpanVal()
  const voteEndClaimCycle = VoteEndToClaimSpan()

  useEffect(() => {
    if (chainId && chainId !== ChainId.HECO) {

      changeNetwork(ChainId.HECO)
        .then(() => {
          // TODO 关闭窗口
          if (chainId !== ChainId.HECO) {
            dispatch({
              type: HANDLE_CHANGE_NETWORKS,
              changeNetworkStatus: true,
            })
          }
        })
    } else {
      dispatch({
        type: HANDLE_CHANGE_NETWORKS,
        changeNetworkStatus: false,
      })
    }

  }, [chainId])

  const changeFlag = (val) => {
    setStatusFlag(val)
  }

  const getEvents = (address, topic0, fromBlock = 1) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: `https://api.hecoinfo.com/api?module=logs&action=getLogs
&fromBlock=${fromBlock}
&toBlock=latest
&address=${address}
&topic0=${topic0}
&apikey=982S8JF95E4K4J46SMA2Y4I93UZH5WRMIC`
      }).then(async res => {
        let result = res.data.result
        if (result.length >= 1000) {
          result = result.concat(await getEvents(address, topic0, Number(result[result.length - 1].blockNumber+1)))
        } else {
          resolve(result)
        }
      }).catch((e) => {
        reject()
      })
    })
  }

  const cardList = async () => {
    setLoading(true)
    // 982S8JF95E4K4J46SMA2Y4I93UZH5WRMIC
    // multicallClient.  CreatePropose
    const eventName = 'CreatePropose'
    const web3 = getClientWeb3(ChainId.HECO)
    const eventAbi = voteMain.abi.find(item => item.name === eventName && item.type === 'event')
    const topic0 = web3.eth.abi.encodeEventSignature(eventAbi)
    const datas = await getEvents(voteMain.address, topic0, 1)
    const eventsData = []
    const calls = []
    const voteNFTContract = new ClientContract(voteNFT.abi, voteNFT.address, ChainId.HECO)

    for (let i = 0; i < datas.length; i++) {
      const eventItem = web3.eth.abi.decodeLog(eventAbi.inputs, datas[i].data,
        datas[i].topics.slice(1))
      eventsData.push({
        ProjectId: eventItem.propID,
        tokenId: eventItem.NFTtokenId,
        tokenURI: '',
        begin: eventItem.begin,
        voteMax: new BigNumber(eventItem.iwoAmountUSDT).div(fromWei(eventItem.warPrice, 18)).toString()
      })
      calls.push(voteNFTContract.tokenURI(eventItem.NFTtokenId))
    }
    const tokenURIs = await multicallClient(calls)
    eventsData.map((item, index) => {
      item.tokenURI = tokenURIs[index]
    })
    setCardDataList(eventsData)
    setLoading(false)
    /*    axios({
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
              }
            }`,
          },
        })
          .then((res) => {
            if (res.data.data.projectVotes) {
              setCardDataList(res.data.data.projectVotes)
              setLoading(false)
            }
          })
          .catch((e) => {
            console.log(e)
          })*/
  }

  useEffect(() => {
    cardList()
  }, [active, blockHeight])

  let span_time = voteCycle * 1000
  let claim_time = voteEndClaimCycle * 1000
  let now_time = Date.now()
  // 0 countdown   1 voting   2 end   3 claim time
  useEffect(() => {
    if (cardDataList.length) {
      cardDataList.map((item) => {
        let begin_time = item.begin * 1000
        if (begin_time - now_time > 0) {
          // start
          item.left_time = new BigNumber(begin_time)
            .minus(now_time)
            .toString()
          item.status = 0
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
        item.claim_time = new BigNumber(begin_time)
          .plus(span_time)
          .plus(claim_time)
          .minus(now_time)
          .toString()
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
    <div style={{position: 'relative'}}>
      <ApplicationBanner/>
      <div className='application_content'>
        <div className='application_content_tab'>
          <a
            className={cs(statusFlag === 0 && 'application_content_tab_active')}
            onClick={() => {
              changeFlag(0)
            }}
          >
            <FormattedMessage id='applicationText18'/>
          </a>
          <a
            className={cs(statusFlag === 1 && 'application_content_tab_active')}
            onClick={() => {
              changeFlag(1)
            }}
          >
            <FormattedMessage id='applicationText3'/>
          </a>
          <a
            className={cs(statusFlag === 2 && 'application_content_tab_active')}
            onClick={() => {
              changeFlag(2)
            }}
          >
            <FormattedMessage id='applicationText4'/>
          </a>
        </div>
        <Spin spinning={loading}>
          {!cardDataList.filter((item) => item.status === statusFlag).length ? (
            <div className='no-data'>
              <img src={NoData} className='no-proposal'/>

              <p className='no-proposal-text'>
                <FormattedMessage id='applicationText5'/>
              </p>
              <p className='initiate-proposal'>
                <NavLink to='/application/apply'>
                  <FormattedMessage id='applicationText2'/>
                </NavLink>
              </p>
            </div>
          ) : (
            cardDataList.map((item, index) => {
              return (
                item.status === statusFlag && (
                  <InProgressCard listData={item} key={index}/>
                )
              )
            })
          )}
        </Spin>
      </div>
      <Footer/>
    </div>
  )
}

export default injectIntl(Application)
