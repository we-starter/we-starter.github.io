import React, { useContext, useEffect, useState } from 'react'
import cs from 'classnames'
import { Button, message } from 'antd'
import { getContract, useActiveWeb3React } from '../../web3'
import { mainContext } from '../../reducer'
import { FormattedMessage, injectIntl } from 'react-intl'
import BigNumber from 'bignumber.js'
import { formatAmount, fromWei, numToWei } from '../../utils/format'
import WAR from '../../assets/icon/WAR@2x.png'
import BSC from '../../assets/icon/BSC@2x.png'
import HECO from '../../assets/icon/HECO@2x.png'
import SwapLine from '../../assets/icon/swap-line@2x.png'
import {useBalance} from "../../pages/Hooks";
import {ChainId, WAR_ADDRESS, CHAIN_SWAP_ADDRESS, RPC_URLS, CHAIN_SWAP_NODE_REQ_URL} from "../../web3/address";
import ChainSwapAbi from '../../web3/abi/ChainSwap.json'
import Web3 from "web3";
import {changeNetwork} from "../../connectors";
import qs from 'qs'
import axios from "axios";

var web3BSC = new Web3(new Web3.providers.HttpProvider(RPC_URLS(ChainId.BSC)));
var web3HECO = new Web3(new Web3.providers.HttpProvider(RPC_URLS(ChainId.HECO)));

