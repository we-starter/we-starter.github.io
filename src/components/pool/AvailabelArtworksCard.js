import React, { useState } from "react";

import { GalleryModal, RedeemArtworkModal } from "../Modals";
import {formatAmount} from "../../utils/format";

export const AvailabelArtworksCard = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [galleryOpen, setGalleryOpen] = useState(false);
    return (
        <>
            <div className="available-artworks-list__item item">
                <a
                    onClick={() => setGalleryOpen(true)}
                    className="item__img modal-gallery"
                >
                    <picture>
                        <img
                            style={{objectFit: 'cover'}}
                            src={item.image}
                            alt="Starry Night"
                            loading="lazy"
                            width="264"
                            height="170"
                        />
                    </picture>
                </a>
                <h2 className="item__title h3">{item.title}</h2>
                <p className="item__author">by {item.name}</p>
                {/*<div className="item__hashtag">*/}
                {/*    <p>#{item.hashtag}</p>*/}
                {/*</div>*/}
                <button
                    type="button"
                    className="item__btn btn"
                    disabled={item.redeemed}
                    onClick={() => setIsOpen(true)}
                >
                    {item.redeemed? 'Redeemed': 'Redeem'}
                </button>
                <p class="item__token">Token ID: {item.tokenId}</p>
                {/*<div class="item__address">*/}
                {/*    <p class="item__address-title">Token contract address</p>*/}
                {/*    <a href="/" class="item__address-link">*/}
                {/*        {item.address}*/}
                {/*    </a>*/}
                {/*</div>*/}
                {/*<p class="item__redeemed">*/}
                {/*    <span class="item__redeemed-green">*/}
                {/*        {item.redeemed} redeemed*/}
                {/*    </span>{" "}*/}
                {/*    / <span class="item__redeemed-yellow">{item.left} left</span>*/}
                {/*</p>*/}
                <hr />
                <div className="item__votes">{formatAmount(item.points)} Reward points</div>
            </div>

            {galleryOpen && (
                <div className="modal-show">
                    <div className="wrapper">
                        <GalleryModal
                            imgBig={item.image}
                            setIsOpen={setGalleryOpen}
                        />
                    </div>
                </div>
            )}

            {isOpen && (
                <div className="modal-show">
                    <div className="wrapper">
                        <RedeemArtworkModal figure={item} setIsOpen={setIsOpen} />
                    </div>
                </div>
            )}
        </>
    );
};
