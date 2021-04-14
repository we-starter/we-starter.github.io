import React, { useEffect } from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import 'antd/dist/antd.css'
import './assets/css/style.scss'

import ExtractComponents from './pages/pools/extractComponents'

import { HomePage } from './pages/HomePage'
import { ContextProvider } from './reducer'
import { InitPage } from './pages/InitPage'

import Footer from './components/Footer'
import PoolsIndex from './pages/pools/poolsIndex'
import PoolsDetail from './pages/pools/poolsDetail'
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
            {/* 头部 */}
            {/*<Header />*/}
            <ExtractComponents />
            <Switch>
              <Route exact path={['/']} component={PoolsIndex}></Route>
              <Route
                exact
                path='/pools/detail/:address'
                component={PoolsDetail}
              ></Route>
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
