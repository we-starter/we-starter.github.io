import React, {useRef} from 'react'
import cs from 'classnames'
import { useActiveWeb3React } from '../../web3'
import { FormattedMessage, injectIntl } from 'react-intl'
import PoolsBanner from '../../components/banner/PoolsBanner'
import BridgeCard from '../../components/bridge/bridgeCard'
import BridgeList from '../../components/bridge/bridgeList'
import Footer from '../../components/Footer'
const Bridge = (props) => {
    const bridgeCardRef = useRef()
    const { chainId } = useActiveWeb3React()
    return (
        <div className='bridge_box' style={{ minHeight: '100%', background: '#fff' }}>
            <PoolsBanner LBPFlag='LBP' />
            <div className='bridge_index'>
                <BridgeCard ref={bridgeCardRef}/>
            </div>
            <Footer/>
        </div>
    )
}

export default injectIntl(Bridge)
