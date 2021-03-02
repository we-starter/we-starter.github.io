import React, { useContext, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { mainContext } from '../../reducer'
import { FormattedMessage } from 'react-intl'
import { GALLERY_SELECT_WEB3_CONTEXT, HANDLE_WALLET_MODAL } from '../../const'
import { injectIntl } from 'react-intl'
import { message } from 'antd'
import { useActiveWeb3React } from '../../web3'

const PoolsBanner = (props) => {
  const { active, account } = useActiveWeb3React()
  const { intl } = props
  const { address, pool } = props
  const { dispatch, state } = useContext(mainContext)

  return (
    <div className='pools_banner'>
      <div className='pools_banner_img'></div>
      <h3 className='pools_banner_text'>
        {active && pool && pool.underlying.symbol === 'MATTER' && (
          <FormattedMessage id='logoTitle1' />
        )}
        {active && pool && pool.underlying.symbol === 'DFT' && (
          <FormattedMessage id='logoTitle2' />
        )}
        {!active && <FormattedMessage id='htPublic' />}
      </h3>
      <p className='pools_banner_dec'>
        {address}
        <CopyToClipboard
          text={address}
          onCopy={() => {
            message.success('copy success')
          }}
        >
          <a></a>
        </CopyToClipboard>
      </p>
      {/* <div>
        <a
          className={`pools_banner_btn ${
            pool && pool.status === 1
              ? 'pools_banner_btn_active'
              : 'pools_banner_btn_disable'
          }`}
          onClick={() => {
            if (pool.status === 1) {
              dispatch({
                type: HANDLE_WALLET_MODAL,
                walletModal: 'join',
                pool,
              })
            } else {
              message.info(intl.formatMessage({ id: 'cannotSubscribe' }))
            }
          }}
        >
          Join Pool
        </a>
        <a
          className='pools_banner_btn'
          href={`https://scan.hecochain.com/address/${address}`}
          target='_blank'
        >
          View HECO
        </a>
      </div> */}
    </div>
  )
}
export default injectIntl(PoolsBanner)
