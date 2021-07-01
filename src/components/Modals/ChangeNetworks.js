import React, {useContext} from 'react'
import {mainContext} from '../../reducer'
import {useActiveWeb3React} from '../../web3'
import close from '../../assets/icon/close.png'
import BSC from '../../assets/icon/BSC@2x.png'
import HECO from '../../assets/icon/HECO@2x.png'
import MATIC from '../../assets/icon/MATIC@2x.png'
import {changeNetwork} from "../../connectors";
import {ChainId} from "../../web3/address";
import { FormattedMessage } from 'react-intl'

export const ChangeNetworks = ({ onClose }) => {
    const { dispatch, state } = useContext(mainContext)
    const { chainId } = useActiveWeb3React()

  return (
    <div className='modal'>
      <div className='modal__box'>
        <form className='form-app' action='/'>
          <div className='form-app__inner transction-submitted link-wallet'>
            <div className='form-app__inner__header'>
              <FormattedMessage id='netWork3' />
            </div>{' '}
            <div className='choose-network-box'>
              <div className={`choose-network change-network`}>
                <p
                  className={`${chainId == ChainId.HECO ? 'active' : ''}`}
                  onClick={() => {
                    changeNetwork(ChainId.HECO).then(() => {
                      // TODO 关闭窗口
                      onClose()
                    })
                  }}
                >
                  <img src={HECO} />
                  <span>Heco</span>
                  <svg
                    t='1623750759643'
                    className='icon'
                    viewBox='0 0 1077 1024'
                    version='1.1'
                    xmlns='http://www.w3.org/2000/svg'
                    p-id='1980'
                    width='20'
                    height='20'
                  >
                    <path
                      d='M0 1024h862.315789a215.578947 215.578947 0 0 0 215.578948-215.578947V0L0 1024z m949.248-384.215579l-225.333895 225.333895a24.252632 24.252632 0 0 1-34.492631 0l-34.492632-34.492632-114.256842-110.807579a36.594526 36.594526 0 0 1 0-51.900631 36.648421 36.648421 0 0 1 51.900632 0l96.794947 93.345684a24.252632 24.252632 0 0 0 34.546526 0l173.379369-173.433263a36.594526 36.594526 0 0 1 51.954526 0 36.594526 36.594526 0 0 1 0 51.954526z'
                      p-id='1981'
                    ></path>
                  </svg>
                </p>
                
                <p
                  className={`${chainId == ChainId.BSC ? 'active' : ''}`}
                  onClick={() => {
                    changeNetwork(ChainId.BSC).then(() => {
                      // TODO 关闭窗口
                      onClose()
                    })
                  }}
                >
                  <img src={BSC} />
                  <span>BSC</span>
                  <svg
                    t='1623750759643'
                    className='icon'
                    viewBox='0 0 1077 1024'
                    version='1.1'
                    xmlns='http://www.w3.org/2000/svg'
                    p-id='1980'
                    width='20'
                    height='20'
                  >
                    <path
                      d='M0 1024h862.315789a215.578947 215.578947 0 0 0 215.578948-215.578947V0L0 1024z m949.248-384.215579l-225.333895 225.333895a24.252632 24.252632 0 0 1-34.492631 0l-34.492632-34.492632-114.256842-110.807579a36.594526 36.594526 0 0 1 0-51.900631 36.648421 36.648421 0 0 1 51.900632 0l96.794947 93.345684a24.252632 24.252632 0 0 0 34.546526 0l173.379369-173.433263a36.594526 36.594526 0 0 1 51.954526 0 36.594526 36.594526 0 0 1 0 51.954526z'
                      p-id='1981'
                    ></path>
                  </svg>
                </p>

                <p
                  className={`${chainId == ChainId.MATIC ? 'active' : ''}`}
                  onClick={() => {
                    changeNetwork(ChainId.MATIC).then(() => {
                      // TODO 关闭窗口
                      onClose()
                    })
                  }}
                >
                  <img src={MATIC} />
                  <span>Polygon</span>
                  <svg
                    t='1623750759643'
                    className='icon'
                    viewBox='0 0 1077 1024'
                    version='1.1'
                    xmlns='http://www.w3.org/2000/svg'
                    p-id='1980'
                    width='20'
                    height='20'
                  >
                    <path
                      d='M0 1024h862.315789a215.578947 215.578947 0 0 0 215.578948-215.578947V0L0 1024z m949.248-384.215579l-225.333895 225.333895a24.252632 24.252632 0 0 1-34.492631 0l-34.492632-34.492632-114.256842-110.807579a36.594526 36.594526 0 0 1 0-51.900631 36.648421 36.648421 0 0 1 51.900632 0l96.794947 93.345684a24.252632 24.252632 0 0 0 34.546526 0l173.379369-173.433263a36.594526 36.594526 0 0 1 51.954526 0 36.594526 36.594526 0 0 1 0 51.954526z'
                      p-id='1981'
                    ></path>
                  </svg>
                </p>
              </div>
            </div>
            <img
              src={close}
              alt=''
              className='form-app__close-btn'
              onClick={onClose}
              aria-label='Close'
            />
          </div>
        </form>
      </div>
    </div>
  )
}
