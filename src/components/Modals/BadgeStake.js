import React, {useState} from 'react';

import Web3 from 'web3';
import cs from "classnames";
import {FormattedMessage} from "react-intl";
import {Button} from "antd";

const {fromWei} = Web3.utils;

export default function BadgeStake({pool, visible, setVisible}) {
  const [isApprovalToken, setIsApprovalToken] = useState(false)
  const [isApprovalNFT, setIsApprovalNFT] = useState(false)
  if (!visible) {
    return null
  }
  return (
    <div className='modal-show'>
      <div className='wrapper'>
        <div className='modal'>
          <div className='modal__box'>

            <form className='form-app farm_popup' action='/'>
              <div className='form-app__inner deposit farm_popup_box badge-stake-popup'>
                <div className="badge-stake-popup-title">
                  <div>Join WAR Pool</div>
                  <a className='farm_popup_close_btn' onClick={() => setVisible(false)}></a>
                </div>
                <p className="badge-stake-popup-ratio">{pool.ratio}</p>
                <div className="badge-stake-popup-card">
                  <img src={pool.nft.icon} alt=""/>
                  <div>
                    <h2>{pool.nft.name}</h2>
                    <p>ID {pool.nft.tokenId}</p>
                  </div>
                </div>
                <div className="badge-stake-popup-avaliable">
                  <div><FormattedMessage id="farm4"/></div>
                  <strong>1000 {pool.currency.symbol}</strong>
                </div>
                <div className='deposit__inputbox form-app__inputbox'>
                  <div className='form-app__inputbox-control'>
                    <div className='form-app__inputbox-input'>
                      <input
                        value={1}
                        // onChange={onChange}
                        className='input'
                        placeholder={() => <FormattedMessage id="farm15"/>}
                      />
                    </div>

                    <div
                      className={cs(
                        `form-app__inputbox-up`
                      )}
                      // onClick={onMax}
                    >
                      <div
                        className={cs(
                          `form-app__inputbox-up-pref`
                        )}
                      >
                        <FormattedMessage id='poolText19'/>
                      </div>
                    </div>
                  </div>
                </div>
                {
                  isApprovalNFT ? isApprovalToken ? (
                    <Button type="button" className={`ant-btn ant-btn-primary  ant-btn-primary_${pool.networkId}`}>Confirm</Button>
                  ) : (
                      <Button type="button" className={`ant-btn ant-btn-primary ant-btn-primary_${pool.networkId}`}>Approve {pool.currency.symbol}</Button>
                  ) : (
                    <Button type="button" className={`ant-btn ant-btn-primary ant-btn-primary_${pool.networkId}`}>Approve {pool.nft.name} NFT</Button>
                  )
                }
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
