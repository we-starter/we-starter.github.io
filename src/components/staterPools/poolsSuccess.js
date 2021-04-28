import React, { useContext, useEffect, useState } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { mainContext } from '../../reducer'
import RIGHT from '../../assets/icon/right@2x.png'
import cs from 'classnames'

const PoolsSuccess = (props) => {
  const { intl, onClose, pool } = props
  const { dispatch } = useContext(mainContext)

  return (
    <>
      <div className='pools_slippage modal'>
        <div className='modal__box'>
          <form className='form-app' action='/'>
            <div className='form-app__inner deposit'>
              <img src={RIGHT} className='pools_slippage_success_img' />
              <h1 className='form-app__title h3 pools_slippage_success_title'>
                <FormattedMessage id='warLBP6' />
              </h1>
              <a
                className='pools_slippage_success_text'
                style={{
                  opacity: 1,
                }}
              >
                <FormattedMessage id='warLBP7' />
              </a>
              <div className='form-app__submit form-app__submit--row'>
                <button
                  className='btn btn--outline btn--medium'
                  type='button'
                  onClick={onClose}
                >
                  <FormattedMessage id='poolText22' />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default injectIntl(PoolsSuccess)
