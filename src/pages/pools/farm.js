import React, { useContext, useEffect, useState } from 'react'
import cs from 'classnames'
import { FormattedMessage, injectIntl } from 'react-intl'
import FarmHeader from '../../components/farm/farmHeader'
import Footer from '../../components/Footer'
import { HANDLE_WALLET_MODAL } from '../../const'
import { mainContext } from '../../reducer'
import { useFarmInfo } from './Hooks'
import WARHT_Small from '../../assets/icon/farm/WAR HT_small@2x.png'
import Coming_Small from '../../assets/icon/farm/coming_small@2x.png'

const Farm = (props) => {
  const { dispatch, state } = useContext(mainContext)
  console.log(useFarmInfo())
  return (
    <div style={{ minHeight: '100%', background: '#fff' }}>
      <FarmHeader />
      <div className='farm_index'>
        <div className='farm_index_card'>
          <h3 className='farm_index_card_title'>WAR-HT MLP POOL</h3>
          <div className='farm_index_card_content'>
            <p className='apr'>
              222.89%<span className='content_name'>APR</span>
            </p>
            <p className='countdown'>
              <span>12d 22h</span>
              <span className='content_name'>Countdown</span>
            </p>
          </div>
          <p className='farm_index_card_value'>
            Earned
            <img src={WARHT_Small} />
          </p>
          <p className='farm_index_card_value'>
            Total Deposited
            <span>123,345.78 MLP</span>
          </p>
          <p className='farm_index_card_value'>
            My Deposited
            <span>123,345.78 MLP</span>
          </p>
          <p className='farm_index_card_value'>
            Available
            <span>123,345.78 MLP</span>
          </p>
          <p className='farm_index_card_getMLP'>Get WAR-HT MLP</p>
          <div className='farm_index_card_btn'>
            <a
              className='deposit_btn'
              onClick={() => {
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: 'deposit',
                })
              }}
            >
              Deposit
            </a>
            <a
              className='claim_btn'
              onClick={() => {
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: 'claim',
                })
              }}
            >
              Claim
            </a>
          </div>
        </div>
        <div className='farm_index_card farm_index_coming'>
          <h3 className='farm_index_card_title'>Coming soon</h3>
          <div className='farm_index_card_content'>
            <p className='apr'>
              --<span className='content_name'>APR</span>
            </p>
            <p className='countdown'>
              <span>-- --</span>
              <span className='content_name'>Countdown</span>
            </p>
          </div>
          <p className='farm_index_card_value'>
            Earned
            <img src={Coming_Small} />
          </p>
          <p className='farm_index_card_value'>
            Total Deposited
            <span>--</span>
          </p>
          <p className='farm_index_card_value'>
            My Deposited
            <span>--</span>
          </p>
          <p className='farm_index_card_value'>
            Available
            <span>--</span>
          </p>
          <p className='farm_index_card_getMLP'>Get -- MLP</p>
          <div className='farm_index_card_btn'>
            <a className='deposit_btn disable_btn'>Deposit</a>
            <a className='claim_btn disable_btn'>Claim</a>
          </div>
        </div>
        <div className='farm_index_card farm_index_coming'>
          <h3 className='farm_index_card_title'>Coming soon</h3>
          <div className='farm_index_card_content'>
            <p className='apr'>
              --<span className='content_name'>APR</span>
            </p>
            <p className='countdown'>
              <span>-- --</span>
              <span className='content_name'>Countdown</span>
            </p>
          </div>
          <p className='farm_index_card_value'>
            Earned
            <img src={Coming_Small} />
          </p>
          <p className='farm_index_card_value'>
            Total Deposited
            <span>--</span>
          </p>
          <p className='farm_index_card_value'>
            My Deposited
            <span>--</span>
          </p>
          <p className='farm_index_card_value'>
            Available
            <span>--</span>
          </p>
          <p className='farm_index_card_getMLP'>Get -- MLP</p>
          <div className='farm_index_card_btn'>
            <a className='deposit_btn disable_btn'>Deposit</a>
            <a className='claim_btn disable_btn'>Claim</a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default injectIntl(Farm)
