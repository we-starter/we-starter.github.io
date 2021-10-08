import React, { useContext, useEffect, useMemo, useState } from 'react'
import cs from 'classnames'
import { FormattedMessage, injectIntl } from 'react-intl'
import { mainContext } from '../../reducer'
import ApplicationCountdown from './ApplicationCountdown'
import { NavLink } from 'react-router-dom'

export const InProgressCard = () => {
  return (
    <div className='application_card'>
      <div className='application_card_title'>
        <i>ID:01</i>
        <ApplicationCountdown />
      </div>
      <div className='application_card_content'>
        <img src={require('../../assets/icon/WAR.png')} />
        <p className='application_card_content_title'>
          <FormattedMessage id='applicationText6' />
          <span>Thetan Arena</span>
        </p>
        <p className='application_card_content_title'>
          <FormattedMessage id='applicationText7' />
          <span>$200,000</span>
        </p>
        <p className='application_card_content_title application_card_content_progress'>
          <FormattedMessage id='poolsIndexText2' />
          <a>
            <span style={{ width: '80px' }}></span>
          </a>
        </p>
        <p className='application_card_content_btn'>
          <NavLink to='/application/vote'>
            <FormattedMessage id='applicationText8' />
          </NavLink>
          {/* <a className='disable_failed'><FormattedMessage id='applicationText9' /></a> */}
          <a>
            <FormattedMessage id='claim' />
          </a>
        </p>
      </div>
      <div className='application_card_content_h5'>
        <img src={require('../../assets/icon/WAR.png')} />
        <p className='application_card_content_title_h5'>
          <FormattedMessage id='applicationText6' />
          <span>Thetan Arena</span>
        </p>
        <div className='application_card_content_h5_box'>
          <p className='application_card_content_title'>
            <FormattedMessage id='applicationText7' />
            <span>$200,000</span>
          </p>
          <p className='application_card_content_title application_card_content_progress'>
            <FormattedMessage id='poolsIndexText2' />
            <a>
              <span style={{ width: '80px' }}></span>
            </a>
          </p>
        </div>
        <p className='application_card_content_btn'>
          {/* <NavLink to='/application/vote'>
            <FormattedMessage id='applicationText8' />
          </NavLink> */}
          <a className='disable_failed'>
            <FormattedMessage id='applicationText9' />
          </a>
          <a>
            <FormattedMessage id='claim' />
          </a>
        </p>
      </div>
    </div>
  )
}

export default injectIntl((props) => {
  const { dispatch, state } = useContext(mainContext)
  return useMemo(() => <InProgressCard {...props} dispatch={dispatch} />, [
    dispatch,
    props,
  ])
})
