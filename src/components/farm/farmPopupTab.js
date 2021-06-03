import React, { useContext, useEffect, useState } from 'react'
import { injectIntl } from 'react-intl'
import { FormattedMessage } from 'react-intl'
import DepositPopup from './depositPopup'
import { mainContext } from '../../reducer'
import ClaimPopup from './claimPopup'
import cs from 'classnames'
import UnstakePopup from './unstakePopup'

const FarmPopupTabPopup = (props) => {
  const { dispatch, state } = useContext(mainContext)
  const { intl, icon, onClose, pool } = props
  const farmPools = pool
  const [tabFlag, setTabFlag] = useState(
    state.walletModal === 'deposit'
      ? 'Stake'
      : farmPools && farmPools.name !== 'WAR'
      ? 'Claim'
      : 'Unstake'
  )

  return (
    <div className='modal'>
      <div className='modal__box'>
        <form className='form-app farm_popup' action='/'>
          <div className='form-app__inner deposit farm_popup_box'>
            <div className='farm_popup_tab_box'>
              <div>
                <a
                  className={cs(
                    'farm_popup_tab',
                    tabFlag === 'Stake' && 'farm_popup_tab_active'
                  )}
                  onClick={() => {
                    setTabFlag('Stake')
                  }}
                >
                  <FormattedMessage id='farm3' />
                </a>
                {farmPools && farmPools.name !== 'WAR' && (
                  <a
                    className={cs(
                      'farm_popup_tab',
                      tabFlag === 'Claim' && 'farm_popup_tab_active'
                    )}
                    onClick={() => {
                      setTabFlag('Claim')
                    }}
                  >
                    <FormattedMessage id='farm16' />
                  </a>
                )}

                <a
                  className={cs(
                    'farm_popup_tab',
                    tabFlag === 'Unstake' && 'farm_popup_tab_active'
                  )}
                  onClick={() => {
                    setTabFlag('Unstake')
                  }}
                >
                  <FormattedMessage id='farm5' />
                </a>
              </div>
              <a className='farm_popup_close_btn' onClick={onClose}></a>
            </div>
            {tabFlag === 'Stake' && (
              <DepositPopup pool={farmPools} onClose={onClose} />
            )}
            {tabFlag === 'Claim' && farmPools && farmPools.name !== 'WAR' && (
              <ClaimPopup pool={farmPools} onClose={onClose} />
            )}
            {tabFlag === 'Unstake' && (
              <UnstakePopup pool={farmPools} onClose={onClose} />
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default injectIntl(FarmPopupTabPopup)
