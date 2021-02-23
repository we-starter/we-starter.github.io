import React, { useContext, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import ant from '../../assets/icon/ant.png'
import { FormattedMessage } from 'react-intl'

export const PoolTab = () => {
  return (
    <div className='pooltab'>
      <NavLink to='/staking-pool1'>
        <FormattedMessage id='mortgage' />
        <img src={ant} alt='' />
      </NavLink>
      <NavLink to='/staking-pool2'>
        <FormattedMessage id='liquidityPool' />
        <img src={ant} alt='' />
      </NavLink>
      <NavLink to='/staking-pool3'>
        <FormattedMessage id='coinCollar' />
        <img src={ant} alt='' />
      </NavLink>
    </div>
  )
}
