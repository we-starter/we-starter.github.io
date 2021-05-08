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
import { useBalance } from '../Hooks'

const Farm = (props) => {
  const { dispatch, state } = useContext(mainContext)
  const pools = useFarmInfo()
  const farmPools = pools[0]
  const { balance } = useBalance(farmPools && farmPools.MLP)

  return (
    <div style={{ minHeight: '100%', background: '#fff' }}>
      <FarmHeader />
      <div className='farm_index'>
        <div className='farm_index_card'>
          <h3 className='farm_index_card_title'>
            {farmPools && farmPools.name} <FormattedMessage id='farm9' />
          </h3>
          <div className='farm_index_card_content'>
            <p className='apr'>
              222.89%
              <span className='content_name'>
                {farmPools && farmPools.earnName}
              </span>
            </p>
            <p className='countdown'>
              {farmPools && typeof farmPools.openDate == 'object' ? (
                <span>
                  {farmPools.openDate.hour}
                  <b>
                    <FormattedMessage id='HourM' />
                  </b>{' '}
                  <i>/</i> {farmPools.openDate.minute}
                  <b>
                    <FormattedMessage id='MinM' />
                  </b>
                </span>
              ) : typeof farmPools.dueDate == 'object' ? (
                <span>
                  {farmPools.dueDate.day}
                  <b>
                    <FormattedMessage id='DayM' />
                  </b>
                  <i>/</i>
                  {farmPools.dueDate.hour}
                  <b>
                    <FormattedMessage id='HourM' />
                  </b>
                </span>
              ) : (
                <span>{farmPools.dueDate}</span>
              )}
              <span className='content_name'>
                <FormattedMessage id='farm8' />
              </span>
            </p>
          </div>
          <p className='farm_index_card_value'>
            <FormattedMessage id='farm10' />
            <img src={WARHT_Small} />
          </p>
          <p className='farm_index_card_value'>
            <FormattedMessage id='farm11' />
            <span>
              {farmPools && farmPools.totalSupply
                ? farmPools.totalSupply + ' ' + farmPools.rewards
                : '--'}
            </span>
          </p>
          <p className='farm_index_card_value'>
            <FormattedMessage id='farm12' />
            <span>
              {farmPools && farmPools.balanceOf
                ? farmPools.balanceOf + ' ' + farmPools.rewards
                : '--'}
            </span>
          </p>
          <p className='farm_index_card_value'>
            <FormattedMessage id='farm4' />
            <span>
              {farmPools && balance - 0
                ? balance + ' ' + farmPools.rewards
                : '--'}
            </span>
          </p>
          <p className='farm_index_card_getMLP'>
            <FormattedMessage id='farm13' /> {farmPools && farmPools.name}
          </p>
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
              <FormattedMessage id='farm3' />
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
              <FormattedMessage id='claim' />
            </a>
          </div>
        </div>
        <div className='farm_index_card farm_index_coming'>
          <h3 className='farm_index_card_title'>
            <FormattedMessage id='comingSoon' />
          </h3>
          <div className='farm_index_card_content'>
            <p className='apr'>
              --
              <span className='content_name'>
                {farmPools && farmPools.earnName}
              </span>
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
            <FormattedMessage id='farm13' /> -- {farmPools && farmPools.rewards}
          </p>
          <div className='farm_index_card_btn'>
            <a className='deposit_btn disable_btn'>
              <FormattedMessage id='farm3' />
            </a>
            <a className='claim_btn disable_btn'>
              <FormattedMessage id='claim' />
            </a>
          </div>
        </div>
        <div className='farm_index_card farm_index_coming'>
          <h3 className='farm_index_card_title'>
            <FormattedMessage id='comingSoon' />
          </h3>
          <div className='farm_index_card_content'>
            <p className='apr'>
              --
              <span className='content_name'>
                {farmPools && farmPools.earnName}
              </span>
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
            <FormattedMessage id='farm13' /> -- {farmPools && farmPools.rewards}
          </p>
          <div className='farm_index_card_btn'>
            <a className='deposit_btn disable_btn'>
              <FormattedMessage id='farm3' />
            </a>
            <a className='claim_btn disable_btn'>
              <FormattedMessage id='claim' />
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default injectIntl(Farm)
