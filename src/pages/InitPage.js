import React, { useContext, useEffect } from 'react'
import { WalletConnect } from '../components/account/WalletConnect'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { mainContext } from '../reducer'
import BigNumber from 'bignumber.js'
import {
  StakeModal,
  UnstakeModal,
  ClaimRewardModal,
  StakedTokensModal,
  FailedTransactionModal,
  NotAccessModal,
  ApproveFailedTransactionModal,
  WaitingWalletConfirmModal,
  TransactionModal,
  SuccessTransactionModal,
} from '../components/Modals'
import { MenuMask } from '../components/menumask/index'
import {
  GALLERY_SELECT_WEB3_CONTEXT,
  HANDLE_WALLET_MODAL,
  HANDLE_SHOW_MENUMASK_MODAL,
  HANDLE_CHANGE_NETWORKS,
  TOOL_DATA,
  HANDLE_WITHDRAW_MODAL,
  IS_SUPPORTEDCHAIN,
  HANDLE_SHOW_SUCCESS_TRANSACTION_MODAL,
} from '../const'
import { WalletModal } from '../components/Modals/WalletModal'
import DepositPopup from '../components/farm/depositPopup'
import ClaimPopup from '../components/farm/claimPopup'
import FarmPopupTab from '../components/farm/farmPopupTab'
import BuyCoinPopup from '../components/farm/buyCoinPopup'
import CompoundPopup from '../components/farm/compoundPopup'
import PoolsJoin from '../components/staterPools/poolsJoin'
import PoolsSlippage from '../components/staterPools/poolsSlippage'
import PoolsSuccess from '../components/staterPools/poolsSuccess'
import { LoginModal } from '../components/Modals/LoginModl'
import { ChangeNetworks } from '../components/Modals/ChangeNetworks'
import { TXStatusModal } from '../components/Modals/TXStatusModal'
import SwitchWithdrawPopup from '../components/migrate/switchWithdrawPopup'
import WithdrawSuccessPopup from '../components/migrate/withdrawSuccessPopup'
import toolApi from '../apis/toolApi'
import { useConnectWallet } from '../connectors'
import AdjustmentTipsPopup from "../components/AdjustmentTipsPopup";

