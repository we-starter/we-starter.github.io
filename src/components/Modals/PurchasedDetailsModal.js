import React from "react";

import { CrossModalIcon } from "../../icons";

export const PurchasedDetailsModal = ({ item, setIsOpen }) => {
    return (
        <div className="modal">
            <div className="modal__box">
                <div className="modal__item">
                    <form
                        className="form-vote-new form-app"
                        action="/"
                        noValidate="novalidate"
                    >
                        <h3 className="modal__title h3">Artwork Details</h3>
                        <div className="auction-details__image-wrapper">
                            <div className="form-vote-new__img auction-details__image">
                                <picture>
                                    <img
                                        src={item.image}
                                        alt=""
                                        loading="lazy"
                                        width="180"
                                        height="115"
                                    />
                                </picture>
                            </div>
                            <div className="auction-details__price">
                                <div style={{ display: "flex" }}>
                                    <p>Token ID:</p>
                                    <h4> {item.tokenId}</h4>
                                </div>
                                {/*<div>*/}
                                {/*    <p>Contract address:</p>*/}
                                {/*    <div className="auction-purchased__token">*/}
                                {/*        <a href="/">0x84e517408b....516d9d</a>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                        <table className="form-vote__table auction-details__table">
                            <tbody>
                                <tr>
                                    <th>Name:</th>
                                    <td>{item.title}</td>
                                </tr>
                                <tr>
                                    <th>Details:</th>
                                    <td>
                                        {item.description}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="form-app__submit">
                            <button
                                className="btn btn--outline btn--medium modal__close"
                                style={{ maxWidth: "280px", margin: "0 auto" }}
                                type="button"
                                onClick={() => setIsOpen(false)}
                            >
                                OK
                            </button>
                        </div>
                        <button
                            type="button"
                            className="modal__close modal__close-btn button"
                            aria-label="Close modal"
                            onClick={() => setIsOpen(false)}
                        >
                            <CrossModalIcon />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
