import React, { useContext, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import noConnect from '../../assets/image/noConnect.png'
import { FormattedMessage } from 'react-intl'

export const NoConnect = () => {
  return (
    <div className='noConnect'>
      <img src={noConnect} alt='' />
      <p>
        <FormattedMessage id='noNetwork' />
      </p>
    </div>
  )
}
