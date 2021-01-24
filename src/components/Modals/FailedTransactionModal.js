import React, { useContext } from "react";

import { HANDLE_SHOW_FAILED_TRANSACTION_MODAL } from "../../const";
import { mainContext } from "../../reducer";
import { CrossModalIcon } from "../../icons";

export const FailedTransactionModal = () => {
    const { dispatch } = useContext(mainContext);

    return (
        <div className="modal">
            <div className="modal__box">
                <div className="form-app">
                    <div className="form-app__inner transction-submitted">
                        <div class="emoji  emoji--sad">
                            <div class="emoji__face">
                                <div class="emoji__eyebrows"/>
                                <div class="emoji__eyes"/>
                                <div class="emoji__mouth"/>
                            </div>
                        </div>

                        <h3 className="form-app__title h3">
                            Transaction failed, please try&nbsp;again
                        </h3>

                        <button
                            type="button"
                            className="transction-submitted__btn btn"
                            onClick={() => {
                                dispatch({
                                    type: HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
                                    showFailedTransactionModal: false
                                });
                            }}
                        >
                            Close
                        </button>

                        <button
                            type="button"
                            className="form-app__close-btn button"
                            onClick={() => {
                                dispatch({
                                    type: HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
                                    showFailedTransactionModal: false
                                });
                            }}
                            aria-label="Close"
                        >
                            <CrossModalIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
