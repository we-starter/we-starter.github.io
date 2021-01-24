import React, { useState } from "react";
import { Grow } from "@material-ui/core";

import { GalleryModal, ArtworkDetailsModal } from "../Modals";
import {formatAmount} from "../../utils/format";

export const ArtworkCard = ({ isNFT, figure }) => {

    console.log('figure',figure)
    const [isOpen, setIsOpen] = useState(false);
    const [galleryOpen, setGalleryOpen] = useState(false);

    return (
        <>
            <Grow in={true} timeout={1500}>
                {isNFT ? (
                    <div className="artwork-list__item">
                        <a
                            onClick={() => setGalleryOpen(true)}
                            className="artwork-list__img modal-gallery"
                        >
                            <picture>
                                <img
                                    src={figure.image}
                                    alt={figure.image}
                                    loading="lazy"
                                    width="264"
                                    height="170"
                                />
                            </picture>
                            <span className="artwork-list__badge">
                                <b
                                    className={`artwork-list__badge-inner ${
                                        true === 2 &&
                                        "artwork-list__badge-inner2"
                                    } ${
                                        true === 3 &&
                                        "artwork-list__badge-inner3"
                                    }`}
                                >
                                    {1}
                                </b>
                            </span>
                        </a>
                        <h2 className="artwork-list__title h3">{figure.title}</h2>
                        <p className="artwork-list__author">by {figure.name}</p>
                        {/*<div className="artwork-list__hashtag">*/}
                        {/*    <p>#vangogh</p>*/}
                        {/*</div>*/}
                        <button
                            type="button"
                            className="artwork-list__btn btn btn--gray"
                            onClick={() => setIsOpen(true)}
                        >
                            Redeemed Jan 15, 2020
                        </button>
                        <p className="artwork-list__token-id">
                            Token ID: {figure.tokenId}
                        </p>
                        {/*<p className="artwork-list__token-address">*/}
                        {/*    Token contract address*/}
                        {/*</p>*/}
                        {/*<p className="artwork-list__token-hash">*/}
                        {/*    <a href="/">*/}
                        {/*        0x84e517408ba6b891b9ac74b2f90013fcbc516d9d*/}
                        {/*    </a>*/}
                        {/*</p>*/}
                        <hr />
                        <div className="artwork-list__votes">
                          {formatAmount(figure.points)} Reward points
                        </div>
                    </div>
                ) : (
                    <div className="artwork-list__item">
                        <a
                            onClick={() => setGalleryOpen(true)}
                            className="artwork-list__img modal-gallery"
                        >
                            <picture>
                                <img
                                    src={figure.info.image}
                                    alt={figure.info.title}
                                    loading="lazy"
                                    width="264"
                                    height="170"
                                />
                            </picture>
                        </a>
                        <h2 className="artwork-list__title h3">{figure.info.title}</h2>
                        <p className="artwork-list__author">by {figure.info.name}</p>
                        <button
                            type="button"
                            className="artwork-list__btn btn btn--gray"
                        >
                            {new Date(figure.createAt * 1000).toLocaleDateString()}
                        </button>
                        <p className="artwork-list__desc">{figure.info.description}</p>
                        <hr />
                        <div className="artwork-list__votes">{formatAmount(figure.votes)} GLF Votes</div>
                    </div>
                )}
            </Grow>

            {isOpen && (
                <div className="modal-show">
                    <div className="wrapper">
                        <ArtworkDetailsModal figure={figure} setIsOpen={setIsOpen} />
                    </div>
                </div>
            )}

            {galleryOpen && (
                <div className="modal-show">
                  <div className="wrapper">
                    <GalleryModal
                        imgBig={figure.info.image}
                        setIsOpen={setGalleryOpen}
                    />
                  </div>
                </div>
            )}
        </>
    );
};
