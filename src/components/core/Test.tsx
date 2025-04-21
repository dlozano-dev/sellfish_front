import { useState } from "react";
import { Area } from "react-easy-crop";
import { EMPTY } from "../../utils/Constants.tsx";
import { FileInput } from "./FileInput.tsx";
import { ImageCropper } from "./ImageCropper.tsx";

export const Test = () => {
    const [image, setImage] = useState<string>(EMPTY);
    const [currentPage, setCurrentPage] = useState<"choose-img" | "crop-img" | "img-cropped">("choose-img");
    const [imgAfterCrop, setImgAfterCrop] = useState<string>(EMPTY);

    // Callback function when an image is selected
    const onImageSelected = (selectedImage: string | ArrayBuffer | null) => {
        if (typeof selectedImage === "string") {
            setImage(selectedImage);
            setCurrentPage("crop-img");
        }
    };

    // Callback function when cropping is done
    const onCropDone = (imgCroppedArea: Area) => {
        // Create a canvas element to crop the image
        const canvasElement = document.createElement("canvas");
        canvasElement.width = imgCroppedArea.width;
        canvasElement.height = imgCroppedArea.height;

        const ctx = canvasElement.getContext("2d");

        // Load the selected image
        const imageObject = new Image();
        imageObject.src = image;
        imageObject.onload = function () {
            // Draw the cropped portion of the image onto the canvas
            ctx?.drawImage(
                imageObject,
                imgCroppedArea.x,
                imgCroppedArea.y,
                imgCroppedArea.width,
                imgCroppedArea.height,
                0,
                0,
                imgCroppedArea.width,
                imgCroppedArea.height
            );

            // Convert the canvas content to a data URL (JPEG format)
            const dataURL = canvasElement.toDataURL("image/jpeg");
            setImgAfterCrop(dataURL);
            setCurrentPage("img-cropped");
        };
    };

    // Callback function when cropping is canceled
    const onCropCancel = () => {
        setCurrentPage("choose-img");
        setImage(EMPTY);
    };

    return (
        <div className='w-screen h-screen'>
            { currentPage === "choose-img" ? (
                <FileInput onImageSelected={onImageSelected} />
            ) : currentPage === "crop-img" ? (
                <ImageCropper
                    image={image}
                    onCropDone={onCropDone}
                    onCropCancel={onCropCancel}
                />
            ) : (
                <div>
                    <img src={imgAfterCrop} alt="crop-img" />
                </div>
            )}
        </div>
    );
}