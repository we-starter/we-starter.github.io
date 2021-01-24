import React, { useState, useCallback } from "react";
import { Slider, makeStyles } from "@material-ui/core";
import Cropper from "react-easy-crop";

import { CrossModalIcon, ZoomInIcon, ZoomOutIcon } from "../../icons";
import getCroppedImg from "../../utils/crop-image";

const useStyles = makeStyles(() => ({
    slider: {
        color: "#fad06a"
    },
    thumb: {
        height: "16px",
        width: "16px",
        marginTop: "-7px",
        "&:hover": {
            boxShadow: "0px 0px 0px 10px rgba(250, 208, 106, 0.24)"
        }
    }
}));

export const CropImageModal = ({ setCropModalOpen, tempImage, setCroppedImage }) => {
    const classes = useStyles();

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const applyCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels);
            setCroppedImage(croppedImage);
        } catch (e) {
            console.error("ERROR: ", e);
        }
        setCropModalOpen(false);
    }, [croppedAreaPixels]);

    return (
        <div className="modal">
            <div className="modal__box">
                <div className="modal__item">
                    <div className="form-crop form-app">
                        <h3 className="modal__title h3">
                            Create an Artwork Preview
                        </h3>
                        <div className="form-crop__container">
                            <Cropper
                                image={tempImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={3 / 3}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <div className="form-crop__slider">
                            <ZoomOutIcon />
                            <Slider
                                classes={{
                                    root: classes.slider,
                                    thumb: classes.thumb
                                }}
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                onChange={(e, zoom) => setZoom(zoom)}
                            />
                            <ZoomInIcon />
                        </div>
                        <div className="form-app__submit">
                            <button
                                type="button"
                                className="btn btn--medium"
                                onClick={applyCroppedImage}
                            >
                                Apply
                            </button>
                        </div>
                        <button
                            type="button"
                            className="form-app__close-btn button"
                            onClick={() => setCropModalOpen(false)}
                        >
                            <CrossModalIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
