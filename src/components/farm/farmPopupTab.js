import React, { useContext, useEffect, useState } from 'react'
import { injectIntl } from 'react-intl'
import { FormattedMessage } from 'react-intl'
import DepositPopup from './depositPopup'
import { mainContext } from '../../reducer'
import ClaimPopup from './claimPopup'
import cs from 'classnames'
import UnstakePopup from './unstakePopup'
import farm from '../../configs/farm'

const FarmPopupTabPopup = (props) => {
  const { dispatch, state } = useContext(mainContext)
  const { intl, icon, onClose, pool } = props
  const farmPools = pool
  const [tabFlag, setTabFlag] = useState(
      farmPools.isFinish ? 'Unstake' :
    state.walletModal === 'deposit'
      ? 'Stake'
      : farmPools && farmPools.name !== 'WAR POOL (DAO)'
      ? 'Claim'
      : 'Unstake'
  )


  return (
    <div className='modal'>
      <div className='modal__box'>
        <form className='form-app farm_popup' action='/'>
          <div className='form-app__inner deposit farm_popup_box'>
            <div className='farm_popup_tab_box'>
              <div className='farm_popup_tab_content'>
                {
                  !farmPools.isFinish && <a
                      className={cs(
                          'farm_popup_tab',
                          farmPools && 'farm_popup_tab_' + farmPools.networkId,
                          tabFlag === 'Stake' && 'farm_popup_tab_active',
                          tabFlag === 'Stake' &&
                          farmPools &&
                          'farm_popup_tab_active_' + farmPools.networkId
                      )}
                      onClick={() => {
                        setTabFlag('Stake')
                      }}
                  >
                    <FormattedMessage id='farm3' />
                  </a>
                }
                {farmPools && farmPools.name !== 'WAR POOL (DAO)'  && !farmPools.isFinish &&  (
                  <a
                    className={cs(
                      'farm_popup_tab',
                      farmPools && 'farm_popup_tab_' + farmPools.networkId,
                      tabFlag === 'Claim' && 'farm_popup_tab_active',
                      tabFlag === 'Claim' &&
                        farmPools &&
                        'farm_popup_tab_active_' + farmPools.networkId
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
                    farmPools && 'farm_popup_tab_' + farmPools.networkId,
                    tabFlag === 'Unstake' && 'farm_popup_tab_active',
                    tabFlag === 'Unstake' &&
                      farmPools &&
                      'farm_popup_tab_active_' + farmPools.networkId
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
            {tabFlag === 'Stake' && !farmPools.isFinish && (
              <DepositPopup pool={farmPools} onClose={onClose} />
            )}
            {tabFlag === 'Claim' && !farmPools.isFinish &&
              farmPools &&
              farmPools.name !== 'WAR POOL (DAO)' && (
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
