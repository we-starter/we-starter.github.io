import React, { useContext, useState } from 'react';
import {formatAmount, numToWei} from '../../utils/format';
import {
    HANDLE_SHOW_CONNECT_MODAL,
    HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
    HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
    HANDLE_TX_STATUS,
    REQUESTING_DATA,
    waitingForApprove,
    waitingForConfirm,
    waitingForInit,
    waitingPending,
} from '../../const';
import { getContract, useActiveWeb3React } from '../../web3';
import { mainContext } from '../../reducer';
import { useStakingInfo } from './Hooks';
import ERC20 from '../../web3/abi/ERC20.json';
import StakingReward from '../../web3/abi/StakingReward.json';
import { StakeModal, WithdrawModal } from '../../components/Modals';
import Web3 from 'web3';
import WAR from '../../assets/logo/war.svg';

export const StakingItem = ({ info, double }) => {
    const { toWei } = Web3.utils;

    const { account, active, library } = useActiveWeb3React();
    const { dispatch } = useContext(mainContext);

    const [amount, setAmount] = useState();

    const [staking, setStaking] = useState(false);
    const [withdrawing, setWithdrawing] = useState(false);

    const stakingInfo = useStakingInfo(info);

    const onStake = async () => {
        console.log('on stake launch');
        if (!amount) {
            return;
        }
        const tokenContract = getContract(library, ERC20.abi, info.address);
        const contract = getContract(
            library,
            StakingReward,
            info.stakingAddress
        );
        const weiAmount = numToWei(amount, info.decimals);

        console.log('starting Staking glf', account, weiAmount);
        dispatch({
            type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
            showWaitingWalletConfirmModal: waitingForApprove,
        });
        try {
            if (info.address) {
                await tokenContract.methods
                    .approve(info.stakingAddress, weiAmount)
                    .send({ from: account });
                dispatch({
                    type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                    showWaitingWalletConfirmModal: waitingForConfirm,
                });
            }

            console.log('stakingFunc', contract);
            if (info.address) {
                await contract.methods
                    .stake(weiAmount)
                    .send({ from: account })
                    .on('transactionHash', (hash) => {
                        //setTxHash(hash)
                        dispatch({
                            type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                            showWaitingWalletConfirmModal: {
                                ...waitingPending,
                                hash,
                            },
                        });
                    })
                    .on('receipt', (_, receipt) => {
                        console.log('BOT staking success');
                        setStaking(false);
                        //setStaked(true)
                        dispatch({
                            type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                            showWaitingWalletConfirmModal: waitingForInit,
                        });
                        dispatch({
                            type: HANDLE_TX_STATUS,
                            txStatus: 'success',
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
                        dispatch({
                            type: HANDLE_TX_STATUS,
                            txStatus: 'failed',
                        });
                    });
            } else {
                await contract.methods
                    .stakeEth()
                    .send({ from: account, value: weiAmount })
                    .on('transactionHash', (hash) => {
                        //setTxHash(hash)
                        dispatch({
                            type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                            showWaitingWalletConfirmModal: {
                                ...waitingPending,
                                hash,
                            },
                        });
                    })
                    .on('receipt', (_, receipt) => {
                        console.log('BOT staking success');
                        setStaking(false);
                        //setStaked(true)
                        dispatch({
                            type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                            showWaitingWalletConfirmModal: waitingForInit,
                        });
                        dispatch({
                            type: HANDLE_TX_STATUS,
                            txStatus: 'success',
                        });
                    })
                    .on('error', (err, receipt) => {
                        console.log('BOT staking error', err);
                        dispatch({
                            type: HANDLE_TX_STATUS,
                            txStatus: 'failed',
                        });
                        dispatch({
                            type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                            showWaitingWalletConfirmModal: waitingForInit,
                        });
                    });
            }
        } catch (err) {
            dispatch({
                type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                showWaitingWalletConfirmModal: waitingForInit,
            });
            if (err.code === 4001) {
                dispatch({
                    type: HANDLE_TX_STATUS,
                    txStatus: 'rejected',
                });
            } else {
                dispatch({
                    type: HANDLE_TX_STATUS,
                    txStatus: 'failed',
                });
            }
            console.log('err', err);
        }
    };

    const onWithdraw = async () => {
        const contract = getContract(
            library,
            StakingReward,
            info.stakingAddress
        );
        dispatch({
            type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
            showWaitingWalletConfirmModal: waitingForConfirm,
        });
        try {
            await contract.methods
                .exit()
                .send({ from: account })
                .on('transactionHash', (hash) => {
                    dispatch({
                        type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                        showWaitingWalletConfirmModal: {
                            ...waitingPending,
                            hash,
                        },
                    });
                })
                .on('receipt', (_, receipt) => {
                    console.log('glf staking success');
                    setWithdrawing(false);
                    dispatch({
                        type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                        showWaitingWalletConfirmModal: waitingForInit,
                    });
                    dispatch({
                        type: HANDLE_TX_STATUS,
                        txStatus: 'success',
                    });
                })
                .on('error', (err, receipt) => {
                    console.log('glf staking error', err);
                    dispatch({
                        type: HANDLE_TX_STATUS,
                        txStatus: 'failed',
                    });
                    dispatch({
                        type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                        showWaitingWalletConfirmModal: waitingForInit,
                    });
                });
        } catch (err) {
            dispatch({
                type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                showWaitingWalletConfirmModal: waitingForInit,
            });
            if (err.code === 4001) {
                dispatch({
                    type: HANDLE_TX_STATUS,
                    txStatus: 'rejected',
                });
            } else {
                dispatch({
                    type: HANDLE_TX_STATUS,
                    txStatus: 'failed',
                });
            }
            console.log('err', err);
        }
    };

    const onClaim = async () => {
        const contract = getContract(
            library,
            StakingReward,
            info.stakingAddress
        );
        dispatch({
            type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
            showWaitingWalletConfirmModal: waitingForConfirm,
        });
        try {
            await contract.methods
                .getReward()
                .send({ from: account })
                .on('transactionHash', (hash) => {
                    dispatch({
                        type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                        showWaitingWalletConfirmModal: {
                            ...waitingPending,
                            hash,
                        },
                    });
                })
                .on('receipt', (_, receipt) => {
                    console.log('glf claim rewards success');
                    dispatch({
                        type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                        showWaitingWalletConfirmModal: waitingForInit,
                    });
                    dispatch({
                        type: HANDLE_TX_STATUS,
                        txStatus: 'success',
                    });
                })
                .on('error', (err, receipt) => {
                    dispatch({
                        type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                        showWaitingWalletConfirmModal: waitingForInit,
                    });
                    dispatch({
                        type: HANDLE_TX_STATUS,
                        txStatus: 'failed',
                    });
                });
        } catch (err) {
            dispatch({
                type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                showWaitingWalletConfirmModal: waitingForInit,
            });
            if (err.code === 4001) {
                dispatch({
                    type: HANDLE_TX_STATUS,
                    txStatus: 'rejected',
                });
            } else {
                dispatch({
                    type: HANDLE_TX_STATUS,
                    txStatus: 'failed',
                });
            }
            console.log('err', err);
        }
    };

    return (
        <div className='statistics__item column'>
            <div className='statistics__header'>
                <p>
                    {info.logo}
                    {info.title}
                </p>
                {info.multiple}
            </div>

            <dl className='statistics__dl'>
                <div className='statistics__dl-column'>
                    <dd className='statistics__dl-dd'>抵押总量</dd>
                    <dt className='statistics__dl-dt'>
                        {stakingInfo
                            ? formatAmount(stakingInfo.earnedTotal, info.decimals)
                            : REQUESTING_DATA}
                        {stakingInfo && <p>{info.symbol}</p>}
                    </dt>
                </div>
            </dl>


            <dl className='statistics__dl'>
                <div className='statistics__dl-column'>
                    <dd className='statistics__dl-dd'>我的抵押</dd>
                    <dt className='statistics__dl-dt'>
                        {stakingInfo
                            ? formatAmount(stakingInfo.staked, info.decimals)
                            : REQUESTING_DATA}
                        {stakingInfo && <p>{info.symbol}</p>}
                    </dt>
                </div>

                    <div className='statistics__dl-column'>
                        <dd className='statistics__dl-dd'>余额</dd>
                        <dt className='statistics__dl-dt'>
                            {stakingInfo
                                ? formatAmount(stakingInfo.balance, info.decimals)
                                : REQUESTING_DATA}
                            {stakingInfo && <p>{info.symbol}</p>}
                        </dt>
                    </div>
            </dl>

            <dl className='statistics__dl'>
                <div className='statistics__dl-column'>
                    <dd className='statistics__dl-dd'>收益</dd>
                    <dt className='statistics__dl-dt'>
                        <img src={WAR} />
                        {stakingInfo
                            ? formatAmount(stakingInfo.earned)
                            : REQUESTING_DATA}
                        {stakingInfo && <p>{'WAR'}</p>}
                    </dt>
                </div>

                {/*{double && (*/}
                {/*    <div className='statistics__dl-column'>*/}
                {/*        <dd className='statistics__dl-dd right'>APY</dd>*/}
                {/*        <dt className='statistics__dl-dt right'>*/}
                {/*            {stakingInfo*/}
                {/*                ? formatAmount(stakingInfo.earned)*/}
                {/*                : REQUESTING_DATA}*/}
                {/*        </dt>*/}
                {/*    </div>*/}
                {/*)}*/}
            </dl>

            <div className='button-row'>
                <button
                    disabled={!stakingInfo}
                    className='statistics__btn btn'
                    onClick={() => {
                        if (!active) {
                            dispatch({
                                type: HANDLE_SHOW_CONNECT_MODAL,
                                showConnectModal: true,
                            });
                            return;
                        }
                        setStaking(true);
                    }}>
                    Approve Stake
                </button>
                <button
                    disabled={!stakingInfo}
                    className='statistics__btn btn'
                    onClick={() => {
                        if (!active) {
                            dispatch({
                                type: HANDLE_SHOW_CONNECT_MODAL,
                                showConnectModal: true,
                            });
                            return;
                        }
                        onClaim();
                    }}>
                    Claim
                </button>
            </div>

            <button
                disabled={!stakingInfo}
                className='statistics__btn btn'
                onClick={() => {
                    if (!active) {
                        dispatch({
                            type: HANDLE_SHOW_CONNECT_MODAL,
                            showConnectModal: true,
                        });
                        return;
                    }
                    setWithdrawing(true);
                }}>
                Unstake &Claim
            </button>

            {staking && (
                <div className='modal-show'>
                    <div className='wrapper'>
                        <StakeModal
                            info={info}
                            amount={amount}
                            symbol={info.symbol}
                            tokenName={'Gallery Token'}
                            balance={stakingInfo.balance}
                            onChange={(e) => {
                                setAmount(e.target.value);
                            }}
                            onMax={() => {
                                setAmount(formatAmount(stakingInfo.balance, info.decimals));
                            }}
                            onConfirm={onStake}
                            onCancel={() => {
                                setStaking(false);
                            }}
                        />
                    </div>
                </div>
            )}

            {withdrawing && (
                <div className='modal-show'>
                    <div className='wrapper'>
                        <WithdrawModal
                            onDismiss={() => setWithdrawing(false)}
                            onWithdraw={onWithdraw}
                            info={info}
                            stakingInfo={stakingInfo}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
