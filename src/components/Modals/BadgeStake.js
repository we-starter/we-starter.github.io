import React, {useMemo, useState} from 'react';

import Web3 from 'web3';
import cs from "classnames";
import {FormattedMessage, injectIntl} from "react-intl";
import {Button, message, Spin} from "antd";
import {getContract, useActiveWeb3React} from "../../web3";
import {getOnlyMultiCallProvider, processResult} from "../../utils/multicall";
import {Contract} from "ethers-multicall-x";
import ERC20 from '../../web3/abi/ERC20.json'
import {formatAmount, fromWei} from "../../utils/format";
import {GAS_FEE} from "../../web3/address";

function BadgeStake({pool, visible, setVisible, intl}) {
  const [isApprovalToken, setIsApprovalToken] = useState(false)
  const [isApprovalNFT, setIsApprovalNFT] = useState(false)
  const [amount, setAmount] = useState('0')
  useMemo(() =>{
    setAmount(fromWei(pool.quotaOf, pool.currency.decimal))
  }, [pool.quotaOf])
  const {account, library, chainId} = useActiveWeb3React()
  const [loading, setLoading] = useState(false)
  const [loadLoading, setLoadLoading] = useState(false)
  const [popupData,setPopupData] = useState(() => {
    return {
      tokenId: '',
      currencyBalanceOf: '-'
    }
  })
  const getData = () => {
    setLoadLoading(true)
    const multicall = getOnlyMultiCallProvider(pool.networkId)
    const nft_contract = new Contract(pool.nft.address, pool.nft.abi)
    const currency_contract = new Contract(pool.currency.address, ERC20.abi)
    multicall.all([nft_contract.tokenOfOwnerByIndex(account, 0), currency_contract.balanceOf(account)]).then(data => {
      data = processResult(data)
      setPopupData({
        tokenId: data[0],
        currencyBalanceOf: formatAmount(data[1], pool.currency.decimal, 6)
      })
      setLoadLoading(false)
    })
  }
  const getApproval = async () => {
    setLoadLoading(true)
    const multicall = getOnlyMultiCallProvider(pool.networkId)
    const nft_contract = new Contract(pool.nft.address, pool.nft.abi)
    const currency_contract = new Contract(pool.currency.address, ERC20.abi)
    const calls = [
      nft_contract.getApproved(popupData.tokenId),
      currency_contract.allowance(account, pool.address)
    ]
    multicall.all(calls).then(data => {
      data = processResult(data)
      setIsApprovalNFT(data[0] === pool.address)
      setIsApprovalToken(data[1] > 0)
      setLoading(false)
      setLoadLoading(false)
    })
  }
  useMemo(()=>{
    if (visible){
      getData()
    }
  }, [visible, account])
  useMemo(()=>{
    if (popupData.tokenId){
      getApproval()
    }
  }, [popupData.tokenId])

  // const onMax = () => {
  //   const quotaOf = pool.quotaOf ? numToWei(pool.quotaOf, pool.currency.decimal) : 0
  //   const currencyBalanceOf = popupData.currencyBalanceOf !== '-' ? popupData.currencyBalanceOf : 0
  //   setAmount(Math.min(quotaOf, currencyBalanceOf))
  // }

  const onApproveNFT = () => {
    setLoading(true)
    const contract = getContract(library, pool.nft.abi, pool.nft.address)
    contract.methods
      .approve(pool.address, popupData.tokenId)
      .send({
        from: account,
        ...GAS_FEE(chainId)
      })
      .on('receipt', async (_, receipt) => {
        await getApproval()
        setLoading(false)
      })
      .on('error', (err, receipt) => {
        setLoading(false)
      })
  }

  const onApproveToken = () => {
    setLoading(true)
    const contract = getContract(library, ERC20.abi, pool.currency.address)
    contract.methods
      .approve(pool.address, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
      .send({
        from: account,
        ...GAS_FEE(chainId)
      })
      .on('receipt', async (_, receipt) => {
        await getApproval()
        setLoading(false)
      })
      .on('error', (err, receipt) => {
        setLoading(false)
      })
  }

  const onConfirm = () => {
    setLoading(true)
    const contract = getContract(library, pool.abi, pool.address)
    contract.methods
      .offer(popupData.tokenId)
      .send({
        from: account,
        ...GAS_FEE(chainId)
      })
      .on('receipt', async (_, receipt) => {
        message.success('success')
        setLoading(false)
        setVisible(false)
      })
      .on('error', (err, receipt) => {
        setLoading(false)
      })
  }

  if (!visible) {
    return null
  }
  return (
    <div className='modal-show'>
      <div className='wrapper'>
        <div className='modal'>
          <div className='modal__box'>
              <form className='form-app farm_popup' action='/'>
                <div className='form-app__inner deposit farm_popup_box badge-stake-popup'>
                  <div className="badge-stake-popup-title">
                    <div>Join {pool.name}</div>
                    <a className='farm_popup_close_btn' onClick={() => setVisible(false)}></a>
                  </div>
                  <p className="badge-stake-popup-ratio">{pool.ratio}</p>

                  <Spin spinning={loadLoading}>
                  <div className="badge-stake-popup-card">
                    <img src={pool.nft.icon} alt=""/>
                    <div>
                      <h2>{pool.nft.name}</h2>
                      <p>ID {popupData.tokenId}</p>
                    </div>
                  </div>
                  <div className="badge-stake-popup-avaliable">
                    <div><FormattedMessage id="farm4"/></div>
                    <strong>{popupData.currencyBalanceOf} {pool.currency.symbol}</strong>
                  </div>
                  <div className='deposit__inputbox form-app__inputbox'>
                    <div className='form-app__inputbox-control'>
                      <div className='form-app__inputbox-input'>
                        <input
                          disabled
                          value={amount}
                          onChange={e=>setAmount(e.target.value)}
                          className='input'
                          placeholder={intl.formatMessage({
                            id: 'farm15',
                          })}
                        />
                      </div>

                      {/*<div
                      className={cs(
                        `form-app__inputbox-up`
                      )}
                      onClick={onMax}
                    >
                      <div
                        className={cs(
                          `form-app__inputbox-up-pref`
                        )}
                      >
                        <FormattedMessage id='poolText19'/>
                      </div>
                    </div>*/}
                    </div>
                  </div>
                  {
                    isApprovalNFT ? isApprovalToken ? (
                      <Button type="button" className={`ant-btn ant-btn-primary  ant-btn-primary_${pool.networkId}`} loading={loading} onClick={onConfirm}>Confirm</Button>
                    ) : (
                      <Button type="button" className={`ant-btn ant-btn-primary ant-btn-primary_${pool.networkId}`} loading={loading} onClick={onApproveToken}>Approve {pool.currency.symbol}</Button>
                    ) : (
                      <Button type="button" className={`ant-btn ant-btn-primary ant-btn-primary_${pool.networkId}`} loading={loading} onClick={onApproveNFT}>Approve {pool.nft.name} NFT</Button>
                    )
                  }
                  </Spin>
                </div>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default injectIntl(BadgeStake)
