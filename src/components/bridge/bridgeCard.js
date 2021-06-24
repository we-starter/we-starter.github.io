import React, {useContext, useEffect, useMemo, useState} from 'react'
import cs from 'classnames'
import { Button, message } from 'antd'
import { getContract, useActiveWeb3React } from '../../web3'
import { mainContext } from '../../reducer'
import { FormattedMessage, injectIntl } from 'react-intl'
import BigNumber from 'bignumber.js'
import { formatAmount, fromWei, numToWei } from '../../utils/format'
import Web3 from 'web3'
import {
  HANDLE_WALLET_MODAL
} from '../../const'
import { getRandomIntInclusive } from '../../utils/index'
import WAR from '../../assets/icon/WAR@2x.png'
import BSC from '../../assets/icon/BSC@2x.png'
import HECO from '../../assets/icon/HECO@2x.png'
import SwapLine from '../../assets/icon/swap-line@2x.png'
import {useBalance} from "../../pages/Hooks"
import {ChainId, WAR_ADDRESS, CHAIN_SWAP_ADDRESS, RPC_URLS, CHAIN_SWAP_NODE_REQ_URL} from "../../web3/address"
import ChainSwapAbi from '../../web3/abi/ChainSwap.json'
import {changeNetwork} from "../../connectors"
import qs from 'qs'
import axios from "axios"

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

    const [pledgeHistory, setPledgeHistory] = useState([])
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
     * 无需授权，直接质押
     */
    const onApprove = () => {
        if (chainId !== ChainId.HECO) {
            changeNetwork(ChainId.HECO).then((e) => {})
        } else {
            onPledge()
        }
    }

    /**
     * 质押
     */
    const onPledge = () => {
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

    /**
     * 获取跨链数据
     */
    const getCrossChainData = () => {
        var web3HECO = new Web3(new Web3.providers.HttpProvider(RPC_URLS(ChainId.HECO)));
        let fromContract = new web3HECO.eth.Contract(ChainSwapAbi, RPC_URLS(ChainId.HECO));
        var web3BSC = new Web3(new Web3.providers.HttpProvider(RPC_URLS(ChainId.BSC)));
        let toContract = new web3BSC.eth.Contract(ChainSwapAbi, RPC_URLS(ChainId.BSC));

        // 查询 源链 ChainSwap合约中 sentCount(toChainId, to) ，得到 maxNonce
        const getMaxNonce = (toChainId, fromChainId, callback) => {
            fromContract.methods.sentCount(toChainId, account).call().then(maxNonce => {
                callback(toChainId, fromChainId, maxNonce)
            })
        }

        // 查询所有质押的数据，遍历 源链
        const getPledgeData = (toChainId, fromChainId, maxNonce) => {
            let nonce = 0
            let historyData = []
            do {
                (function (nonce){
                    fromContract.methods.sent(toChainId, account, nonce).call({
                        from: account,
                    }).then(pledgeAmount => {
                        toContract.methods.received(fromChainId, account, nonce).call({
                            from: account,
                        }).then( extractAmount => {
                            historyData.push({
                                nonce,
                                pledgeAmount: web3BSC.utils.fromWei(pledgeAmount, 'ether'),
                                extractAmount: web3BSC.utils.fromWei(extractAmount, 'ether'),
                                fromChainId,
                                toChainId,
                                account,

                            })
                            if (historyData.length === ~~maxNonce + 1) {
                                console.log(historyData)
                                setPledgeHistory(historyData)
                            }
                        })
                    })
                })(nonce)
            } while (++nonce <= maxNonce)
        }
        const toChainId = ChainId.BSC
        const fromChainId = ChainId.HECO
        getMaxNonce(toChainId, fromChainId, getPledgeData)
    }


    return (
      <div className='bridge_card'>
        <div className='bridge_card_title'>
          <FormattedMessage id='bridge1' />
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
            <p className='bridge_card_from_text'><FormattedMessage id='bridge7' /></p>
            <p className='bridge_card_from_chain'>
              <img src={HECO} />
              Heco
            </p>
          </div>
          <img className='bridge_card_transform' src={SwapLine} />
          <div className='bridge_card_from'>
            <p className='bridge_card_from_text'><FormattedMessage id='bridge8' /></p>
            <p className='bridge_card_from_chain'>
              <img src={BSC} />
              Binance Smart Chain
            </p>
          </div>
        </div>
        <p className='bridge_card_input_title'><FormattedMessage id='bridge2' /></p>
        <div className='deposit__inputbox form-app__inputbox'>
          <div className='form-app__inputbox-control'>
            <div className='form-app__inputbox-input'>
              <input
                style={{ background: '#fff' }}
                disabled
                value={account||''}
                className='input'
                placeholder={account}
              />
            </div>

            {/* 地址跳转 */}
            <a className='set_slippage copy_address'>
              <svg
                t='1619095072712'
                className='icon'
                viewBox='0 0 1024 1024'
                version='1.1'
                xmlns='http://www.w3.org/2000/svg'
                p-id='1281'
                width='20'
                height='20'
              >
                <path
                  d='M424.96 128v87.04H215.04v599.04h599.04v-215.04h87.04v256c0 25.6-20.48 40.96-40.96 40.96H168.96c-25.6 0-40.96-20.48-40.96-40.96V168.96c0-25.6 20.48-40.96 40.96-40.96h256z m327.68 87.04h-194.56V128h343.04v343.04h-87.04V271.36L512 573.44 450.56 512l302.08-296.96z'
                  p-id='1282'
                ></path>
              </svg>
            </a>
          </div>
        </div>

        {approve && (
          <Button
            className={'btn'}
            type='button'
            onClick={onApprove}
          >
            <FormattedMessage id='farm20' />
          </Button>
        )}
        {!approve && (
          <Button
            className={'btn'}
            type='button'
            onClick={() => {
              dispatch({
                type: HANDLE_WALLET_MODAL,
                walletModal: 'switchWithdraw',
              })
            }}
          >
            <FormattedMessage id='modalsText15' />
          </Button>
        )}
        <div className='lbp_tip'>
          <p>
            <FormattedMessage id='bridge3' />
          </p>
          <p>
            <FormattedMessage id='bridge4' />
          </p>
        </div>
      </div>
    )
}

export default injectIntl(BridgeCard)
