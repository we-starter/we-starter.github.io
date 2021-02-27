import React, { useEffect, useState } from 'react';
import { LoginModal } from '../components/Modals/LoginModl';
import metamask from '../assets/icon/metamask.png';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { LedgerConnector } from '@web3-react/ledger-connector';

const injected = new InjectedConnector({
    supportedChainIds: [3, 128],
});

const POLLING_INTERVAL = 12000;

const walletconnect = new WalletConnectConnector({
    rpc: { 128: 'https://http-mainnet-node.huobichain.com' },
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
});

const ledger = new LedgerConnector({
    chainId: 128,
    url: 'https://http-mainnet-node.huobichain.com',
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

export const HomePage = () => {
    const context = useWeb3React();
    const [connecting, setConnecting] = useState(false);
    const {
        connector,
        library,
        account,
        activate,
        deactivate,
        active,
        error,
    } = context;

    useEffect(() => {
        console.log('active', active);
        if (active && account && library) {
            setConnecting(false);
        }
    }, [account]);

    return (
        <div className='wrapper__container' style={{ display: 'inline' }}></div>
    );
};
