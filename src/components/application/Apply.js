import React, {useMemo, useState} from "react";
import BackIcon from '../../assets/icon/application/back@2x.png'
import LeftArrowBlackIcon from '../../assets/icon/application/left-arrow-black.svg'
import TipsIcon from '../../assets/icon/application/tips.svg'
import DateIcon from '../../assets/icon/application/date.svg'
import cs from 'classnames'
import {Button, DatePicker, Input, message, Spin, Tooltip} from "antd";
import moment from 'moment'
import {useMDexPrice} from "../../pages/pools/Hooks";
import {ChainId, GAS_FEE, USDT_ADDRESS, voteMain, voteNFT, WAR_ADDRESS, WHT_ADDRESS} from "../../web3/address";
import BigNumber from "bignumber.js";
import {getIPFSJson} from "../../utils/ipfs";
import ApplyInfoView from './ApplyInfo'
import {NavLink} from "react-router-dom";
import {FormattedMessage} from "react-intl";
import {multicallClient, ClientContract} from "../../utils/multicall";

import {getContract, useActiveWeb3React} from "../../web3";
import {fromWei, numToWei} from "../../utils/format";
import ERC20 from "../../web3/abi/ERC20.json";
import axios from "axios";
import {cloneDeep} from "lodash";
import NFTCard from "./NFTCard";
import {changeNetwork} from "../../connectors";

