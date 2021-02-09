import React, { useState } from 'react'
import { usage } from 'browserslist'

export const PoolsJoin = ({ onChange, onClose, onConfirm }) => {
  const [amount, setAmount] = useState('')
  const onMax = () => {}
  return (
    <div className='modal'>
      <div className='modal__box'>
        <form className='form-app' action='/'>
          <div className='form-app__inner deposit'>
            <h1 className='form-app__title h3'>Join XXX Pool</h1>

            <div className='deposit__inputbox form-app__inputbox'>
              <div className='form-app__inputbox-control'>
                <div className='form-app__inputbox-input'>
                  <input
                    value={amount}
                    onChange={onChange}
                    className='input'
                    placeholder='输入投资金额'
                  />
                </div>

                <div className='form-app__inputbox-up' onClick={onMax}>
                  <div className='form-app__inputbox-up-pref'>Max</div>
                </div>
              </div>
            </div>

            <div className='form-app__submit form-app__submit--row'>
              <button
                className='btn btn--outline btn--medium'
                type='button'
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type='button'
                className='btn btn--medium'
                onClick={onConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
