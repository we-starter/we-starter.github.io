import React, { useContext } from 'react'
import { mainContext } from '../../reducer'
import { useActiveWeb3React } from '../../web3'
import close from '../../assets/icon/close.png'
import BSC from '../../assets/icon/BSC_CIRCLE@2x.png'
import HECO from '../../assets/icon/HECO_CIRCLE@2x.png'
import MATIC from '../../assets/icon/MATIC_CIRCLE@2x.png'
import AVALANCHE from '../../assets/icon/AVALANCHE_CIRCLE@2x.png'
import { changeNetwork } from "../../connectors";
import { ChainId } from "../../web3/address";
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
                  <span>Binance</span>

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

                </p>
                <p
                  className={`${chainId == ChainId.AVALANCHE ? 'active' : ''}`}
                  onClick={() => {
                    changeNetwork(ChainId.AVALANCHE).then(() => {
                      // TODO 关闭窗口
                      onClose()
                    })
                  }}
                >
                  <img src={AVALANCHE} />
                  <span>Avalanche</span>

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
