import React, { useContext, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import Icon1 from '../../assets/icon/icon1@2x.png'
import Icon2 from '../../assets/icon/icon2@2x.png'
import Icon3 from '../../assets/icon/icon3@2x.png'
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
      <div className='banner_related'>
        <div className='banner_related_data'>
          <img src={Icon1} />
          <p>
            <span className='banner_related_data_title'>累计融资金额</span>
            <span className='banner_related_data_val'>9,999,999.99 USD</span>
          </p>
        </div>
        <div className='banner_related_data'>
          <img src={Icon2} />
          <p>
            <span className='banner_related_data_title'>参与地址总数</span>
            <span className='banner_related_data_val'>9,999,999.99</span>
          </p>
        </div>
        <div className='banner_related_data'>
          <img src={Icon3} />
          <p>
            <span className='banner_related_data_title'>总成立的池子数</span>
            <span className='banner_related_data_val'>9,999,999.99</span>
          </p>
        </div>
      </div>
    </div>
  )
}
