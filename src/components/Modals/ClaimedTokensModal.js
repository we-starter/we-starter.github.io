import React  from "react";

import Web3 from 'web3'
import { getPercent } from '../../utils/time'
import { CrossModalIcon } from "../../icons";

const {fromWei} =Web3.utils

export const ClaimedTokensModal = ({onOk, rewards, symbol,stakedTime}) => {
    console.log('ClaimedTokensModal',rewards,stakedTime)
    return (
        <div className="modal">
            <div className="modal__box">
                <form className="form-app" action="/">
                    <div className="form-app__inner transction-submitted">
                        <div class="emoji emoji--yay">
                            <div class="emoji__face">
                                <div class="emoji__eyebrows"/>
                                <div class="emoji__mouth"/>
                            </div>
                        </div>
                        <div className="form-app__title h3">
                            <p className="color-gray">
                                You have successfully claimed
                            </p>
                            {`${rewards && fromWei((rewards*((100-getPercent(stakedTime))/100)).toString())} GLF`}
                        </div>
                        <button
                            type="button"
                            className="transction-submitted__btn btn"
                            onClick={onOk}
                        >
                            Ok
                        </button>
                        <button
                            type="button"
                            className="form-app__close-btn button"
                            onClick={onOk}
                            aria-label="Close"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path d="M14.5 10l7.39-7L24 5l-7.39 7L24 19l-2.11 2-7.39-7-7.39 7L5 19l7.39-7L5 5l2.11-2 7.39 7z"/>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
            {/*<button*/}
              {/*type="button"*/}
              {/*className="transction-submitted__btn btn"*/}
              {/*onClick={() => setClaimOpen(false)}*/}
            {/*>*/}
              {/*Ok*/}
            {/*</button>*/}
            {/*<button*/}
              {/*type="button"*/}
              {/*className="form-app__close-btn button"*/}
              {/*onClick={() => setClaimOpen(false)}*/}
              {/*aria-label="Close"*/}
            {/*>*/}
              {/*<CrossModalIcon />*/}
            {/*</button>*/}
          {/*</div>*/}
        {/*</form>*/}
      {/*</div>*/}
    {/*</div>*/}
  {/*)*/}
{/*}*/}