export const InitPage = () => {
  const { dispatch, state } = useContext(mainContext)

  const context = useWeb3React()
  const connectWallet = useConnectWallet()
  const { activate } = context

  const {
    showConnectModal,
    showStakeModal,
    showUnstakeModal,
    showRewardModal,
    showStakedTokensModal,
    showUnstakedTokensModal,
    showFailedTransactionModal,
    showApproveFailedTransactionModal,
    showWaitingWalletConfirmModal,
    showTransactionModal,
    showSuccessTransactionModal,
    walletModal,
    txStatus,
    pool,
    showMenuMaskModal,
    changeNetworkStatus,
    withdrawModal,
    notAccessModal
  } = state

  console.log(state, 'state')
  useEffect(() => {
    Promise.all([
      toolApi.getTotalNumAddresses(1),
      toolApi.getTotalNumAddresses(5),
    ])
    .then(res => {
      if (res[0].data.data && res[1].data.data) {
        let total = new BigNumber(res[0].data.data.address_count)
          .plus(new BigNumber(res[1].data.data.address_count))
          .toString()
        dispatch({
          type: TOOL_DATA,
          toolData: total,
        })
      }
    })
  }, [])

  return (
    <>
      <AdjustmentTipsPopup />
      {/*<img src={satellite} className="satellite"/>*/}
      {showMenuMaskModal && (
        <MenuMask
          onClick={() =>
            dispatch({
              type: HANDLE_SHOW_MENUMASK_MODAL,
              showMenuMaskModal: true,
            })
          }
        />
      )}
      {showStakeModal && (
        <div className='modal-show'>
          <div className='wrapper'>
            <StakeModal />
          </div>
        </div>
      )}
      {showUnstakeModal && (
        <div className='modal-show'>
          <div className='wrapper'>
            <UnstakeModal />
          </div>
        </div>
      )}
      {showRewardModal && (
        <div className='modal-show'>
          <div className='wrapper'>
            <ClaimRewardModal />
          </div>
        </div>
      )}
      {showStakedTokensModal && (
        <div className='modal-show'>
          <div className='wrapper'>
            <StakedTokensModal />
          </div>
        </div>
      )}
      {showFailedTransactionModal && (
        <div className='modal-show'>
          <div className='wrapper' style={{ zIndex: 11 }}>
            <FailedTransactionModal />
          </div>
        </div>
      )}
      {notAccessModal && (
        <div className='modal-show'>
          <div className='wrapper' style={{ zIndex: 11 }}>
            <NotAccessModal />
          </div>
        </div>
      )}


      {/* 授权失败弹框 */}
      {showApproveFailedTransactionModal && (
        <div className='modal-show'>
          <div className='wrapper' style={{ zIndex: 11 }}>
            <ApproveFailedTransactionModal />
          </div>
        </div>
      )}
      {showWaitingWalletConfirmModal.show && (
        <div className='modal-show'>
          <div className='wrapper' style={{ zIndex: 11 }}>
            <WaitingWalletConfirmModal />
          </div>
        </div>
      )}
      {/*{showWaitingWalletConfirmModal.show && (*/}
      {/*    <div className="modal-show" style={{zIndex: 11}}>*/}
      {/*        <div className="wrapper" >*/}
      {/*            <WaitingWalletConfirmModal />*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*)}*/}
      {showTransactionModal && (
        <div className='modal-show'>
          <div className='wrapper' style={{ zIndex: 11 }}>
            <TransactionModal />
          </div>
        </div>
      )}
      {showSuccessTransactionModal && (
        <div className='modal-show'>
          <div className='wrapper' style={{ zIndex: 11 }}>
            <SuccessTransactionModal />
          </div>
        </div>
      )}
      {txStatus && (
        <div className='modal-show'>
          <div className='wrapper' style={{ zIndex: 11 }}>
            <TXStatusModal />
          </div>
        </div>
      )}
      {walletModal === 'connect' && (
        <div className='modal-show'>
          <div className='wrapper'>
            <WalletConnect
              onClose={() =>
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: null,
                })
              }
            />
          </div>
        </div>
      )}
      {walletModal === 'connecting' && (
        <div className='modal-show'>
          <div className='wrapper'>
            <LoginModal
              onDismiss={() =>
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: null,
                })
              }
            />
          </div>
        </div>
      )}
      {walletModal === 'status' && (
        <div className='modal-show'>
          <div className='wrapper' style={{ zIndex: 11 }}>
            <WalletModal
              onClose={() =>
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: null,
                })
              }
              onChange={() =>
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: 'change',
                })
              }
            />
          </div>
        </div>
      )}
      {walletModal === 'change' && (
        <div className='modal-show'>
          <div className='wrapper'>
            <WalletConnect
              onClose={() =>
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: null,
                })
              }
            />
            {/* <WalletChange
              onClose={() =>
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: null,
                })
              }
              onCancel={() =>
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: 'status',
                })
              }
            /> */}
          </div>
        </div>
      )}
      {walletModal === 'join' && (
        <div className='modal-show'>
          <div className='wrapper' style={{ zIndex: 10 }}>
            <PoolsJoin
              pool={pool}
              onClose={() =>
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: null,
                })
              }
              onChange={() => {}}
            />
          </div>
        </div>
      )}
      {walletModal === 'slippageSuccess' && (
        <div className='modal-show'>
          <div className='wrapper' style={{ zIndex: 10 }}>
            <PoolsSuccess
              pool={pool}
              onClose={() =>
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: null,
                })
              }
              onChange={() => {}}
            />
          </div>
        </div>
      )}
      {walletModal === 'slippage' && (
        <div className='modal-show'>
          <div className='wrapper' style={{ zIndex: 10 }}>
            <PoolsSlippage
              pool={pool}
              onClose={() =>
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: null,
                })
              }
              onChange={() => {}}
            />
          </div>
        </div>
      )}
      {changeNetworkStatus && (
        <div className='modal-show'>
          <div className='wrapper'>
            {/* <WalletConnect
              onClose={() =>
                dispatch({
                  type: HANDLE_CHANGE_NETWORKS,
                  walletModal: null,
                })
              }
            /> */}
            <ChangeNetworks
              onClose={() =>
                dispatch({
                  type: HANDLE_CHANGE_NETWORKS,
                  walletModal: null,
                })
              }
            />
          </div>
        </div>
      )}
      {(walletModal === 'deposit' || walletModal === 'claim') && (
        <div className='modal-show'>
          <div className='wrapper' style={{ zIndex: 10 }}>
            <FarmPopupTab
              pool={pool}
              onClose={() =>
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: null,
                })
              }
              onChange={() => {}}
            />
          </div>
        </div>
      )}
      {walletModal === 'buyCoin' && (
        <div className='modal-show'>
          <div className='wrapper' style={{ zIndex: 10 }}>
            <BuyCoinPopup
              pool={pool}
              onClose={() =>
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: null,
                })
              }
              onChange={() => {}}
            />
          </div>
        </div>
      )}

      {walletModal === 'compound' && (
        <div className='modal-show'>
          <div className='wrapper' style={{ zIndex: 10 }}>
            <CompoundPopup
              pool={pool}
              onClose={() =>
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: null,
                })
              }
              onChange={() => {}}
            />
          </div>
        </div>
      )}

      {/*{walletModal === 'switchWithdraw' && (*/}
      {/*  <div className='modal-show'>*/}
      {/*    <div className='wrapper' style={{ zIndex: 10 }}>*/}
      {/*      <SwitchWithdrawPopup*/}
      {/*        onClose={() =>*/}
      {/*          dispatch({*/}
      {/*            type: HANDLE_WALLET_MODAL,*/}
      {/*            walletModal: null,*/}
      {/*          })*/}
      {/*        }*/}
      {/*        onChange={() => { }}*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}

      {withdrawModal && (
        <div className='modal-show'>
          <div className='wrapper' style={{ zIndex: 10 }}>
            <WithdrawSuccessPopup
              onClose={() =>
                dispatch({
                  type: HANDLE_WITHDRAW_MODAL,
                  withdrawModal: null,
                })
              }
              onChange={() => {}}
            />
          </div>
        </div>
      )}

      {/* {walletModal === 'claim' && (
        <div className='modal-show'>
          <div className='wrapper' style={{ zIndex: 10 }}>
            <ClaimPopup
              pool={pool}
              onClose={() =>
                dispatch({
                  type: HANDLE_WALLET_MODAL,
                  walletModal: null,
                })
              }
              onChange={() => {}}
            />
          </div>
        </div>
      )} */}
    </>
  )
}
