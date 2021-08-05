import React, {useContext, useEffect} from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import 'antd/dist/antd.css'
import './assets/css/style.scss'
import { Header } from './components/header/Header'

import ExtractComponents from './pages/pools/extractComponents'

import {ContextProvider, mainContext} from './reducer'
import { InitPage } from './pages/InitPage'

import Footer from './components/Footer'
import PoolsIndex from './pages/pools/poolsIndex'
import PoolsDetail from './pages/pools/poolsDetail'
import PoolsDetailLBP from './pages/pools/poolsDetailLBP'
import Farm from './pages/pools/farm'
import Migrate from './pages/pools/migrate'
import ScrollToTop from './components/ScrollTop'
import Intl from './locale/intl'

function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 8000
  console.log(library, 'library')
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
            <ScrollToTop />
            {/* 头部 */}
            <Header />
            {/* 矿池类型 */}
            {/*<PoolTab />*/}
            {/* pools页面banner和其他的不同，所以单独拎出去判断了 */}
            {/* <ExtractComponents /> */}
            <Switch>
              <Route exact path={['/']} component={PoolsIndex}></Route>
              <Route exact path='/farm' component={Farm}></Route>
              {/*<Route exact path='/migrate' component={Migrate}></Route>*/}
              <Route
                exact
                path='/pools/detail/:address'
                component={PoolsDetail}
              ></Route>
              <Route
                exact
                path='/pools/detailLBP/:address'
                component={PoolsDetailLBP}
              ></Route>
            </Switch>
            <InitPage />
            {/* <Footer /> */}
          </Router>
        </Intl>
      </Web3ReactProvider>
    </ContextProvider>
  )
}

export default App
