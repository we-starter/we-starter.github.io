import React, {useContext, useState} from 'react'
import {usage} from 'browserslist'
import {formatAmount} from '../../utils/format'
import {Select} from 'antd'
import {useBalance} from "../../pages/Hooks";
import {getPointAddress} from "../../web3/address";
import Web3 from 'web3'
import {getContract, useActiveWeb3React} from "../../web3";
import Starter from "../../web3/abi/Starter.json";
import {
    HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
    HANDLE_SHOW_TRANSACTION_MODAL,
    HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
    waitingForInit,
    waitingPending
} from "../../const";
import {mainContext} from "../../reducer";
import BigNumber from "bignumber.js";

const {Option} = Select

export const PoolsJoin = ({
                              icon,
                              onClose,
                              pool,
                          }) => {
    const {account, active, library, chainId} = useActiveWeb3React();
    const {dispatch} = useContext(mainContext);
    const [amount, setAmount] = useState('')
    const currency_address = pool ? pool.currency.address : '0x0000000000000000000000000000000000000000'
    const {balance = 0} = useBalance(currency_address)

    const handleChange = (value) => {
        console.log(`selected ${value}`)
    }
    const onMax = () => {
        setAmount(parseFloat(Web3.utils.fromWei(balance, 'ether')).toFixed(6) * 1)
    }

    const onChange = (e) => {
        const {value} = e.target
        setAmount(value * 1)
    }

    const onConfirm = (e) => {

        const pool_contract = getContract(
            library,
            Starter,
            pool.address
        );
        const amount_wei = Web3.utils.toWei(`${amount}`, 'ether')
        if(amount_wei )
        pool_contract.methods.purchase(Web3.utils.toWei(`${amount}`, 'ether')).send({
            from: account
        }).on('transactionHash', hash => {
            dispatch({
                type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                showWaitingWalletConfirmModal: {...waitingPending, hash}
            });
        }).on('receipt', (_, receipt) => {
            console.log('BOT staking success')
            dispatch({
                type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                showWaitingWalletConfirmModal: waitingForInit
            });
            dispatch({
                type: HANDLE_SHOW_TRANSACTION_MODAL,
                showTransactionModal: true
            });
        }).on('error', (err, receipt) => {
            console.log('BOT staking error', err)
            dispatch({
                type: HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
                showFailedTransactionModal: true
            });
            dispatch({
                type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                showWaitingWalletConfirmModal: waitingForInit
            });
        })
        onClose()
    }

    return (
        <div className='modal'>
            <div className='modal__box'>
                <form className='form-app' action='/'>
                    <div className='form-app__inner deposit'>
                        <h1
                            className='form-app__title h3'
                            style={{marginTop: 0, marginBottom: '10px'}}
                        >
                            Join {pool && pool.underlying.symbol} Pool
                        </h1>
                        <p className='form-app__tip'>{pool && pool.ratio}</p>
                        {/*<Select*/}
                        {/*  defaultValue='lucy'*/}
                        {/*  style={{ width: 120 }}*/}
                        {/*  onChange={handleChange}*/}
                        {/*>*/}
                        {/*  <Option value='jack'>*/}
                        {/*    /!* <GLFIcon width={24} height={24} />*/}
                        {/*    {icon} *!/*/}
                        {/*    Jack*/}
                        {/*  </Option>*/}
                        {/*  <Option value='lucy'>Lucy</Option>*/}
                        {/*  <Option value='Yiminghe'>yiminghe</Option>*/}
                        {/*</Select>*/}
                        <p
                            className='form-app__inputbox-after-text'
                            style={{
                                marginBottom: 0,
                                color: '#22292F',
                                textAlign: 'left',
                                opacity: 1,
                            }}
                        >
                            Balance:{' '}
                            {balance && pool && `${formatAmount(balance)} ${pool.currency.symbol}`} <br/>
                        </p>
                        <div className='deposit__inputbox form-app__inputbox'>
                            <div className='form-app__inputbox-control'>
                                <div className='form-app__inputbox-input'>
                                    <input
                                        value={amount}
                                        onChange={onChange}
                                        className='input'
                                        placeholder='输入投资金额'
                                    />
                                </div>

                                <div className='form-app__inputbox-up' onClick={onMax}>
                                    <div className='form-app__inputbox-up-pref'>Max</div>
                                </div>
                            </div>
                        </div>

                        <div className='form-app__submit form-app__submit--row'>
                            <button
                                className='btn btn--outline btn--medium'
                                type='button'
                                onClick={onClose}
                            >
                                Cancel
                            </button>

                            <button
                                type='button'
                                className='btn btn--medium'
                                onClick={onConfirm}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
