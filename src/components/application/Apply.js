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
import {Button, DatePicker, Input, message} from "antd";
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
  const [nftIndex, setNFTIndex] = useState(0)
  const [nftData, setNFTData] = useState(null)
  const [amount, setAmount] = useState('')
  const [startTime, setStartTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [isApproveNFT, setIsApproveNFT] = useState(false)
  const [isApproveToken, setIsApproveToken] = useState(false)

  const getNftCard = () => {
    if (nftList[nftIndex]){
      getIPFSJson(nftList[nftIndex].tokenURI).then(res=>{
        setNFTData({
          ...res.data,
          ...nftList[nftIndex]
        })
        getApproved()
      })
    } else {
      setNFTData(null)
    }
  }
  const getNftCards = () => {
    setNFTData(null)
    axios({
      method: 'post',
      url: 'https://graph.westarter.org/heco/subgraphs/name/westarter/governance',
      data: {
        query: `{
          projects(first: 1000, skip:0, where: { holder: "${account}" }) {
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
    })
  }
  useMemo(() => {
    getNftCard()
  }, [nftIndex, nftList])

  useMemo(() => {
    if (account){
      getNftCards()
    }
  }, [account])

  const getApproved = (tokenId) => {
    return
    const multicallProvider = getOnlyMultiCallProvider(ChainId.HECO)
    const contractNFT = new Contract(voteNFT.address, voteNFT.abi)
    const contractToken = new Contract(WAR_ADDRESS(chainId), ERC20.abi)
    const calls = [
      contractNFT.getApproved(tokenId),
      contractToken.allowance(account, voteMain.address)
    ]
    multicallProvider.all(calls).then(data => {
      data = processResult(data)
      setIsApproveNFT(data[0])
      setIsApproveToken(data[1] > 0)
    })
  }

  const onApproveNFT = () => {
    const contract = getContract(library, voteNFT.abi, voteNFT.address)
    setLoading(true)
    contract.methods
      .approve(voteMain.address, nftData.tokenId)
      .send({
        from: account,
        ...GAS_FEE(chainId)
      })
      .on('receipt', async (_, receipt) => {
        message.success('Approve Success')
        await getApproved()
        setLoading(false)
      })
      .on('error', (err, receipt) => {
        setLoading(false)
      })
  }

  const onApproveToken = () => {
    const tokenId = ''
    setLoading(true)
    const contract = getContract(library, ERC20.abi, WAR_ADDRESS(chainId))
    contract.methods
      .approve(voteMain.address, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
      .send({
        from: account,
        ...GAS_FEE(chainId)
      })
      .on('receipt', async (_, receipt) => {
        message.success('Approve Success')
        await getApproved()
        setLoading(false)
      })
      .on('error', (err, receipt) => {
        setLoading(false)
      })
  }

  const onApply = () => {
    if (!amount || amount < 0 || !startTime) {
      return message.warning('Please Enter information completely')
    }
    setLoading(true)
    const tokenId = ''
    const contract = getContract(library, voteMain.abi, voteMain.address)
    setLoading(true)
    const begin = ~~(new Date(startTime).getTime() / 1000)
    contract.methods
      .propose(nftData.name, '', nftData.id, numToWei(nftData.totalRaise, 18), numToWei(price_, 18), numToWei(amount, 18), begin)
      .send({
        from: account,
        ...GAS_FEE(chainId)
      })
      .on('receipt', async (_, receipt) => {
        message.success('Create Success')
        getNftCards()
        setLoading(false)
      })
      .on('error', (err, receipt) => {
        setLoading(false)
      })
  }

  const onSubmit = () => {
    if (!isApproveNFT) {
      return {
        fn: onApproveNFT,
        txt: 'Approve NFT'
      }
    }
    if (!isApproveToken) {
      return {
        fn: onApproveToken,
        txt: 'Approve Token'
      }
    }
    return {
      fn: onApply,
      txt: 'Apply'
    }
  }
  const submitBtnA = onSubmit()

  const onPrev = () => {
    if (nftIndex !== 0){
      setNFTIndex(nftIndex - 1)
    }
  }
  const onNext = () => {
    if (nftIndex < nftList.length){
      setNFTIndex(nftIndex + 1)
    }
  }

  if (showInfoPage) {
    return <div className="apply-view"><ApplyInfoView setShowInfoPage={setShowInfoPage} getNftCards={getNftCards}/>
    </div>
  }
  return (
    <div className="apply-view">
      <NavLink to='/application' className="apply-view-back">
        <img src={BackIcon} alt="Back"/>
        <span>Proposals</span>
      </NavLink>
      <h2 className="apply-view-title">Apply</h2>
      <div className="nft-card">
        <p className="nft-card-title">ID: {nftData && nftData.tokenId}</p>
        {
          nftData ? (
            <div className="nft-card-info" onClick={() => setShowInfoPage(true)}>
              <div className="nft-card-info-t">
                <img src={getIPFSFile(nftData.logo)} alt=""/>
                <div>
                  <h2>{nftData.name}</h2>
                  <p>{nftData.tokenTicker}</p>
                </div>
              </div>
              <div className="url-list">
                {nftData.website &&
                <a href={nftData.website} target="_blank"><img src={WebsiteIcon} alt="website"/></a>}
                {nftData.twitter &&
                <a href={nftData.twitter} target="_blank"><img src={TwitterIcon} alt="twitter"/></a>}
                {nftData.discord &&
                <a href={nftData.discord} target="_blank"><img src={DiscordIcon} alt="discord"/></a>}
                {nftData.telegram &&
                <a href={nftData.telegram} target="_blank"><img src={TelegramIcon} alt="telegram"/></a>}
                {nftData.medium && <a href={nftData.medium} target="_blank"><img src={MediumIcon} alt="medium"/></a>}
              </div>
            </div>
          ) : (
            <div className="create-view">
              <img src={CreateIcon} alt="create" onClick={() => setShowInfoPage(true)}/>
              <p>Create new Project NFT Card</p>
            </div>
          )
        }
        <img className={cs({
          'arrow-l': true,
          'disabled': nftIndex === 0
        })} src={LeftArrowBlackIcon} alt="prev" onClick={onPrev}/>
        <img className={cs({
          'arrow-r': true,
          'disabled': nftIndex >= nftList.length
        })} src={LeftArrowBlackIcon} alt="next" onClick={onNext}/>
      </div>
      <div className="tip-txt">
        <div><FormattedMessage id="applicationText29"/> Project NFT Card</div>
        <div>什么是 NFT Card？</div>
      </div>
      <Input suffix="WAR" className="apply-input" type="number" value={amount}
             onInput={e => setAmount(e.target.value)}/>
      <div className="tab-info">
        <div className="tab-info-item">
          <p>WAR 当前价</p>
          <h2>${price_}</h2>
        </div>
        <div className="tab-info-item">
          <p>项目申请募资</p>
          <h2>$500,000 </h2>
        </div>
        <div className="tab-info-item">
          <p>建议抵押金额</p>
          <h2>123434.54 WAR</h2>
        </div>
      </div>
      <div className="info-tips">
        <img src={TipsIcon} alt="tips"/>
        <div>抵押的 WAR 价值不能小于总募资金额，否则影响后续的募资计划</div>
      </div>
      <DatePicker
        className="apply-input date-picker"
        format={TIME_FORMAT}
        defaultValue={startTime}
        placeholder="请选择开始时间"
        allowClear={false}
        suffixIcon={<img src={DateIcon} className="date-icon" alt=""/>}
        showTime={{defaultValue: moment('00:00:00', 'HH:mm:ss')}}
        onOk={setStartTime}
      />
      <div className="info-tips">
        <img src={TipsIcon} alt="tips"/>
        <div>从投票开始计时，周期为 <strong>3</strong> 天，资金将在投票结束后 <strong>5</strong> 天后释放</div>
      </div>
      <Button type="primary" size="large" className="apply-btn" loading={loading}
              onClick={submitBtnA.fn}>{submitBtnA.txt}</Button>
      <h2 className="role-title">规则</h2>
      <div className="info-tips">
        <div>如果提案在周期内，等于或者超过项目 IWO 总额度的 50%，则为成功，投票方和项目发起人（提案人）可以在 5 天后 Claim 回来自己的 WAR</div>
      </div>
      <div className="info-tips">
        <div>如果提案在周期内，低于项目方 IWO 总额度的 50%，则为失败。提案抵押金额的 50% 将空投给投票方，余下 50% 抵押金额将燃烧。投票方可以在 5 天后 Claim 回来自己的 WAR。</div>
      </div>
    </div>
  )
}
