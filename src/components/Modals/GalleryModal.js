import React from "react";

import { CrossModalIcon } from "../../icons";

export const GalleryModal = ({ setIsOpen, imgBig }) => {
    return (
        <div className="modal">
            <div
                className="modal__item"
                style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            >
                <img style={{maxHeight: '100vh',maxWidth: '100vw'}} src={imgBig} alt="" />
            </div>

            <button
                type="button"
                style={{
                    display: "block",
                    position: "absolute",
                    top: "50px",
                    right: "50px",
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    border: "none",
                    outline: 0,
                    cursor: "pointer"
                }}
                aria-label="Close modal"
                onClick={() => setIsOpen(false)}
            >
                <CrossModalIcon width={40} height={40} />
            </button>
        </div>
    );
};
