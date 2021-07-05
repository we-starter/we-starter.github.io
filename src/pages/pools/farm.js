import React, { useContext, useEffect, useState } from 'react'
import cs from 'classnames'
import { useActiveWeb3React } from '../../web3'
import { FormattedMessage, injectIntl } from 'react-intl'
import { FarmBanner } from '../../components/farm/farmBanner'
import Footer from '../../components/Footer'
import FarmCard from '../../components/farm/farmCard'
import farms from '../../configs/farm'
import { useFarmInfo } from './Hooks'
import Coming_Small from '../../assets/icon/farm/coming_small@2x.png'

const Farm = (props) => {
  const isComing = (index) => {
    return (
      <div className='farm_index_card farm_index_coming' key={index}>
        <h3 className='farm_index_card_title'>
          <FormattedMessage id='comingSoon' />
        </h3>
        <div className='farm_index_card_content'>
          <p className='apr'>
            --
            <span className='content_name'>APR</span>
          </p>
          <p className='countdown'>
            <span>--</span>
            <span className='content_name'>
              <FormattedMessage id='farm8' />
            </span>
          </p>
        </div>
        <p className='farm_index_card_value'>
          <FormattedMessage id='farm10' />
          <img src={Coming_Small} />
        </p>
        <p className='farm_index_card_value'>
          <FormattedMessage id='farm11' />
          <span>--</span>
        </p>
        <p className='farm_index_card_value'>
          <FormattedMessage id='farm12' />
          <span>--</span>
        </p>
        <p className='farm_index_card_value'>
          <FormattedMessage id='farm4' />
          <span>--</span>
        </p>
        <p className='farm_index_card_getMLP'>
          {/* <FormattedMessage id='farm13' /> -- {farmPools && farmPools.rewards} */}
        </p>
        <div className='farm_index_card_btn' style={{ marginTop: '34px' }}>
          <a className='deposit_btn disable_btn'>
            <FormattedMessage id='farm3' />
          </a>
          <a className='claim_btn disable_btn'>
            <FormattedMessage id='farm16' />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className='farm_box' style={{ minHeight: '100%', background: '#fff' }}>
        <div className='farm_box_main'>
            <FarmBanner />
            <div className='farm_index'>
                { farms.map((item, index) => {
                    return <FarmCard pools={item} key={index} />
                })}
                {/*{pools.length < 3 && [1, 2].map(() => isComing(Math.random()))}*/}
            </div>
        </div>
      <Footer />
    </div>
  )
}

export default injectIntl(Farm)
