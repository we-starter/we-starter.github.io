import React from "react";
import { Link } from "react-router-dom";

import { ArrowBackIcon } from "../icons";

export const BackButton = ({ toHome, toAuction, toPools, toExhibitionHall }) => (
    <div className="arrow-back">
        <Link
            to={`/${
                toHome
                    ? ""
                    : toAuction
                    ? "auction"
                    : toPools
                    ? "pools"
                    : toExhibitionHall
                    ? "exhibition-hall"
                    : ""
            }`}
        >
            <ArrowBackIcon /> Back
        </Link>
    </div>
);
