import React, { useContext, useEffect, useState } from 'react'
import cs from 'classnames'
import { FormattedMessage, injectIntl } from 'react-intl'
import Footer from '../../components/Footer'
import BreadCrumbs from '../../components/application/BreadCrumbs'

const Vote = (props) => {
  return (
    <div style={{ position: 'relative' }}>
      <div className='vote'>
        <div className='vote_box'>
          <BreadCrumbs toUrl='/application' name='Proposals' />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default injectIntl(Vote)
