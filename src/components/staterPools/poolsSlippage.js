import React, { useContext, useEffect, useState } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { mainContext } from '../../reducer'
import { CHANGE_SLIPPAGE } from '../../const'
import cs from 'classnames'

const PoolsSlippage = (props) => {
  const { intl, icon, onClose, pool } = props
  const [amount, setAmount] = useState('')
  const [percentageVal, setPercentageVal] = useState(0.5)
  const [slippageInputVal, setSlippageInputVal] = useState(null)
  const { dispatch, state } = useContext(mainContext)
  const { slippageVal } = state

  useEffect(() => {
    if (slippageVal) {
      slippageVal == 0.5 ||
      slippageVal == 1 ||
      slippageVal == 5 ||
      slippageVal == 10
        ? setPercentageVal(slippageVal)
        : setAmount(slippageVal)
    }
  }, [])

  const onChange = (e) => {
    const { value } = e.target
    const re = /^[0-9]+([.|,][0-9]+)?$/g
    if (
      value === '' ||
      re.test(value) ||
      (value.split('.').length === 2 && value.slice(value.length - 1) === '.')
    ) {
      setAmount(value)
      setSlippageInputVal(amount)
      setPercentageVal(null)
    }
  }
  const onMax = () => {}
  //   存储滑点值
  const onConfirm = () => {
    dispatch({
      type: CHANGE_SLIPPAGE,
      slippageVal: slippageInputVal,
    })
    onClose()
  }
  useEffect(() => {
    if (percentageVal) {
      setAmount('')
      setSlippageInputVal(percentageVal)
    }
  }, [percentageVal])
  return (
    <>
      <div className='pools_slippage modal'>
        <div className='modal__box'>
          <form className='form-app' action='/'>
            <div className='form-app__inner deposit'>
              <h1 className='form-app__title h3' style={{ marginTop: 0 }}>
                <FormattedMessage id='warLBP4' />
              </h1>
              <p
                className='form-app__inputbox-after-text'
                style={{
                  marginBottom: 0,
                  color: '#22292F',
                  textAlign: 'left',
                  opacity: 1,
                }}
              >
                <FormattedMessage id='warLBP5' />
              </p>
              <div className='pools_slippage_percentage'>
                <a
                  className={cs(
                    'pools_slippage_percentage_value',
                    percentageVal == 0.5 && 'pools_slippage_percentage_active'
                  )}
                  onClick={() => setPercentageVal(0.5)}
                >
                  0.5%
                </a>
                <a
                  className={cs(
                    'pools_slippage_percentage_value',
                    percentageVal == 1 && 'pools_slippage_percentage_active'
                  )}
                  onClick={() => setPercentageVal(1)}
                >
                  1%
                </a>
                <a
                  className={cs(
                    'pools_slippage_percentage_value',
                    percentageVal == 5 && 'pools_slippage_percentage_active'
                  )}
                  onClick={() => setPercentageVal(5)}
                >
                  5%
                </a>
                <a
                  className={cs(
                    'pools_slippage_percentage_value',
                    percentageVal == 10 && 'pools_slippage_percentage_active'
                  )}
                  onClick={() => setPercentageVal(10)}
                >
                  10%
                </a>
                {/* <div className='pools_slippage_percentage_box'>
                  <input
                    value={amount}
                    onChange={onChange}
                    className={cs(
                      'pools_slippage_percentage_input',
                      amount && 'pools_slippage_percentage_input_active'
                    )}
                  />
                  <span>%</span>
                </div> */}
              </div>
              <div className='form-app__submit form-app__submit--row'>
                <button
                  className='btn btn--outline btn--medium'
                  type='button'
                  onClick={onClose}
                >
                  <FormattedMessage id='poolText20' />
                </button>
                <button
                  type='button'
                  className='btn btn--medium'
                  onClick={onConfirm}
                >
                  <FormattedMessage id='poolText22' />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default injectIntl(PoolsSlippage)
