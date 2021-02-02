import React, { useContext, useEffect } from 'react';
import { WalletConnect } from '../components/account/WalletConnect';
import { useWeb3React } from '@web3-react/core';
import { mainContext } from '../reducer';
import {
    StakeModal,
    UnstakeModal,
    ClaimRewardModal,
    StakedTokensModal,
    FailedTransactionModal,
    WaitingWalletConfirmModal,
    TransactionModal,
} from '../components/Modals';
import { MenuMask } from '../components/menumask/index';
import {
    GALLERY_SELECT_WEB3_CONTEXT,
    HANDLE_WALLET_MODAL,
    HANDLE_SHOW_MENUMASK_MODAL,
} from '../const';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { LedgerConnector } from '@web3-react/ledger-connector';
import { WalletModal } from '../components/Modals/WalletModal';
import { WalletChange } from '../components/account/WalletChange';
import { LoginModal } from '../components/Modals/LoginModl';
import { TXStatusModal } from '../components/Modals/TXStatusModal';
import satellite from '../assets/image/satellite.png';

const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 128],
});

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
    1: 'https://eth-mainnet.alchemyapi.io/v2/k2--UT_xVVXMOvAyoxJYqtKhlmyBbqnX',
    4: 'https://rinkeby.infura.io/v3/8f6d3d5d7a1442a38d9e8050c31c1884',
};

const walletconnect = new WalletConnectConnector({
    rpc: { 1: RPC_URLS[1] },
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
});

const ledger = new LedgerConnector({
    chainId: 1,
    url: RPC_URLS[1],
    pollingInterval: POLLING_INTERVAL,
});

const wallets = {
    MetaMask: injected,
    WalletConnect: walletconnect,
    Ledger: ledger,
    //TrustWallet: injected,
    //Squarelink: squarelink,
    //Torus: torus,
    //Aut
};

export const InitPage = () => {
    const { dispatch, state } = useContext(mainContext);

    const context = useWeb3React();
    const { activate } = context;

    const {
        showConnectModal,
        showStakeModal,
        showUnstakeModal,
        showRewardModal,
        showStakedTokensModal,
        showUnstakedTokensModal,
        showFailedTransactionModal,
        showWaitingWalletConfirmModal,
        showTransactionModal,
        walletModal,
        txStatus,
        showMenuMaskModal,
    } = state;

    useEffect(() => {
        const localContent =
            window && window.localStorage.getItem(GALLERY_SELECT_WEB3_CONTEXT);
        console.log('wallet content', localContent);
        if (localContent) {
            console.log('activate', wallets[localContent]);
            activate(wallets[localContent]);
        }
    }, []);

    return (
        <>
            {/*<img src={satellite} className="satellite"/>*/}
            {showMenuMaskModal && (
                <MenuMask
                    onClick={() =>
                        dispatch({
                            type: HANDLE_SHOW_MENUMASK_MODAL,
                            showMenuMaskModal: true,
                        })
                    }
                />
            )}

            {showStakeModal && (
                <div className='modal-show'>
                    <div className='wrapper'>
                        <StakeModal />
                    </div>
                </div>
            )}
            {showUnstakeModal && (
                <div className='modal-show'>
                    <div className='wrapper'>
                        <UnstakeModal />
                    </div>
                </div>
            )}
            {showRewardModal && (
                <div className='modal-show'>
                    <div className='wrapper'>
                        <ClaimRewardModal />
                    </div>
                </div>
            )}
            {showStakedTokensModal && (
                <div className='modal-show'>
                    <div className='wrapper'>
                        <StakedTokensModal />
                    </div>
                </div>
            )}

            {showFailedTransactionModal && (
                <div className='modal-show'>
                    <div className='wrapper' style={{ zIndex: 11 }}>
                        <FailedTransactionModal />
                    </div>
                </div>
            )}
            {showWaitingWalletConfirmModal.show && (
                <div className='modal-show'>
                    <div className='wrapper' style={{ zIndex: 11 }}>
                        <WaitingWalletConfirmModal />
                    </div>
                </div>
            )}
            {/*{showWaitingWalletConfirmModal.show && (*/}
            {/*    <div className="modal-show" style={{zIndex: 11}}>*/}
            {/*        <div className="wrapper" >*/}
            {/*            <WaitingWalletConfirmModal />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}

            {showTransactionModal && (
                <div className='modal-show' style={{ zIndex: 11 }}>
                    <div className='wrapper'>
                        <TransactionModal />
                    </div>
                </div>
            )}

            {txStatus && (
                <div className='modal-show' style={{ zIndex: 11 }}>
                    <div className='wrapper'>
                        <TXStatusModal />
                    </div>
                </div>
            )}

            {walletModal === 'connect' && (
                <div className='modal-show'>
                    <div className='wrapper'>
                        <WalletConnect />
                    </div>
                </div>
            )}

            {walletModal === 'connecting' && (
                <div className='modal-show'>
                    <div className='wrapper'>
                        <LoginModal
                            onDismiss={() =>
                                dispatch({
                                    type: HANDLE_WALLET_MODAL,
                                    walletModal: null,
                                })
                            }
                        />
                    </div>
                </div>
            )}

            {walletModal === 'status' && (
                <div className='modal-show' style={{ zIndex: 11 }}>
                    <div className='wrapper'>
                        <WalletModal
                            onClose={() =>
                                dispatch({
                                    type: HANDLE_WALLET_MODAL,
                                    walletModal: null,
                                })
                            }
                            onChange={() =>
                                dispatch({
                                    type: HANDLE_WALLET_MODAL,
                                    walletModal: 'change',
                                })
                            }
                        />
                    </div>
                </div>
            )}

            {walletModal === 'change' && (
                <div className='modal-show'>
                    <div className='wrapper'>
                        <WalletChange
                            onClose={() =>
                                dispatch({
                                    type: HANDLE_WALLET_MODAL,
                                    walletModal: null,
                                })
                            }
                            onCancel={() =>
                                dispatch({
                                    type: HANDLE_WALLET_MODAL,
                                    walletModal: 'status',
                                })
                            }
                        />
                    </div>
                </div>
            )}
        </>
    );
};
