import React, {useState} from "react";
import BackIcon from "../../assets/icon/application/back@2x.png";
import {Button, Input, message} from "antd";
import {getIPFSFile, uploadIPFSFile, uploadIPFSJson} from "../../utils/ipfs";
import {LoadingOutlined} from '@ant-design/icons'
import {FormattedMessage} from "react-intl";
import {getContract, useActiveWeb3React} from "../../web3";
import {GAS_FEE} from "../../web3/address";
import SuccessSvg from '../../assets/image/susccess-green.png'
import {voteNFT, voteMain} from '../../web3/address'
import NFTCard from "./NFTCard";

const FromItem = ({children, title, required = true, desc}) => {
  return (
    <div className='form-item'>
      <div className="form-item-title">
        <div className="title">{title}</div>
        <div className="desc">{desc}</div>
        {required && <div className="required">*</div>}
      </div>
      {children}
    </div>
  )
}

const INFO_TEMPLATE = {
  name: '',
  tokenTicker: '',
  logo: "",
  website: '',
  twitter: '',
  discord: '',
  telegram: '',
  whitePaper: '',
  medium: '',
  tokenInformation: '',
  descEN: '',
  descZH: '',
  totalRaise: ''
}

export default function ApplyInfo({setShowInfoPage, getNftCards, ipfsData, nftData}) {
  const [info, setInfo] = useState(() => ipfsData || INFO_TEMPLATE)
  const [logo, setLogo] = useState(() => (ipfsData || INFO_TEMPLATE).logo)
  const [uploadLoading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const {library, account, chainId} = useActiveWeb3React()

  const onChangeInfo = (value, key) => {
    const _info = JSON.parse(JSON.stringify(info))
    _info[key] = value
    setInfo(_info)
  }
  const changeFile = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        return message.warning("Size Limit 8M")
      }
      setUploading(true)
      uploadIPFSFile(file).then(hash => {
        setLogo(hash)
        setUploading(false)
      })
    }
  }
  const onCreate = async () => {
    const info_ = {
      ...info,
      logo
    }
    for (let i in info_) {
      if (!info_[i] && !(i === 'discord' || i === 'medium')) {
        return message.warning('Please Enter information completely')
      }
    }
    if (info_.totalRaise <= 0) {
      return message.warning('Please Enter Total Raise')
    }
    setLoading(true)
    uploadIPFSJson(info_).then(res => {
      const contract = getContract(library, voteNFT.abi, voteNFT.address)
      contract.methods
        .createProjNFTCard(res)
        .send({
          from: account,
          ...GAS_FEE(chainId)
        })
        .on('receipt', (_, receipt) => {
          console.log('ccc',_,receipt)
          message.success('Create Success')
          getNftCards()
          setLoading(false)
          // onChangeInfo('tokenId', _.events.Transfer.retuenValues.tokenId)
          setShowSuccess(true)
        })
        .on('error', (err, receipt) => {
          setLoading(false)
        })
    }).catch(() => {
      message.error('fail')
      setLoading(false)
    })

  }
  return (
    <div className="apply-info-view">
      <div className="apply-view-back" onClick={() => setShowInfoPage(false)}>
        <img src={BackIcon} alt="Back"/>
        <span>Apply</span>
      </div>
      <h2 className="apply-view-title">Project Information</h2>
      <FromItem title="Project Name">
        <Input className="apply-input" value={info.name} onInput={e => onChangeInfo(e.target.value, 'name')}/>
      </FromItem>
      <FromItem title="Token Tikcer">
        <Input className="apply-input" value={info.tokenTicker}
               onInput={e => onChangeInfo(e.target.value, 'tokenTicker')}/>
      </FromItem>
      <FromItem title="Logo Icon">
        <div className="upload-img">
          {
            uploadLoading ? <LoadingOutlined size={40} style={{fontSize: '16px', color: '#08c'}}/> : logo ?
              <img src={getIPFSFile(logo)} alt=""/> : <span>Choose File</span>
          }
          {!ipfsData && <input type="file" accept="image/*" onChange={changeFile}/>}
        </div>
        {!ipfsData && <p className="tip-txt">* <FormattedMessage id="applicationText26"/></p>}
      </FromItem>
      <FromItem title="Website URL">
        <Input className="apply-input" value={info.website} onInput={e => onChangeInfo(e.target.value, 'website')}/>
      </FromItem>
      <FromItem title="Twitter URL">
        <Input className="apply-input" value={info.twitter} onInput={e => onChangeInfo(e.target.value, 'twitter')}/>
      </FromItem>
      <FromItem title="Telegram Handle">
        <Input className="apply-input" value={info.telegram} onInput={e => onChangeInfo(e.target.value, 'telegram')}/>
      </FromItem>
      <FromItem title="Discord URL" required={false}>
        <Input className="apply-input" value={info.discord} onInput={e => onChangeInfo(e.target.value, 'discord')}/>
      </FromItem>
      <FromItem title="Medium URL" required={false}>
        <Input className="apply-input" value={info.medium} onInput={e => onChangeInfo(e.target.value, 'medium')}/>
      </FromItem>
      <FromItem title="White Paper URL">
        <Input className="apply-input" value={info.whitePaper}
               onInput={e => onChangeInfo(e.target.value, 'whitePaper')}/>
      </FromItem>
      <FromItem title="Token Information">
        <Input className="apply-input" value={info.tokenInformation}
               onInput={e => onChangeInfo(e.target.value, 'tokenInformation')}/>
      </FromItem>
      <FromItem title="Description(En)">
        <Input.TextArea rows={4} className="apply-input" value={info.descEN}
                        onInput={e => onChangeInfo(e.target.value, 'descEN')}/>
      </FromItem>
      <FromItem title="Description(中文)">
        <Input.TextArea rows={4} className="apply-input" value={info.descZH}
                        onInput={e => onChangeInfo(e.target.value, 'descZH')}/>
      </FromItem>
      <FromItem title="Total Raise($)" desc={<span><FormattedMessage id="applicationText27" values={{
        percentage: <strong>20%</strong>
      }}/> </span>}>
        <Input className="apply-input" type="number" value={info.totalRaise}
               onInput={e => onChangeInfo(e.target.value, 'totalRaise')}/>
        {!ipfsData && <p className="tip-txt"><FormattedMessage id="applicationText28"/></p>}
      </FromItem>
      {!ipfsData && <Button type="primary" className="create-btn" onClick={onCreate} loading={loading}>Create</Button>}

      {
        showSuccess && (<div className='modal-show'>
          <div className='wrapper'>
            <div className='modal'>
              <div className='modal__box'>
                <div className="nft-create-view">
                  <div className="nft-create-view-title">
                    <img src={SuccessSvg} alt=""/>
                    <p>Create Success</p>
                  </div>
                  <NFTCard nftData={nftData} ipfsData={ipfsData} preView={true}/>
                  <div className="nft-create-view-footer">
                    <span onClick={() => setShowSuccess(false)}>cancel</span>
                    <Button type="primary" size="large" className="apply-btn" onClick={() => setShowInfoPage(false)}>Go
                      to proposal application</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>)
      }
    </div>
  )
}
