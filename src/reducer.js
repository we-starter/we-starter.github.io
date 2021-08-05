import React, { useReducer } from 'react'
import {
  HANDLE_SHOW_CONNECT_MODAL,
  HANDLE_MY_NFTS_MODAL,
  HANDLE_WEB3_CONTEXT,
  HANDLE_SHOW_STAKE_MODAL,
  HANDLE_SHOW_UNSTAKE_MODAL,
  HANDLE_SHOW_REWARD_MODAL,
  HANDLE_SHOW_STAKED_TOKENS_MODAL,
  HANDLE_SHOW_UNSTAKED_TOKENS_MODAL,
  HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
  HANDLE_SHOW_APPROVE_FAILED_TRANSACTION_MODAL,
  HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
  HANDLE_SHOW_TRANSACTION_MODAL,
  HANDLE_SHOW_SUCCESS_TRANSACTION_MODAL,
  HANDLE_WALLET_MODAL,
  HANDLE_TX_STATUS,
  HANDLE_SHOW_MENUMASK_MODAL,
  CHANGE_LOCALE,
  HANDLE_CHANGE_NETWORKS,
  TOOL_DATA,
  IS_SUPPORTEDCHAIN,
  CHANGE_SLIPPAGE,
  RANDOM_NUMBER,
  HANDLE_WITHDRAW_MODAL, BLOCK_HEIGHT,
  NOT_ACCESS_MODAL
} from './const'

const mainContext = React.createContext()

const reducer = (state, action) => {
  switch (action.type) {
    case HANDLE_SHOW_CONNECT_MODAL:
      return { ...state, showConnectModal: action.showConnectModal }
    case HANDLE_SHOW_STAKE_MODAL:
      return { ...state, showStakeModal: action.showStakeModal }
    case HANDLE_SHOW_UNSTAKE_MODAL:
      return { ...state, showUnstakeModal: action.showUnstakeModal }
    case HANDLE_SHOW_REWARD_MODAL:
      return { ...state, showRewardModal: action.showRewardModal }
    case HANDLE_SHOW_STAKED_TOKENS_MODAL:
      return {
        ...state,
        showStakedTokensModal: action.showStakedTokensModal,
      }
    case HANDLE_SHOW_UNSTAKED_TOKENS_MODAL:
      return {
        ...state,
        showUnstakedTokensModal: action.showUnstakedTokensModal,
      }
    case HANDLE_SHOW_FAILED_TRANSACTION_MODAL:
      return {
        ...state,
        showFailedTransactionModal: action.showFailedTransactionModal,
      }
    case HANDLE_SHOW_APPROVE_FAILED_TRANSACTION_MODAL:
      return {
        ...state,
        showApproveFailedTransactionModal:
          action.showApproveFailedTransactionModal,
      }
    case HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL:
      return {
        ...state,
        showWaitingWalletConfirmModal: action.showWaitingWalletConfirmModal,
      }
    case HANDLE_SHOW_TRANSACTION_MODAL:
      return {
        ...state,
        showTransactionModal: action.showTransactionModal,
      }
    case HANDLE_SHOW_SUCCESS_TRANSACTION_MODAL:
      return {
        ...state,
        showSuccessTransactionModal: action.showSuccessTransactionModal,
      }
    case HANDLE_WALLET_MODAL:
      return {
        ...state,
        walletModal: action.walletModal,
        pool: action.pool || null,
      }
    case HANDLE_TX_STATUS:
      return { ...state, txStatus: action.txStatus }
    case HANDLE_SHOW_MENUMASK_MODAL:
      return { ...state, showMenuMaskModal: action.showMenuMaskModal }
    case CHANGE_LOCALE:
      return { ...state, locale: action.locale || 'zh' }
    case HANDLE_CHANGE_NETWORKS:
      return {
        ...state,
        changeNetworkStatus: action.changeNetworkStatus,
      }
    case TOOL_DATA:
      return {
        ...state,
        toolData: action.toolData,
      }
    case CHANGE_SLIPPAGE:
      return {
        ...state,
        slippageVal: action.slippageVal,
      }
    case IS_SUPPORTEDCHAIN:
      return {
        ...state,
        isSupportedChain: action.isSupportedChain,
      }
    case RANDOM_NUMBER:
      return {
        ...state,
        randomNumber: action.randomNumber,
      }
    case HANDLE_WITHDRAW_MODAL:
    return {
      ...state,
      withdrawModal: action.withdrawModal
    }
    case BLOCK_HEIGHT:
      return {
        ...state,
        blockHeight: action.blockHeight
      }
    case NOT_ACCESS_MODAL:
      return {
        ...state,
        notAccessModal: action.notAccessModal
      }
    default:
      return state
  }
}

const ContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, {
    showConnectModal: false,
    showStakeModal: false,
    showUnstakeModal: false,
    showRewardModal: false,
    showStakedTokensModal: false,
    showUnstakedTokensModal: false,
    showFailedTransactionModal: false,
    showApproveFailedTransactionModal: false,
    showWaitingWalletConfirmModal: { show: false, title: '', content: '' },
    showTransactionModal: false,
    showSuccessTransactionModal: false,
    isSupportedChain: true,
    walletModal: null,
    withdrawModal: false,
    txStatus: null,
    pool: null,
    showMenuMaskModal: false,
    locale: 'en',
    changeNetworkStatus: false,
    toolData: null,
    slippageVal: 10, // 滑点值
    randomNumber: null,
    blockHeight: 0, // 块高度
    notAccessModal: false
  })
  return (
    <mainContext.Provider value={{ state, dispatch }}>
      {props.children}
    </mainContext.Provider>
  )
}

export { reducer, mainContext, ContextProvider }
