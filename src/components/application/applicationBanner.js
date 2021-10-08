import React, { useContext, useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

export const ApplicationBanner = () => {
  return (
    <div className='application_banner'>
      <div className='application_banner_center'>
        <h3 className='application_banner_title'>
          <FormattedMessage id='applicationText1' />
        </h3>
        <a className='application_banner_content'>
          <FormattedMessage id='applicationText2' />
        </a>
      </div>
    </div>
  )
}
