import React, { useContext, useEffect, useState } from 'react'
import cs from 'classnames'
import { FormattedMessage, injectIntl } from 'react-intl'
import Footer from '../../components/Footer'
import BreadCrumbs from '../../components/application/BreadCrumbs'
import Apply from '../../components/application/Apply'


const VoteApply = (props) => {
  return (
    <React.Fragment>
      <div className='apply-page'>
        <Apply/>
        <Footer />
      </div>
    </React.Fragment>
  )
}

export default injectIntl(VoteApply)
