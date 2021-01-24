import React, {useContext} from "react";
import {mainContext} from "../../reducer";
import success from "../../assets/icon/success.png";
import failed from "../../assets/icon/faild.png";
import rejected from "../../assets/icon/rejected.png";
import {HANDLE_TX_STATUS} from "../../const";

export const TXStatusModal = () => {
    const {dispatch, state} = useContext(mainContext);
    const {txStatus} = state;

    return (
        <div className="modal">
            <div className="modal__box">
                <div className="form-app">
                    <div className="form-app__inner transction-submitted">

                        {txStatus === 'success' && (
                            <>
                                <div className="transction-submitted__status">
                                    <img src={success}/>
                                </div>
                                <p className="form-app__title status">
                                    交易成功
                                </p>
                            </>
                        )}

                        {txStatus === 'failed' && (
                            <>
                                <div className="transction-submitted__status">
                                    <img src={failed}/>
                                </div>
                                <p className="form-app__title status">
                                    交易失败
                                </p>
                            </>
                        )}

                        {txStatus === 'rejected' && (
                            <>
                                <div className="transction-submitted__status">
                                    <img src={rejected}/>
                                </div>
                                <p className="form-app__title status">
                                    Transation rejected
                                </p>
                            </>
                        )}

                        <div className="form-app__submit form-app__submit--row">
                            <button style={{flex: 0}} type="button" className="btn btn--medium " onClick={() => {
                                dispatch({
                                    type: HANDLE_TX_STATUS,
                                    txStatus: null
                                });
                                window.location.reload()
                            }}>Confirm
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
