import React, { useContext, useEffect, useState } from 'react'
import cs from 'classnames'
import { useActiveWeb3React } from '../../web3'
import { FormattedMessage, injectIntl } from 'react-intl'
import BigNumber from 'bignumber.js'
import { Button } from 'antd'
import {
  HANDLE_WALLET_MODAL
} from '../../const'
import { mainContext } from '../../reducer'
// 处理格式 千位符
import { formatNumber } from 'accounting'
import { formatAmount, formatAddress } from '../../utils/format'
import Right from '../../assets/icon/right@2x.png'

const BridgeList = (props) => {
  const { account, active, library, chainId } = useActiveWeb3React()
  const { dispatch, state } = useContext(mainContext)
  const HistoryData = [
    {
      assets: 'WAR',
      from: 'Heco',
      to: 'Binance Smart Chain',
      toLogo: 'Bsc',
      destination: '0x1f734675ASA&2ADADASK23SDA4dE8D71441da65F',
      amount: 99999999,
      status: 1
    },
    {
      assets: 'WAR',
      from: 'Heco',
      to: 'Binance Smart Chain',
      toLogo: 'Bsc',
      destination: '0x1f734675ASA&2ADADASK23SDA4dE8D71441da65F',
      amount: 99999999,
      status: 2
    }
  ]

  return (
    <div className='bridge_list'>
      <div className='bridge_list_tab'>
        <FormattedMessage id='bridge5' />
        </div>
      <table className='bridge_list_table_pc'>
        <thead>
          <tr>
            <td><FormattedMessage id='bridge6' /></td>
            <td><FormattedMessage id='bridge7' /></td>
            <td><FormattedMessage id='bridge8' /></td>
            <td><FormattedMessage id='bridge2' /></td>
            <td><FormattedMessage id='bridge9' /></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {
            HistoryData && HistoryData.map((item, index) => {
              return (
                <tr key={index}>
                  <td className='tbody_title'>
                    <img className='icon' src={require('../../assets/icon/' + item.assets.toUpperCase() + '@2x.png')} /> {item.assets}
                  </td>
                  <td>
                    <img src={require('../../assets/icon/' + item.from.toUpperCase() + '@2x.png')} /> {item.from}
                  </td>
                  <td>
                    <img src={require('../../assets/icon/' + item.toLogo.toUpperCase() + '@2x.png')} /> {item.to}
                  </td>
                  <td>{formatAddress(item.destination)}</td>
                  <td>{formatNumber(item.amount)}</td>
                  <td className='withdraw_status'>
                    {
                      item.status == 1 && <p onClick={() => {
                        dispatch({
                          type: HANDLE_WALLET_MODAL,
                          walletModal: 'switchWithdraw',
                        })
                      }}><FormattedMessage id='bridge10' /></p>
                    }
                    {
                      item.status == 2 && <img src={Right} />
                    }
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
      <div className='bridge_list_table_h5'>
       {
         HistoryData && HistoryData.map((item, index) => {
           return (
             <div className='bridge_list_data' key={index}>
               <div className='bridge_list_data_title'>
                 <h2><img className='icon' src={require('../../assets/icon/' + item.assets.toUpperCase() + '@2x.png')} /> {item.assets}</h2>
                 {
                   item.status == 2 && <img src={Right} />
                 }
               </div>
               <div className='bridge_list_data_title'>
                 <div className='bridge_list_data_value'>
                   <p><FormattedMessage id='bridge7' /></p>
                   <p><img className='success_status' src={require('../../assets/icon/' + item.from.toUpperCase() + '@2x.png')} /> {item.from}</p>
                 </div>
                 <div className='bridge_list_data_value'>
                   <p><FormattedMessage id='bridge8' /></p>
                   <p style={{ textAlign: 'right' }}><img className='success_status' src={require('../../assets/icon/' + item.toLogo.toUpperCase() + '@2x.png')} /> {item.to}</p>
                 </div>
               </div>
               <div className='bridge_list_data_title'>
                 <div className='bridge_list_data_value'>
                   <p><FormattedMessage id='bridge2' /></p>
                   <p>{formatAddress(item.destination)}</p>
                 </div>
                 <div className='bridge_list_data_value'>
                   <p><FormattedMessage id='bridge9' /></p>
                   <p style={{ textAlign: 'right' }}>{formatNumber(item.amount)}</p>
                 </div>
               </div>
               {
                 item.status == 1 && (
                   <div className='form-app__submit form-app__submit--row' style={{ marginBottom: '20px' }}>
                     <Button
                       className={'btn'}
                       type='button'
                       onClick={() => {
                         dispatch({
                           type: HANDLE_WALLET_MODAL,
                           walletModal: 'switchWithdraw',
                         })
                       }}
                     >
                       <FormattedMessage id='bridge10' />
                    </Button>
                   </div>
                 )
               }
             </div>
           )
         })
       }
      </div>
    </div>
  )
}

export default injectIntl(BridgeList)