const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
export default function Apply() {
  const [price] = useMDexPrice(
    WAR_ADDRESS(ChainId.HECO),
    USDT_ADDRESS(ChainId.HECO),
    1,
    [WHT_ADDRESS(ChainId.HECO)],
    128
  )
  const {library, account, chainId} = useActiveWeb3React()
  const price_ = price > 0 ? new BigNumber(price).toFixed(6) * 1 : '-'

  const [showInfoPage, setShowInfoPage] = useState(false)
  const [nftList, setNFTList] = useState([])
  const [nftIndex, setNFTIndex] = useState(-1)
  const nftData = nftList[nftIndex]
  const ipfsData = nftData ? nftData.ipfsData : null
  const [amount, setAmount] = useState(null)
  const [startTime, setStartTime] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  const [approveNFTLoading, setApproveNFTLoading] = useState(false)
  const [approveWARLoading, setApproveWARLoading] = useState(false)
  const [loadLoading, setLoadLoading] = useState(false)
  const [isSetMin, setIsSetMin] = useState(null)
  const [isApprove, setIsApprove] = useState({})
  const [minAmountLimit, setMinAmountLimit] = useState(10000)

  useMemo(()=>{
    if (price && ipfsData?.totalRaise && isSetMin !== nftData.tokenId) {
      setIsSetMin(nftData.tokenId)
      const amount_ = Math.ceil((ipfsData.totalRaise / price).toFixed(2) * 0.2)
      setAmount(amount_ > 10000 ? amount_ : 10000)
    }
  }, [price_, ipfsData])

  const getNftCard = (_nftIndex) => {
    const nftIndex_ = _nftIndex || nftIndex
    if (nftList[nftIndex_].ipfsData) {
      return
    }
    if (nftList[nftIndex_]) {
      getIPFSJson(nftList[nftIndex_].tokenURI).then(async ({data: ipfsData}) => {
        const nftList_ = cloneDeep(nftList)
        nftList_[nftIndex_].ipfsData = ipfsData
        setNFTList(nftList_)
      })
    }
  }
  const getNftCards = async () => {
    setLoadLoading(true)

    const voteNFTContract = new ClientContract(voteNFT.abi, voteNFT.address, ChainId.HECO)
    const maxId = await multicallClient([
      voteNFTContract.maxId()
    ]).then(res => {
      return res[0]
    })
    const calls = []
    for (let i = 1; i <= maxId; i++) {
      calls.push(
        voteNFTContract.ownerOf(i),
        voteNFTContract.tokenURI(i)
      )
    }
    multicallClient(calls).then(res => {
      if (res[0] === null) {
        return
      }
      const list = []
      for (let i = 1; i <= maxId; i++) {
        if (account.toLowerCase() === res[(i-1) * 2].toLowerCase()) {
          list.push({
            holder: res[(i-1) * 2],
            tokenId: i,
            tokenURI: res[(i-1) * 2 + 1]
          })
        }
      }
      setNFTList(list)
      setNFTIndex(list.length - 1)
      getApproved(list)
    })

/*    axios({
      method: 'post',
      url: 'https://graph.westarter.org/heco/subgraphs/name/westarter/governance',
      data: {
        query: `{
          projects(first: 1000, skip:0, where: { holder: "${account}" }, orderBy:tokenId) {
              id
              holder
              tokenId
              tokenURI
          }
      }`,
      },
    }).then(res => {
      const nftList = res.data.data.projects || []
      setNFTList(nftList)
      setNFTIndex(nftList.length - 1)
      getApproved(nftList)
    })*/
  }
  useMemo(() => {
    if (nftList[nftIndex]) {
      getNftCard(nftIndex)
    }
  }, [nftIndex, nftList])

  useMemo(() => {
    if (account) {
      getNftCards()
    }
  }, [account])


  const getAmountLimit = () => {
    const contract = new ClientContract(voteMain.abi, voteMain.address, ChainId.HECO)
    multicallClient([contract.thresholdPropose()]).then(data => {
      setMinAmountLimit(fromWei(data).toFixed(2)*1)
    })
  }
  useMemo(() => {
    getAmountLimit()
  }, [])
  const getApproved = (nftList) => {
    const contractNFT = new ClientContract(voteNFT.abi, voteNFT.address, ChainId.HECO)
    const contractToken = new ClientContract(ERC20.abi, WAR_ADDRESS(chainId), ChainId.HECO)
    const calls = [contractToken.allowance(account, voteMain.address)]
    for (let i = 0; i < nftList.length; i++) {
      calls.push(contractNFT.getApproved(nftList[i].tokenId))
    }
    return multicallClient(calls).then(data => {
      const isApprove_ = {}
      isApprove_.token = data.shift(0) > 0
      for (let i = 0; i < data.length; i++) {
        isApprove_['nft_' + nftList[i].tokenId] = data[i] === voteMain.address
      }
      setLoadLoading(false)
      setIsApprove(isApprove_)
    })
  }

  const onApproveNFT = () => {
    if (!isApprove.token) {
      return
    }
    const contract = getContract(library, voteNFT.abi, voteNFT.address)
    setApproveNFTLoading(true)
    contract.methods
      .approve(voteMain.address, nftData.tokenId)
      .send({
        from: account,
        ...GAS_FEE(chainId)
      })
      .on('receipt', async (_, receipt) => {
        message.success('Approve Success')
        await getApproved(nftList)
        setApproveNFTLoading(false)
      })
      .on('error', (err, receipt) => {
        setApproveNFTLoading(false)
      })
  }

  const onApproveToken = () => {
    setApproveWARLoading(true)
    const contract = getContract(library, ERC20.abi, WAR_ADDRESS(chainId))
    contract.methods
      .approve(voteMain.address, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
      .send({
        from: account,
        ...GAS_FEE(chainId)
      })
      .on('receipt', async (_, receipt) => {
        message.success('Approve Success')
        await getApproved(nftList)
        setApproveWARLoading(false)
      })
      .on('error', (err, receipt) => {
        setApproveWARLoading(false)
      })
  }

  const onApply = () => {
    if (!isApprove['nft_' + nftData.tokenId] || !isApprove.token) {
      return
    }
    if (!amount || amount < 10000){
      return message.warning('Min 10000 WAR')
    }
    if (!startTime) {
      return message.warning('Please Enter information completely')
    }
    if (amount < minAmountLimit) {
      return message.warning(`The quantity cannot be less than ${minAmountLimit} WAR`)
    }
    if (amount < suggestedAmount() * 0.2) {
      return message.warning(`At least 20%(About ${Math.ceil(suggestedAmount() * 0.2)} WAR)`)
    }
    if (!price) {
      return message.warning('Wait a minute, getting the price ...')
    }
    setSubmitLoading(true)
    const contract = getContract(library, voteMain.abi, voteMain.address)
    setSubmitLoading(true)
    const begin = ~~(new Date(startTime).getTime() / 1000)
    console.log('params', ipfsData.name, ipfsData.descEN, nftData.tokenId, numToWei(ipfsData.totalRaise, 18), numToWei(price_, 18), numToWei(Number(amount).toFixed(18), 18), begin)
    contract.methods
      .propose(ipfsData.name, ipfsData.descEN, nftData.tokenId, numToWei(ipfsData.totalRaise, 18), numToWei(price_, 18), numToWei(Number(amount).toFixed(18), 18), begin)
      .send({
        from: account,
        ...GAS_FEE(chainId)
      })
      .on('receipt', async (_, receipt) => {
        message.success('Create Success')
        getNftCards()
        setSubmitLoading(false)
      })
      .on('error', (err, receipt) => {
        setSubmitLoading(false)
      })
  }

  const onPrev = (e) => {
    if (nftIndex !== 0 && !approveNFTLoading && !approveWARLoading && !submitLoading) {
      setNFTIndex(nftIndex - 1)
    }
    e.stopPropagation()
    return false
  }
  const onNext = (e) => {
    if (nftIndex < nftList.length && !approveNFTLoading && !approveWARLoading && !submitLoading) {
      setNFTIndex(nftIndex + 1)
    }
    e.stopPropagation()
    return false
  }

  const suggestedAmount = () => {
    if (price && ipfsData?.totalRaise) {
      return (ipfsData.totalRaise / price).toFixed(2) * 1
    }
    return '-'
  }

  if (showInfoPage) {
    return <div className="apply-view"><ApplyInfoView setShowInfoPage={setShowInfoPage} ipfsData={ipfsData}
                                                      getNftCards={getNftCards} nftData={nftData}/>
    </div>
  }

  return (
    <div className="apply-view">
      <NavLink to='/application' className="apply-view-back">
        <img src={BackIcon} alt="Back"/>
        <span>Proposals</span>
      </NavLink>
      <h2 className="apply-view-title">Apply</h2>

      <Spin spinning={loadLoading}>
        <span onClick={() => setShowInfoPage(true)}>
        <NFTCard ipfsData={ipfsData} nftData={nftData}>
          <img className={cs({
            'arrow-l': true,
            'disabled': nftIndex === 0
          })} src={LeftArrowBlackIcon} alt="prev" onClick={onPrev}/>
          <img className={cs({
            'arrow-r': true,
            'disabled': nftIndex >= nftList.length
          })} src={LeftArrowBlackIcon} alt="next" onClick={onNext}/>
        </NFTCard>
        </span>
        <div className="tip-txt">
          <div style={{cursor: 'pointer'}} onClick={() => {
            setNFTIndex(nftList.length)
            setShowInfoPage(true)
          }}><FormattedMessage id="applicationText29"/> Project NFT Card
          </div>
          <div>
            <Tooltip title={() => <FormattedMessage id="applicationText39"/>}>
              <span><FormattedMessage id="applicationText30"/></span>
            </Tooltip>
          </div>
        </div>
        <Input suffix="WAR" className="apply-input" type="number" value={amount}
               onInput={e => setAmount(e.target.value)}/>
        <div className="tab-info">
          <div className="tab-info-item">
            <p>WAR <FormattedMessage id="applicationText31"/></p>
            <h2>${price_}</h2>
          </div>
          <div className="tab-info-item">
            <p><FormattedMessage id="applicationText32"/></p>
            <h2>${ipfsData && ipfsData.totalRaise || '-'} </h2>
          </div>
          <div className="tab-info-item">
            <p><FormattedMessage id="applicationText33"/></p>
            <h2>{suggestedAmount()} WAR</h2>
          </div>
        </div>
        <div className="info-tips">
          <img src={TipsIcon} alt="tips"/>
          <div><FormattedMessage id="applicationText34"/></div>
        </div>
        <DatePicker
          className="apply-input date-picker"
          format={TIME_FORMAT}
          defaultValue={startTime}
          placeholder="start time"
          allowClear={false}
          suffixIcon={<img src={DateIcon} className="date-icon" alt=""/>}
          showTime={{defaultValue: moment('00:00:00', 'HH:mm:ss')}}
          onOk={setStartTime}
          showNow={false}
        />
        <div className="info-tips">
          <img src={TipsIcon} alt="tips"/>
          <div><FormattedMessage id="applicationText35" values={{day1: <strong>3</strong>, day2: <strong>5</strong>}}/>
          </div>
        </div>

        <div className={cs({"button-group": true, mr: isApprove.token})}>
          {
            !account || (chainId !== ChainId.HECO && chainId !== ChainId.LOCALHOST) ? (
                <Button type="primary" size="large" className="apply-btn"
                        onClick={() => changeNetwork(ChainId.HECO)}>Switch To HECO</Button>
              ) :
              !nftData ? (
                <Button type="primary" size="large" className="apply-btn"
                        onClick={() => setShowInfoPage(true)}>Create</Button>
              ) : (
                <React.Fragment>
                  {
                    !isApprove.token && (
                      <Button type="primary" size="large" className="apply-btn" loading={approveWARLoading}
                              onClick={onApproveToken}>Approve WAR</Button>)
                  }
                  {
                    !isApprove['nft_' + nftData.tokenId] && (
                      <Button type="primary" size="large" className="apply-btn" loading={approveNFTLoading}
                              onClick={onApproveNFT}>Approve NFT</Button>)
                  }
                  <Button type="primary" size="large" className="apply-btn" loading={submitLoading}
                          onClick={onApply}>Confirm</Button>
                </React.Fragment>
              )
          }


        </div>
        <h2 className="role-title"><FormattedMessage id="applicationText36"/></h2>
        <div className="info-tips">
          <div><FormattedMessage id="applicationText37"/></div>
        </div>
        <div className="info-tips">
          <div><FormattedMessage id="applicationText38"/></div>
        </div>
      </Spin>
    </div>
  )
}