const BridgeCard = (props) => {

    const { intl } = props
    const { account, active, library, chainId } = useActiveWeb3React()

    const { balance } = useBalance(WAR_ADDRESS(chainId))
    const [pool, setPool] = useState([])
    const [amount, setAmount] = useState('')
    const [approve, setApprove] = useState(true)
    const [loadFlag, setLoadFlag] = useState(false)
    const [loading, setLoading] = useState(false)

    const { dispatch, state } = useContext(mainContext)

    const [transferData, setTransferData] = useState({})

    const onChange = (e) => {
        const value = e.target.value
        const maxAmount = formatAmount(balance)
        console.log(value, maxAmount, value > maxAmount)
        setAmount(Number(value) > Number(maxAmount) ? maxAmount : value)
    }

    const onMax = () => {
        setAmount(formatAmount(balance))
    }
    /**
     * 无需授权，直接转移
     */
    const onApprove = () => {
        if (chainId !== ChainId.HECO) {
            changeNetwork(ChainId.HECO).then((e) => {})
        } else {
            onTransfer()
        }
    }

    /**
     * 转移
     */
    const onTransfer = () => {
        setLoading(true)
        let web3 = new Web3(window.ethereum);
        let myContract = new web3.eth.Contract(ChainSwapAbi, CHAIN_SWAP_ADDRESS(chainId));
        myContract.methods.send(ChainId.BSC, account, web3.utils.toWei(amount, 'ether')).send({
            from: account,
            value: web3.utils.toWei('0.005', 'ether')
        }).then(() => {
            // save transfer data
            setTransferData({
                fromChainId: chainId
            })
            setLoading(false)
            console.log('success')
        }).catch(error => {
            setLoading(false)
            console.log('fail', error)
        })
    }

    /**
     * 获取签名数据
     */
    const getSignData = (callback) => {
        let signData = {
            contractAddress: CHAIN_SWAP_ADDRESS(chainId),
            toContract: CHAIN_SWAP_ADDRESS(chainId),
            mainContract: CHAIN_SWAP_ADDRESS(chainId),
            fromChainId: transferData.fromChainId,
            fromContract: CHAIN_SWAP_ADDRESS(transferData.fromChainId),
            to: account,
            toChainId: chainId,
        }
        let web3 = new Web3(window.ethereum);
        let myContract = new web3.eth.Contract(ChainSwapAbi, CHAIN_SWAP_ADDRESS(chainId));
        myContract.methods.sentCount(chainId, account).call().then(res =>{
            signData.nonce = res - 1
            transferData.nonce = signData.nonce
            setTransferData(transferData)
            callback(signData)
        }).catch((error) => {
            message.error('sign error')
            console.log('error', error)
        })
    }

    /**
     * 获取签名结果
     */
    const getSignResultData = (callback) => {
        getSignData((signData) => {
            let params = qs.stringify(signData, { encodeValuesOnly: true })
            let signResultData = []
            setLoading(true)
            CHAIN_SWAP_NODE_REQ_URL.map(item => {
                axios.get(item + '?' + params).then(res => {
                    if (signResultData.length === 3 && loading) {
                        setLoading(false)
                        callback(signResultData)
                    } else {
                        let {signatory,signV, signR, signS} = res.data.data
                        signResultData.push([signatory, signV, signR, signS])
                    }
                })
            })
        })
    }

    /**
     * 提取
     */
    const onExtract = () => {
        let web3 = new Web3(window.ethereum);
        let myContract = new web3.eth.Contract(ChainSwapAbi, CHAIN_SWAP_ADDRESS(chainId));
        getSignResultData((signResultData) => {
            myContract.methods.receive([chainId, account, transferData.nonce, web3.utils.toWei(amount, 'ether'), signResultData]).send({
                from: account,
                value: web3.utils.toWei('0.005', 'ether')
            }).then(() => {
                console.log('success')
                message.success('extract success')
            }).catch(error => {
                message.error('extract fail')
                console.log('fail', error)
            })
        })
    }

    const purchaseBtn = () => {}

    return (
      <div className='bridge_card'>
        <div className='bridge_card_title'>
          Migrate to BSC(Binance Smart Chain)
        </div>
        <div className='deposit__inputbox form-app__inputbox'>
          <div className='form-app__inputbox-control'>
            <div className='form-app__inputbox-input'>
              <input
                style={{ background: '#fff' }}
                value={amount}
                type='number'
                onChange={onChange}
                className='input'
                placeholder={intl.formatMessage({
                  id: 'money',
                })}
              />
            </div>

            <div className='form-app__inputbox-up' onClick={onMax}>
              <div className='form-app__inputbox-up-pref'>
                <FormattedMessage id='poolText19' />
              </div>
            </div>
            {/* 选择币种 */}
            <a className='set_slippage'>
              <img src={WAR} />
              WAR
            </a>
          </div>
        </div>
        <div className='bridge_card_from_to'>
          <div className='bridge_card_from'>
            <p className='bridge_card_from_text'>From</p>
            <p className='bridge_card_from_chain'>
              <img src={HECO} />
              Heco
            </p>
          </div>
          <img className='bridge_card_transform' src={SwapLine} />
          <div className='bridge_card_from'>
            <p className='bridge_card_from_text'>To</p>
            <p className='bridge_card_from_chain'>
              <img src={BSC} />
              Binance Smart Chain
            </p>
          </div>
        </div>
        <p className='bridge_card_input_title'>Destination</p>
        <div className='deposit__inputbox form-app__inputbox'>
          <div className='form-app__inputbox-control'>
            <div className='form-app__inputbox-input'>
              <input
                style={{ background: '#fff' }}
                disabled
                value={account||''}
                className='input'
                placeholder={intl.formatMessage({
                  id: 'money',
                })}
              />
            </div>

            {/* 地址跳转 */}
            <a className='set_slippage copy_address'>
              <svg
                t='1619325556317'
                className='icon'
                viewBox='0 0 1024 1024'
                version='1.1'
                p-id='2296'
                width='24'
                height='28'
              >
                <path
                  d='M146.285714 512c0-36.169143 4.022857-71.168 11.556572-104.667429 41.179429 2.486857 80.128-21.650286 100.754285-62.500571a140.8 140.8 0 0 0-2.962285-130.962286c44.214857-49.737143 98.742857-85.76 158.537143-104.704 18.724571 42.057143 56.502857 68.534857 97.792 68.534857s79.067429-26.477714 97.792-68.534857c59.757714 18.944 114.322286 55.003429 158.537142 104.704a140.8 140.8 0 0 0-2.998857 131.035429c20.662857 40.850286 59.611429 64.987429 100.827429 62.464 7.533714 33.462857 11.556571 68.461714 11.556571 104.630857 0 36.169143-4.022857 71.168-11.556571 104.667429-41.216-2.486857-80.128 21.650286-100.790857 62.464a140.8 140.8 0 0 0 2.962285 130.998857c-44.214857 49.737143-98.742857 85.76-158.537142 104.704-18.724571-42.057143-56.502857-68.534857-97.792-68.534857s-79.067429 26.477714-97.792 68.534857c-59.757714-18.944-114.322286-55.003429-158.537143-104.704a140.8 140.8 0 0 0 2.998857-131.035429c-20.662857-40.850286-59.611429-64.987429-100.827429-62.464A477.257143 477.257143 0 0 1 146.285714 512z m175.689143 125.403429a234.788571 234.788571 0 0 1 20.626286 147.273142 286.354286 286.354286 0 0 0 47.433143 31.341715c33.536-34.304 76.946286-53.284571 121.965714-53.248 46.08 0 89.161143 19.675429 121.965714 53.248a286.354286 286.354286 0 0 0 47.433143-31.341715 234.642286 234.642286 0 0 1 20.626286-147.273142c22.491429-44.544 58.550857-78.043429 101.302857-94.061715 1.682286-20.845714 1.682286-41.837714 0-62.683428-42.788571-16.018286-78.848-49.481143-101.339429-94.061715a234.642286 234.642286 0 0 1-20.626285-147.273142 285.696 285.696 0 0 0-47.433143-31.341715c-33.499429 34.304-76.946286 53.284571-121.929143 53.248-44.982857 0-88.429714-18.944-121.965714-53.248-16.64 8.740571-32.548571 19.2-47.433143 31.341715a234.642286 234.642286 0 0 1-20.626286 147.273142c-22.491429 44.544-58.550857 78.043429-101.302857 94.061715-1.682286 20.845714-1.682286 41.837714 0 62.683428 42.788571 16.018286 78.848 49.481143 101.339429 94.061715h-0.036572z m190.025143 0c-60.598857 0-109.714286-56.137143-109.714286-125.403429s49.115429-125.403429 109.714286-125.403429 109.714286 56.137143 109.714286 125.403429-49.115429 125.403429-109.714286 125.403429z m0-83.602286c20.187429 0 36.571429-18.724571 36.571429-41.801143s-16.384-41.801143-36.571429-41.801143-36.571429 18.724571-36.571429 41.801143 16.384 41.801143 36.571429 41.801143z'
                  p-id='2297'
                ></path>
              </svg>
            </a>
          </div>
        </div>

        {approve && (
          <Button
            className={'btn'}
            type='button'
            loading={loadFlag}
            onClick={onApprove}
          >
            <FormattedMessage id='farm20' />
          </Button>
        )}
        {!approve && (
          <Button
            className={'btn'}
            type='button'
            loading={loadFlag}
            onClick={purchaseBtn}
          >
            <FormattedMessage id='warLBP2' />
          </Button>
        )}
        <div className='lbp_tip'>
          <p>
            <a href={pool.farm_link} target='_blank'>
              Powered by BlackHole & ChainSwap
            </a>{' '}
          </p>
        </div>
      </div>
    )
}

export default injectIntl(BridgeCard)
