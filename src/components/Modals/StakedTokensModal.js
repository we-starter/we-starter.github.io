import React, { useContext } from "react";

import { HANDLE_SHOW_STAKED_TOKENS_MODAL } from "../../const";
import { mainContext } from "../../reducer";
import {formatAmount} from "../../utils/format";
import { CrossModalIcon } from "../../icons";

export const StakedTokensModal = ({onOk, amount, symbol}) => {

    return (
        <div className="modal">
            <div className="modal__box">
                <form className="form-app" action="/">
                    <div className="form-app__inner transction-submitted">
                        <div className="emoji emoji--yay">
                            <div className="emoji__face">
                                <div className="emoji__eyebrows"/>
                                <div className="emoji__mouth"/>
                            </div>
                        </div>
                        <div className="form-app__title h3">
                            <p className="color-gray">
                                You have successfully staked
                            </p>
                            {`${amount && amount} ${symbol}`}
                        </div>
                        <button
                            type="button"
                            className="transction-submitted__btn btn"
                            onClick={onOk}>
                            Ok
                        </button>
                        <button
                            type="button"
                            className="form-app__close-btn button"

                            aria-label="Close"
                        >
                            <CrossModalIcon />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
