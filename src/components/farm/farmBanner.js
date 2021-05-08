import React, { useContext, useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { usePoolsInfo, usePoolsLBPInfo } from '../../pages/pools/Hooks'
import { mainContext } from '../../reducer'
import WeStarterPDF from '../../pdfFile/Security Assessment for WeStarter - Starter.pdf'

export const FarmBanner = () => {
  const { dispatch, state } = useContext(mainContext)
  const pools = usePoolsInfo()
  const poolsLBP = usePoolsLBPInfo()

  return (
    <div className='farm_banner'>
      <div className='farm_banner_left'>
        <h3 className='farm_banner_title'>
          <FormattedMessage id='farm1' />
        </h3>
        <p className='farm_banner_content'>
          <FormattedMessage id='farm2' />
        </p>
      </div>
      <div className='farm_banner_right'></div>
    </div>
  )
}
