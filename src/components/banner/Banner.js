import React, { useContext, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import WeStarterPDF from '../../pdfFile/Security Assessment for WeStarter - Starter.pdf'

export const Banner = () => {
  return (
    <div className='banner'>
      <div className='banner_img'></div>
      <h3 className='banner_text'>
        <FormattedMessage id='bannerTitle1' />
      </h3>
      <h3 className='banner_text-title'>
        <span>
          <FormattedMessage id='bannerText1' /> :{' '}
        </span>{' '}
        <a href=''></a>
      </h3>
      <p className='banner_dec'>
        <FormattedMessage id='bannerContent1' />
        <br />
        <FormattedMessage id='bannerContent2' />
      </p>
      <div className='banner_link'>
        <span>
          <FormattedMessage id='bannerText1' /> :{' '}
        </span>{' '}
        <a href=''></a>
      </div>
      <div className='banner_pdf'>
        <a href={WeStarterPDF} target='_blank'>
          <span className='pdf-icon'></span>
          <span className='pdf-text'>
            <FormattedMessage id='certik' />
          </span>
        </a>
        {/* <a
          className='down-load'
          download='application/pptx'
          href={WeStarterPDF}
          target='_blank'
        ></a> */}
      </div>
    </div>
  )
}
