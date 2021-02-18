import React, { useContext, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

export const Banner = () => {
  return (
    <div className='banner'>
      <div className='banner_img'></div>
      <h3 className='banner_text'>
        <FormattedMessage id='bannerTitle' />
      </h3>
      <p className='banner_dec'>
        <FormattedMessage id='bannerContent' />
      </p>
      <div className='banner_link'>
        <span>Live on : </span> <a href=''></a>
      </div>
    </div>
  )
}
