import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import './assets/css/style.scss';
import { Header } from './components/header/Header';
import { PoolTab } from './components/pooltab/PoolTab';

import { HomePage } from './pages/HomePage';
import { ContextProvider } from './reducer';
import { InitPage } from './pages/InitPage';

import { Footer } from './components/Footer';
import { StakingPool1 } from './pages/pools/stakingPool1';
import { StakingPool2 } from './pages/pools/stakingPool2';
import { StakingPool3 } from './pages/pools/stakingPool3';

function getLibrary(provider) {
    const library = new Web3Provider(provider);
    library.pollingInterval = 8000;
    return library;
}

function App() {
    useEffect(() => {
        const el = document.querySelector('.loader-container');
        if (el) {
            el.remove();
        }
    }, []);

    return (
        <ContextProvider>
            <Web3ReactProvider getLibrary={getLibrary}>
                <Router>
                    {/* 头部 */}
                    <Header />
                    {/* 矿池类型 */}
                    <PoolTab />
                    <Switch>
                        <Route exact path='/staking-pool1'>
                            <StakingPool1 />
                        </Route>
                        <Route path='/staking-pool2'>
                            <StakingPool2 />
                        </Route>
                        <Route path='/staking-pool3'>
                            <StakingPool3 />
                        </Route>
                    </Switch>
                    <InitPage />
                    <Footer />
                </Router>
            </Web3ReactProvider>
        </ContextProvider>
    );
}

export default App;
