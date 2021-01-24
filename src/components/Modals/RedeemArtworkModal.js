import React, {useContext} from "react";

import { CrossModalIcon } from "../../icons";
import {useBalance} from "../../pages/Hooks";
import {getFigureSwapAddress, getGalleryAddress, getGLFStakingAddress, getPointAddress} from "../../web3/address";
import {getContract, useActiveWeb3React} from "../../web3";
import {formatAmount} from "../../utils/format";
import ERC20 from "../../web3/abi/ERC20.json";
import FigureSwap from "../../web3/abi/FigureSwap.json";
import {
    HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
    HANDLE_SHOW_TRANSACTION_MODAL,
    HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
    waitingForConfirm,
    waitingForInit,
    waitingPending
} from "../../const";
import {mainContext} from "../../reducer";

export const RedeemArtworkModal = ({ setIsOpen, figure }) => {

    const {account, active, library, chainId} = useActiveWeb3React()
    const {dispatch} = useContext(mainContext);

    const {balance} = useBalance(getPointAddress(chainId))

    const onSwap = async () => {
        console.log('on swap',figure.points, figure.proposalId, figure.figureId)
        const tokenContract = getContract(library, ERC20.abi, getPointAddress(chainId))
        const contract = getContract(library, FigureSwap.abi, getFigureSwapAddress(chainId))

        setIsOpen(false)
        try {
            dispatch({
                type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                showWaitingWalletConfirmModal: waitingForConfirm
            });
             await tokenContract.methods.approve(
                getFigureSwapAddress(chainId),
                figure.points,
            )
                .send({from: account});

            dispatch({
                type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                showWaitingWalletConfirmModal: waitingForConfirm
            });

            await contract.methods.swap(figure.proposalId, figure.figureId)
                .send({from: account})
                .on('transactionHash', hash => {
                    dispatch({
                        type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                        showWaitingWalletConfirmModal: {...waitingPending, hash}
                    });
                })
                .on('receipt', (_, receipt) => {
                    console.log('BOT staking success')
                    dispatch({
                        type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                        showWaitingWalletConfirmModal: waitingForInit
                    });
                    dispatch({
                        type: HANDLE_SHOW_TRANSACTION_MODAL,
                        showTransactionModal: true
                    });
                })
                .on('error', (err, receipt) => {
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

        } catch (err) {
            dispatch({
                type: HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
                showWaitingWalletConfirmModal: waitingForInit
            });
            if (err.code === 4001) {
                dispatch({
                    type: HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
                    showFailedTransactionModal: true
                });
            } else {
                dispatch({
                    type: HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
                    showFailedTransactionModal: true
                });
            }
            console.log('err', err);
        }
    };


    return (
        <div className="modal">
            <div className="modal__box">
                <div className="modal__item modal__item--vote-img">
                    <form
                        className="form-vote-new form-app"
                        action="/"
                        noValidate="novalidate"
                    >
                        <h3 className="modal__title h3">Redeem an Artwork</h3>

                        <div className="form-vote-new__img">
                            <picture>
                                <img
                                    src={figure.image}
                                    alt=""
                                    loading="lazy"
                                    width="180"
                                    height="115"
                                />
                            </picture>
                        </div>

                        <table className="form-vote__table">
                            <tbody>
                                <tr>
                                    <th>Name:</th>
                                    <td>{figure.title}</td>
                                </tr>
                                <tr>
                                    <th>Details:</th>
                                    <td>{figure.description}</td>
                                </tr>
                            </tbody>
                        </table>

                        <p className="form-app__note">
                            <b>{balance && formatAmount(balance)}</b> Reward Points will be spent to redeem this
                            artwork. You have <b>{ figure.points && formatAmount(figure.points)}</b> Reward Points now.
                        </p>

                        <div className="form-app__submit form-app__submit--row">
                            <button
                                className="btn btn--outline btn--medium modal__close"
                                type="button"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </button>
                            <button className="btn btn--medium" type="button" onClick={onSwap}>
                                Redeem
                            </button>
                        </div>
                    </form>
                </div>

                <button
                    type="button"
                    className="modal__close modal__close-btn button"
                    aria-label="Close modal"
                    onClick={() => setIsOpen(false)}
                >
                    <CrossModalIcon />
                </button>
            </div>
        </div>
    );
};
