import React, {useMemo, useState} from "react";
import BackIcon from '../../assets/icon/application/back@2x.png'
import LeftArrowBlackIcon from '../../assets/icon/application/left-arrow-black.svg'
import LeftArrowGrayIcon from '../../assets/icon/application/left-arrow-gray.svg'
import CreateIcon from '../../assets/icon/application/create.svg'
import WebsiteIcon from '../../assets/icon/application/website.svg'
import TwitterIcon from '../../assets/icon/application/twitter.svg'
import DiscordIcon from '../../assets/icon/application/discord.svg'
import TelegramIcon from '../../assets/icon/application/tme.svg'
import MediumIcon from '../../assets/icon/application/medium.svg'
import TipsIcon from '../../assets/icon/application/tips.svg'
import DateIcon from '../../assets/icon/application/date.svg'
import cs from 'classnames'
import {Button, DatePicker, Input, message, Spin} from "antd";
import moment from 'moment'
import {useMDexPrice} from "../../pages/pools/Hooks";
import {ChainId, GAS_FEE, USDT_ADDRESS, voteMain, voteNFT, WAR_ADDRESS, WHT_ADDRESS} from "../../web3/address";
import BigNumber from "bignumber.js";
import {getIPFSFile, getIPFSJson, uploadIPFSJson} from "../../utils/ipfs";
import ApplyInfoView from './ApplyInfo'
import {NavLink} from "react-router-dom";
import {FormattedMessage} from "react-intl";
import {getOnlyMultiCallProvider, processResult} from "../../utils/multicall";
import {Contract} from "ethers-multicall-x";
import {getContract, useActiveWeb3React} from "../../web3";
import {numToWei} from "../../utils/format";
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
  const [amount, setAmount] = useState('')
  const [startTime, setStartTime] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  const [approveNFTLoading, setApproveNFTLoading] = useState(false)
  const [approveWARLoading, setApproveWARLoading] = useState(false)
  const [loadLoading, setLoadLoading] = useState(false)

  const [isApprove, setIsApprove] = useState({})

  const getNftCard = (_nftIndex) => {
    const nftIndex_ = _nftIndex || nftIndex
    if (nftList[nftIndex_].ipfsData){
      return
    }
    if (nftList[nftIndex_]){
      getIPFSJson(nftList[nftIndex_].tokenURI).then(async ({data: ipfsData})=>{
        const nftList_ = cloneDeep(nftList)
        nftList_[nftIndex_].ipfsData = ipfsData
        setNFTList(nftList_)
      })
    }
  }
  const getNftCards = () => {
    setLoadLoading(true)
    axios({
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
    })
  }
  useMemo(() => {
    if (nftList[nftIndex]){
      getNftCard(nftIndex)
    }
  }, [nftIndex, nftList])

  useMemo(() => {
    if (account){
      getNftCards()
    }
  }, [account])
  const getApproved = (nftList) => {
    const multicallProvider = getOnlyMultiCallProvider(ChainId.HECO)
    const contractNFT = new Contract(voteNFT.address, voteNFT.abi)
    const contractToken = new Contract(WAR_ADDRESS(chainId), ERC20.abi)
    const calls = [contractToken.allowance(account, voteMain.address)]
    for (let i = 0; i < nftList.length; i++) {
      calls.push(contractNFT.getApproved(nftList[i].tokenId))
    }
    return multicallProvider.all(calls).then(data => {
      data = processResult(data)
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
    if (!isApprove.token){
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
    if (!isApprove['nft_' + nftData.tokenId] || !isApprove.token){
      return
    }
    if (!amount || amount < 0 || !startTime) {
      return message.warning('Please Enter information completely')
    }
    if (!price){
      return message.warning('Wait a minute, getting the price ...')
    }
    setSubmitLoading(true)
    const contract = getContract(library, voteMain.abi, voteMain.address)
    setSubmitLoading(true)
    const begin = ~~(new Date(startTime).getTime() / 1000)
    // demo Description(En)  777 6 1000000000000000000 272531000000000000 4000000000000000000 1637164800
    console.log('params', ipfsData.name, ipfsData.descEN, nftData.tokenId, numToWei(ipfsData.totalRaise, 18), numToWei(price_, 18), numToWei(amount, 18), begin)
    contract.methods
      .propose(ipfsData.name, ipfsData.descEN, nftData.tokenId, numToWei(ipfsData.totalRaise, 18), numToWei(price_, 18), numToWei(amount, 18), begin)
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
    if (nftIndex !== 0 && !approveNFTLoading && !approveWARLoading && !submitLoading){
      setNFTIndex(nftIndex - 1)
    }
    e.stopPropagation()
    return false
  }
  const onNext = (e) => {
    if (nftIndex < nftList.length && !approveNFTLoading && !approveWARLoading && !submitLoading){
      setNFTIndex(nftIndex + 1)
    }
    e.stopPropagation()
    return false
  }

  const suggestedAmount = () => {
    if (price && ipfsData?.totalRaise){
      return (ipfsData.totalRaise / price).toFixed(2)*1
    }
    return '-'
  }

  if (showInfoPage) {
    return <div className="apply-view"><ApplyInfoView setShowInfoPage={setShowInfoPage} ipfsData={ipfsData} getNftCards={getNftCards} nftData={nftData}/>
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
          <div><FormattedMessage id="applicationText29"/> Project NFT Card</div>
          <div><FormattedMessage id="applicationText30"/></div>
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
          <div><FormattedMessage id="applicationText35" values={{day1: <strong>3</strong>, day2: <strong>5</strong>}}/></div>
        </div>

        <div className={cs({"button-group": true, mr: isApprove.token})}>
          {
            !account || (chainId !== ChainId.HECO && chainId !== ChainId.LOCALHOST) ? (
                <Button type="primary" size="large" className="apply-btn"
                        onClick={()=>changeNetwork(ChainId.HECO)}>Switch To HECO</Button>
              ) :
            !nftData ? (
              <Button type="primary" size="large" className="apply-btn"
                      onClick={()=>setShowInfoPage(true)}>Create</Button>
            ) : (
              <React.Fragment>
                {
                  !isApprove.token && (<Button type="primary" size="large" className="apply-btn" loading={approveWARLoading}
                                               onClick={onApproveToken}>Approve WAR</Button>)
                }
                {
                  !isApprove['nft_' + nftData.tokenId] && (<Button type="primary" size="large" className="apply-btn" loading={approveNFTLoading}
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
