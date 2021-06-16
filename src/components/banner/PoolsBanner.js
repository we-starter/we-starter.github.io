import React, { useContext, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { mainContext } from '../../reducer'
import { FormattedMessage } from 'react-intl'
import { GALLERY_SELECT_WEB3_CONTEXT, HANDLE_WALLET_MODAL } from '../../const'
import { injectIntl } from 'react-intl'
import { message } from 'antd'
import { useActiveWeb3React } from '../../web3'
import {getScanLink} from "../../connectors";

const PoolsBanner = (props) => {
  const { active, account,chainId } = useActiveWeb3React()
  const { intl } = props
  const { address, pool, LBPFlag } = props
  const { dispatch, state } = useContext(mainContext)

  return (
    <div className='pools_banner_box'>
      <div className='pools_banner'>
        <div className='pools_banner_img'></div>
        <h3 className='pools_banner_text'>
          {pool && pool.type == 0 && (
            <p>
              {pool.underlying.symbol}{' '}
              <FormattedMessage id='detailTitlePublic' />
            </p>
          )}
          {pool && pool.type == 1 && (
            <p>
              {pool.underlying.symbol}{' '}
              <FormattedMessage id='detailTitlePrivate' />
            </p>
          )}
          {pool && pool.type == 2 && (
            <p>
              {pool.name} <FormattedMessage id='detailTitlePublic' />
            </p>
          )}
          {/*{!active && <FormattedMessage id='htPublic' />}*/}
        </h3>
        {LBPFlag !== 'LBP' && (
          <>
            <a
              className='pools_banner_dec'
              href={getScanLink(chainId, address, 'address')}
              target='_blank'
            >
              {address}
              {/* <CopyToClipboard
          text={address}
          onCopy={() => {
            message.success('copy success')
          }}
        >
          <a></a>
        </CopyToClipboard> */}
              <svg
                t='1619095072712'
                className='icon'
                viewBox='0 0 1024 1024'
                version='1.1'
                xmlns='http://www.w3.org/2000/svg'
                p-id='1281'
                width='20'
                height='20'
              >
                <path
                  d='M424.96 128v87.04H215.04v599.04h599.04v-215.04h87.04v256c0 25.6-20.48 40.96-40.96 40.96H168.96c-25.6 0-40.96-20.48-40.96-40.96V168.96c0-25.6 20.48-40.96 40.96-40.96h256z m327.68 87.04h-194.56V128h343.04v343.04h-87.04V271.36L512 573.44 450.56 512l302.08-296.96z'
                  p-id='1282'
                ></path>
              </svg>
            </a>
            <p className='pools_banner_withdraw_tip'>
              <FormattedMessage id='withdrawTip' />
            </p>
          </>
        )}

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
    </div>
  )
}
export default injectIntl(PoolsBanner)
