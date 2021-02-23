import React, { useContext, useEffect, useState } from 'react';
import { usage } from 'browserslist';
import { formatAmount } from '../../utils/format';
import { Select } from 'antd';
import { useBalance } from '../../pages/Hooks';
import { getPointAddress } from '../../web3/address';
import Web3 from 'web3';
import { getContract, useActiveWeb3React } from '../../web3';
import Starter from '../../web3/abi/Starter.json';
import { injectIntl } from 'react-intl';
import ERC20 from '../../web3/abi/ERC20.json';
import { FormattedMessage } from 'react-intl';

import {
    HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
    HANDLE_SHOW_TRANSACTION_MODAL,
    HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
    waitingForInit,
    waitingPending,
} from '../../const';
import { mainContext } from '../../reducer';
import BigNumber from 'bignumber.js';

const { Option } = Select;

const PoolsJoin = (props) => {
    const { intl, icon, onClose, pool } = props;
    const { account, active, library, chainId } = useActiveWeb3React();
    const { dispatch } = useContext(mainContext);
    const [approve, setApprove] = useState(true);
    const [amount, setAmount] = useState('');
    const currency_address = pool
        ? pool.currency.address
        : '0x0000000000000000000000000000000000000000';
    const { balance = 0 } = useBalance(currency_address);

    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    useEffect(() => {
        if (pool && pool.currency.allowance > 0) {
            setApprove(false);
        }
    }, [pool]);

    const onMax = () => {
        setAmount(
            parseFloat(Web3.utils.fromWei(balance, 'ether')).toFixed(6) * 1
        );
    };

    const onChange = (e) => {
        const { value } = e.target;
        const re = /^[0-9]+([.|,][0-9]+)?$/g;
        if (
            value === '' ||
            re.test(value) ||
            (value.split('.').length === 2 &&
                value.slice(value.length - 1) === '.')
        ) {
            setAmount(value);
        }
    };

    const onApprove = (e) => {
        const contract = getContract(library, ERC20.abi, pool.currency.address);
        contract.methods
            .approve(
                pool.address,
                '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
            )
            .send({
                from: account,
            })
            .on('transactionHash', (hash) => {
                dispatch({
                    type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                    showWaitingWalletConfirmModal: { ...waitingPending, hash },
                });
            })
            .on('receipt', (_, receipt) => {
                console.log('approve success');
                dispatch({
                    type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                    showWaitingWalletConfirmModal: waitingForInit,
                });
                dispatch({
                    type: HANDLE_SHOW_TRANSACTION_MODAL,
                    showTransactionModal: true,
                });
                setApprove(false);
            })
            .on('error', (err, receipt) => {
                console.log('approve error', err);
                dispatch({
                    type: HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
                    showFailedTransactionModal: true,
                });
                dispatch({
                    type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                    showWaitingWalletConfirmModal: waitingForInit,
                });
            });
    };

    const onConfirm = (e) => {
        const pool_contract = getContract(library, Starter, pool.address);
        pool_contract.methods
            .purchase(Web3.utils.toWei(`${amount}`, 'ether'))
            .send({
                from: account,
            })
            .on('transactionHash', (hash) => {
                dispatch({
                    type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                    showWaitingWalletConfirmModal: { ...waitingPending, hash },
                });
            })
            .on('receipt', (_, receipt) => {
                console.log('BOT staking success');
                dispatch({
                    type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                    showWaitingWalletConfirmModal: waitingForInit,
                });
                dispatch({
                    type: HANDLE_SHOW_TRANSACTION_MODAL,
                    showTransactionModal: true,
                });
            })
            .on('error', (err, receipt) => {
                console.log('BOT staking error', err);
                dispatch({
                    type: HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
                    showFailedTransactionModal: true,
                });
                dispatch({
                    type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                    showWaitingWalletConfirmModal: waitingForInit,
                });
            });
        onClose();
    };

    return (
        <div className='modal'>
            <div className='modal__box'>
                <form className='form-app' action='/'>
                    <div className='form-app__inner deposit'>
                        <h1
                            className='form-app__title h3'
                            style={{ marginTop: 0, marginBottom: '10px' }}>
                            <FormattedMessage id='poolText16' />
                            {pool && pool.underlying.symbol}
                            <FormattedMessage id='poolText17' />
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
                            }}>
                            <FormattedMessage id='poolText18' />
                            {balance &&
                                pool &&
                                `${formatAmount(balance)} ${
                                    pool.currency.symbol
                                }`}
                            <br />
                        </p>
                        <div className='deposit__inputbox form-app__inputbox'>
                            <div className='form-app__inputbox-control'>
                                <div className='form-app__inputbox-input'>
                                    <input
                                        value={amount}
                                        onChange={onChange}
                                        className='input'
                                        placeholder={intl.formatMessage({
                                            id: 'money',
                                        })}
                                    />
                                </div>

                                <div
                                    className='form-app__inputbox-up'
                                    onClick={onMax}>
                                    <div className='form-app__inputbox-up-pref'>
                                        <FormattedMessage id='poolText19' />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='form-app__submit form-app__submit--row'>
                            <button
                                className='btn btn--outline btn--medium'
                                type='button'
                                onClick={onClose}>
                                <FormattedMessage id='poolText20' />
                            </button>
                            {approve ? (
                                <button
                                    type='button'
                                    className='btn btn--medium'
                                    onClick={onApprove}>
                                    <FormattedMessage id='poolText21' />
                                </button>
                            ) : (
                                <button
                                    type='button'
                                    className='btn btn--medium'
                                    onClick={onConfirm}>
                                    <FormattedMessage id='poolText22' />
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default injectIntl(PoolsJoin);
