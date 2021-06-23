import React, { useContext, useEffect, useState } from 'react'
import cs from 'classnames'
import { useAllowance, useBalance } from '../../pages/Hooks'
import {
    HANDLE_WALLET_MODAL
} from '../../const'
import { Button, message } from 'antd'
import { getContract, useActiveWeb3React } from '../../web3'
import { mainContext } from '../../reducer'
import { FormattedMessage, injectIntl } from 'react-intl'
import BigNumber from 'bignumber.js'
import { formatAmount, fromWei, numToWei } from '../../utils/format'

const BridgeCard = (props) => {

    const { intl } = props

    const { account, active, library, chainId } = useActiveWeb3React()

    const [pool, setPool] = useState([])
    const [amount, setAmount] = useState('')
    const [approve, setApprove] = useState(true)
    const [loadFlag, setLoadFlag] = useState(false)

    const { dispatch, state } = useContext(mainContext)

    const onChange = () => {}

    const onMax = () => {}

    const onApprove = () => {}

    const purchaseBtn = () => {}

    return (
        <div className='bridge_card'>
            <div className='bridge_card_title'>
                Migrate to BSC(Binance Smart Chain)
            </div>
            <div className='deposit__inputbox form-app__inputbox'>
                <div className='form-app__inputbox-control'>
                    <div className='form-app__inputbox-input'>
                        <input
                            style={{ background: '#fff' }}
                            value={amount}
                            onChange={onChange}
                            className='input'
                            placeholder={intl.formatMessage({
                                id: 'money',
                            })}
                        />
                    </div>

                    <div className='form-app__inputbox-up' onClick={onMax}>
                        <div className='form-app__inputbox-up-pref'>
                            <FormattedMessage id='poolText19' />
                        </div>
                    </div>
                    {/* 设置滑点弹框 */}
                    <a
                        className='set_slippage'
                        onClick={() => {
                            dispatch({})
                        }}
                    >
                        <svg
                            t='1619325556317'
                            className='icon'
                            viewBox='0 0 1024 1024'
                            version='1.1'
                            p-id='2296'
                            width='24'
                            height='28'
                        >
                            <path
                                d='M146.285714 512c0-36.169143 4.022857-71.168 11.556572-104.667429 41.179429 2.486857 80.128-21.650286 100.754285-62.500571a140.8 140.8 0 0 0-2.962285-130.962286c44.214857-49.737143 98.742857-85.76 158.537143-104.704 18.724571 42.057143 56.502857 68.534857 97.792 68.534857s79.067429-26.477714 97.792-68.534857c59.757714 18.944 114.322286 55.003429 158.537142 104.704a140.8 140.8 0 0 0-2.998857 131.035429c20.662857 40.850286 59.611429 64.987429 100.827429 62.464 7.533714 33.462857 11.556571 68.461714 11.556571 104.630857 0 36.169143-4.022857 71.168-11.556571 104.667429-41.216-2.486857-80.128 21.650286-100.790857 62.464a140.8 140.8 0 0 0 2.962285 130.998857c-44.214857 49.737143-98.742857 85.76-158.537142 104.704-18.724571-42.057143-56.502857-68.534857-97.792-68.534857s-79.067429 26.477714-97.792 68.534857c-59.757714-18.944-114.322286-55.003429-158.537143-104.704a140.8 140.8 0 0 0 2.998857-131.035429c-20.662857-40.850286-59.611429-64.987429-100.827429-62.464A477.257143 477.257143 0 0 1 146.285714 512z m175.689143 125.403429a234.788571 234.788571 0 0 1 20.626286 147.273142 286.354286 286.354286 0 0 0 47.433143 31.341715c33.536-34.304 76.946286-53.284571 121.965714-53.248 46.08 0 89.161143 19.675429 121.965714 53.248a286.354286 286.354286 0 0 0 47.433143-31.341715 234.642286 234.642286 0 0 1 20.626286-147.273142c22.491429-44.544 58.550857-78.043429 101.302857-94.061715 1.682286-20.845714 1.682286-41.837714 0-62.683428-42.788571-16.018286-78.848-49.481143-101.339429-94.061715a234.642286 234.642286 0 0 1-20.626285-147.273142 285.696 285.696 0 0 0-47.433143-31.341715c-33.499429 34.304-76.946286 53.284571-121.929143 53.248-44.982857 0-88.429714-18.944-121.965714-53.248-16.64 8.740571-32.548571 19.2-47.433143 31.341715a234.642286 234.642286 0 0 1-20.626286 147.273142c-22.491429 44.544-58.550857 78.043429-101.302857 94.061715-1.682286 20.845714-1.682286 41.837714 0 62.683428 42.788571 16.018286 78.848 49.481143 101.339429 94.061715h-0.036572z m190.025143 0c-60.598857 0-109.714286-56.137143-109.714286-125.403429s49.115429-125.403429 109.714286-125.403429 109.714286 56.137143 109.714286 125.403429-49.115429 125.403429-109.714286 125.403429z m0-83.602286c20.187429 0 36.571429-18.724571 36.571429-41.801143s-16.384-41.801143-36.571429-41.801143-36.571429 18.724571-36.571429 41.801143 16.384 41.801143 36.571429 41.801143z'
                                p-id='2297'
                            ></path>
                        </svg>
                    </a>
                </div>
            </div>
            {approve && (
                <Button
                    className={'btn'}
                    type='button'
                    loading={loadFlag}
                    onClick={onApprove}
                >
                    <FormattedMessage id='farm20' />
                </Button>
            )}
            {!approve && (
                <Button
                    className={'btn'}
                    type='button'
                    loading={loadFlag}
                    onClick={purchaseBtn}
                >
                    <FormattedMessage id='warLBP2' />
                </Button>
            )}
            <div className='lbp_tip'>
                <p>
                    <a href={pool.farm_link} target='_blank'>
                        Powered by BlackHole & ChainSwap
                    </a>{' '}
                </p>
            </div>
        </div>
    )
}

export default injectIntl(BridgeCard)
