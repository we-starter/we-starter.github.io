import React, {useState} from "react";
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
import {ChainId, USDT_ADDRESS, WAR_ADDRESS, WHT_ADDRESS} from "../../web3/address";
import BigNumber from "bignumber.js";
import {getIPFSFile, uploadIPFSJson} from "../../utils/ipfs";
import ApplyInfoView from './ApplyInfo'

const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
export default function Apply() {
  const [price] = useMDexPrice(
    WAR_ADDRESS(ChainId.HECO),
    USDT_ADDRESS(ChainId.HECO),
    1,
    [WHT_ADDRESS(ChainId.HECO)],
    128
  )
  const price_ = price > 0 ? new BigNumber(price).toFixed(6) * 1 : '-'

  const [showInfoPage, setShowInfoPage] = useState(false)
  const [data, setData] = useState(null)
  const [amount, setAmount] = useState('')
  const [startTime, setStartTime] = useState(() => data ? moment(data) : '')
  const [loading, setLoading] = useState(false)
  const onApply = ()=> {
    if (!data || !amount || amount < 0 || !startTime){
      return message.warning('Please Enter information completely')
    }
    setLoading(true)
    uploadIPFSJson({
      ...data,
      amount,
      startTime
    }).then(res => {
      setLoading(false)
      console.log(res)
    })
  }
  if (showInfoPage){
    return <div className="apply-view"><ApplyInfoView data={data} setData={setData} setShowInfoPage={setShowInfoPage}/></div>
  }
  return (
    <div className="apply-view">
      <div className="apply-view-back">
        <img src={BackIcon} alt="Back"/>
        <span>Proposals</span>
      </div>
      <h2 className="apply-view-title">Apply</h2>
      <div className="nft-card">
        <p className="nft-card-title">ID:{data && data.id}</p>
        {
          data ? (
            <div className="nft-card-info" onClick={() => setShowInfoPage(true)}>
              <div className="nft-card-info-t">
                <img src={getIPFSFile(data.logo)} alt=""/>
                <div>
                  <h2>{data.name}</h2>
                  <p>{data.tokenTicker}</p>
                </div>
              </div>
              <div className="url-list">
                {data.website && <a href={data.website}><img src={WebsiteIcon} alt="website"/></a>}
                {data.twitter && <a href={data.twitter}><img src={TwitterIcon} alt="twitter"/></a>}
                {data.discord && <a href={data.discord}><img src={DiscordIcon} alt="discord"/></a>}
                {data.telegram && <a href={data.telegram}><img src={TelegramIcon} alt="telegram"/></a>}
                {data.medium && <a href={data.medium}><img src={MediumIcon} alt="medium"/></a>}
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
          'disabled': false
        })} src={false ? LeftArrowGrayIcon : LeftArrowBlackIcon} alt="prev"/>
        <img className={cs({
          'arrow-r': true,
          'disabled': true
        })} src={true ? LeftArrowGrayIcon : LeftArrowBlackIcon} alt="next"/>
      </div>
      <div className="tip-txt">
        <div>创建新的 Project NFT Card</div>
        <div>什么是 NFT Card？</div>
      </div>
      <Input suffix="WAR" className="apply-input" type="number" value={amount} onInput={e => setAmount(e.target.value)}/>
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
        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
        onOk={setStartTime}
      />
      <div className="info-tips">
        <img src={TipsIcon} alt="tips"/>
        <div>从投票开始计时，周期为 <strong>3</strong> 天，资金将在投票结束后 <strong>5</strong> 天后释放</div>
      </div>
        <Button type="primary" size="large" className="apply-btn" loading={loading} onClick={onApply}>Apply</Button>
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
