import React, {useRef} from 'react'
import cs from 'classnames'
import { useActiveWeb3React } from '../../web3'
import { FormattedMessage, injectIntl } from 'react-intl'
import PoolsBanner from '../../components/banner/PoolsBanner'
import BridgeCard from '../../components/migrate/migrateCard'
import Footer from '../../components/Footer'
const Migrate = (props) => {
    const bridgeCardRef = useRef()
    const { chainId } = useActiveWeb3React()
    return (
        <div className='bridge_box'>
            <div className='bridge_box_main'>
                <PoolsBanner LBPFlag='LBP' />
                <div className='bridge_index'>
                    <BridgeCard ref={bridgeCardRef}/>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default injectIntl(Migrate)
