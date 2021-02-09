import React, { useContext, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { mainContext } from '../../reducer'
import { GALLERY_SELECT_WEB3_CONTEXT, HANDLE_WALLET_MODAL } from '../../const'

export const PoolsBanner = () => {
  const [address, setAddress] = useState(
    '0xdBa054fDb2A542E9120xdBa054fDb2A542E912'
  )
  const { dispatch, state } = useContext(mainContext)
  return (
    <div className='pools_banner'>
      <div className='pools_banner_img'></div>
      <h3 className='pools_banner_text'>We Starter Public</h3>
      <p className='pools_banner_dec'>
        {address}
        <CopyToClipboard text={address} onCopy={() => {}}>
          <a></a>
        </CopyToClipboard>
      </p>
      <div>
        <a
          className='pools_banner_btn pools_banner_btn_active'
          onClick={() => {
            dispatch({
              type: HANDLE_WALLET_MODAL,
              walletModal: 'join',
            })
            window &&
              window.localStorage.setItem(GALLERY_SELECT_WEB3_CONTEXT, null)
          }}
        >
          Join Pool
        </a>
        <a className='pools_banner_btn'>View HECO</a>
      </div>
    </div>
  )
}
