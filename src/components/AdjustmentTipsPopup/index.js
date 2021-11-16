import React, {useState} from "react";
import {FormattedMessage} from "react-intl";
import cs from "classnames";
import {Checkbox} from "antd";

export default function AdjustmentTipsPopup() {

  const [showTips, setShowTips] = useState(()=>{
    const isConfirm = localStorage.getItem('adjustment_tips')
    return !isConfirm
  })
  const [check, setCheck] = useState()
  if (!showTips) {
    return null
  }
  const onConfirm = () => {
    if (check){
      localStorage.setItem('adjustment_tips', '1')
      setShowTips(false)
    }
  }
  return (
    <div className='modal-show'>
      <div className='wrapper'>
        <div className='modal'>
          <div className='modal__box'>
            <div className='farm_popup' action='/'>
              <div className='form-app__inner deposit farm_popup_box'>
                <div style={{padding: '20px 10px'}}>
                  <p><FormattedMessage id='adjustmentTips1' /></p>
                  <p><FormattedMessage id='adjustmentTips2' /></p>
                  <p><FormattedMessage id='adjustmentTips3' /></p>
                  <p><FormattedMessage id='adjustmentTips4' /></p>
                </div>
                <div className='form-app__submit--row check-footer'>
                  <div>
                    <Checkbox onChange={(e) => setCheck(e.target.checked)}>
                      <FormattedMessage id='adjustmentTips5' />
                    </Checkbox>
                  </div>
                  <div>
                    <button
                      style={{ flex: 0 }}
                      className='btn btn--medium'
                      disabled={!check}
                      onClick={onConfirm}
                      type='button'>
                      <FormattedMessage id='modalsText47' />
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
