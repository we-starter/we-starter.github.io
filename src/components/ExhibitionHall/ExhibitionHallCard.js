import React from "react";
import { Link } from "react-router-dom";

export const ExhibitionHallCard = ({ item, handleHashtagClick }) => {
  const href = `/exhibition-hall/${item.tokenId}`
    return (
        <div className="exhibition-hall-list__item item">
            <Link to={href} className="item__image">
                <img src={item.image} alt="`$`" width="348" height="348" />
            </Link>
            <div className="item__content">
                <Link to={href} className="item__title h4">
                    {item.name}
                </Link>
                <p className="item__author">{item.artist}</p>
                <p className="item__hashtags">
                    {item.hashtags &&
                        item.hashtags.map(hashtag => (
                            <React.Fragment key={hashtag}>
                                <span onClick={() => handleHashtagClick(hashtag)}>
                                    #{hashtag}
                                </span>{" "}
                            </React.Fragment>
                        ))}
                </p>
                <p className="item__date">{new Date(item.dateCreated).toLocaleString()}</p>
            </div>
        </div>
    );
};
