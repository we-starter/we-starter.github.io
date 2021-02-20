import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import 'antd/dist/antd.css'
import './assets/css/style.scss'
import { Header } from './components/header/Header'
import { PoolTab } from './components/pooltab/PoolTab'

import ExtractComponents from './pages/pools/extractComponents'

import { HomePage } from './pages/HomePage'
import { ContextProvider } from './reducer'
import { InitPage } from './pages/InitPage'

import Footer from './components/Footer'
import { StakingPool1 } from './pages/pools/stakingPool1'
import { StakingPool2 } from './pages/pools/stakingPool2'
import { StakingPool3 } from './pages/pools/stakingPool3'
import StakingPool4 from './pages/pools/stakingPool4'
import PoolsIndex from './pages/pools/poolsIndex'
import WriteInformation from './pages/pools/writeInformation'
import { PoolsDetail } from './pages/pools/poolsDetail'
import Intl from './locale/intl'

function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 8000
  return library
}

function App() {
  useEffect(() => {
    const el = document.querySelector('.loader-container')
    if (el) {
      el.remove()
    }
  }, [])

  return (
    <ContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Intl>
          <Router>
            {/* 头部 */}
            {/*<Header />*/}
            {/* 矿池类型 */}
            {/*<PoolTab />*/}
            {/* pools页面banner和其他的不同，所以单独拎出去判断了 */}
            <ExtractComponents />
            <Switch>
              {/* <Route
                exact
                path='/staking-pool1'
                component={StakingPool1}
              ></Route>
              <Route
                exact
                path='/staking-pool2'
                component={StakingPool2}
              ></Route>
              <Route
                exact
                path='/staking-pool3'
                component={StakingPool3}
              ></Route> */}
              <Route exact path={['/']} component={PoolsIndex}></Route>
              <Route
                exact
                path='/pools/detail/:address'
                component={PoolsDetail}
              ></Route>
              {/* <Route
                exact
                path='/information'
                component={WriteInformation}
              ></Route> */}
            </Switch>
            <InitPage />
            <Footer />
          </Router>
        </Intl>
      </Web3ReactProvider>
    </ContextProvider>
  )
}

export default App
